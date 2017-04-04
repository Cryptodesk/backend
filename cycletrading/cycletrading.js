const mongoose = require('mongoose');
const Tick = mongoose.model('Tick');
const Graph = require('./graph');
const Poloniex = require('poloniex-api-node');

let poloniex = undefined;
let graph = new Graph();
let cycles = [];
let scores = [];
let currencies;

exports.start = function(socket, user_id, start, amount){
    User.findOne((err, user) => {
        if(!err) poloniex = new Poloniex(user.poloniex_key, user.poloniex_secret);
        start();
    });
};

function start(){
    Tick.find().distinct('currencyPair').exec((err, curr) => {
        currencies = curr;
        for(i in curr){
            let v1 = curr[i].split('_')[0];
            let v2 = curr[i].split('_')[1];

            if(!graph.hasVertex(v1)) graph.addVertex(v1);
            if(!graph.hasVertex(v2)) graph.addVertex(v2);
            if(!graph.hasEdge(v1, v2)) graph.addEdge(v1, v2);
        }
        socket.emit('info', {started:true});
        start_cycle(socket, user_id, [], undefined, start, start, amount, amount);
    });
}

function start_cycle(socket, user_id, visited, last, actual, end, initial_amount, actual_amount){
    if(actual !== end || last === undefined){
        find_cycles(actual, end);
        update_data((err, data) => {
            assign_scores(data, initial_amount, actual_amount, visited, last, actual, end, () => {
                //finished assigning scores
                scores.sort((a, b) => {return a.score < b.score ? 1 : (a.score > b.score ? -1 : 0)});
                const next_hop = cycles[scores[0].position][1];
                trade(data, actual, next_hop, actual_amount, (err, new_amount) => {
                    // const new_amount = actual_amount*get_exchange(data, actual, next_hop);
                    socket.emit('movement', JSON.stringify({from: actual, to: next_hop, actual_amount: actual_amount, new_amount:new_amount}));
                    visited[new_amount] += 1;
                    cycles = [];
                    scores = [];
                    start_cycle(socket, user_id, visited, actual, next_hop, end, initial_amount, new_amount);
                });
            });
        });

    }else{
        socket.emit('info', JSON.stringify({finished: true, initial: initial_amount, end: actual_amount}));
    }
}

function _find_cycles(end, current, order){
    order.push(current);
    let edges = graph.getVertexEdges(current);
    for(let node of edges){
        if(order.indexOf(node) === -1){
            _find_cycles(end, node, order);
        }else if(node === end && order.length > 3){
            ((o, s) => {
                let r = [];
                for(let n of o){
                    r.push(n);
                }
                r.push(s);
                cycles.push(r);
            })(order, end);
        }
    }
    order.pop();
}
function find_cycles(start, end) {
    cycles = [];
    let edges = graph.getVertexEdges(start);
    if(edges !== undefined){
        let order = [];
        order.push(start);
        for(let node of edges){
            _find_cycles(end, node, order);
        }
    }
}

function assign_scores(data, initial_amount, actual_amount, visited, last, actual, end, callback){
    for(let i in cycles){
        if(cycles.hasOwnProperty(i)){
            const cycle = cycles[i];
            const ending_amount = calculate_ending_amount(data, initial_amount, cycle, 0.0025);
            if(ending_amount < initial_amount) scores.push({position: i, score: -1});
            else {
                let score = ending_amount-initial_amount;
                if(last && last === cycle[1]) score = score*0.9;
                if(visited[cycle[1]] > 2) score = score*0.3;
                scores.push({position: i, score: score});
            }
        }
    }
    callback();
}

function get_exchange(data, v1, v2){
    for(let c of data){
        if(v1+'_'+v2 === c._id){
            return c.last;
        }else if(v2+'_'+v1 === c._id){
            return 1/c.last;
        }
    }
}

function calculate_ending_amount(data, actual_amount, order, fee){
    let last = undefined;
    let actual = actual_amount;
    for(let c of order){
        if(last !== undefined){
            actual = actual*get_exchange(data, last, c)*(1-fee);
        }
        last = c;
    }
    return actual;
}

function update_data(callback){
    Tick.aggregate({$group: {_id: '$currencyPair',
                             timestamp: {$last: '$timestamp'},
                             last: {$last: '$last'}}}).sort({timestamp: 'desc'}).exec((err, data) => {
        if(err) callback(err, undefined);
        else callback(err, data);
    });
}

function trade(data, from, to, amount, callback){
    let market;
    let rate = get_exchange(data, from, to);
    if(poloniex){
        if(currencies.indexOf(from+'_'+to) >= 0){ //from_to is the market
            // buy
            market = from+'_'+to;
            poloniex.buy(market, rate, amount, true, true, false, (err, ret) => {
                console.log(ret);
                if(err) callback(err, undefined);
                else callback(undefined, amount*rate);
            });
        }else if(currencies.indexOf(to+'_'+from) >= 0){ // to_from is the market
            // sell
            market = to+'_'+from;
            poloniex.sell(market, rate, amount, true, true, false (err, ret) => {
                console.log(ret);
                if(err) callback(err, undefined);
                else callback(undefined, amount*rate);
            });
        }
    }
}
