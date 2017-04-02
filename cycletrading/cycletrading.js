const mongoose = require('mongoose');
const Tick = mongoose.model('Tick');
const Graph = require('./graph');

let graph = new Graph();
let cycles = [];
let scores = [];
let currencies;

exports.start = function(socket, user_id, start, amount){
    Tick.find().distinct('currencyPair').exec((err, curr) => {
        currencies = curr;
        for(i in curr){
            let v1 = curr[i].split('_')[0];
            let v2 = curr[i].split('_')[1];

            if(!graph.hasVertex(v1)) graph.addVertex(v1);
            if(!graph.hasVertex(v2)) graph.addVertex(v2);
            if(!graph.hasEdge(v1, v2)) graph.addEdge(v1, v2);
        }
        find_cycles(start, start);
        assign_scores(amount, amount, () => {
            //finished assigning scores
            console.log(scores);
        });
    });
};

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

function assign_scores(starting_amount, actual_amount, callback){
    for(i in cycles){
        const cycle = cycles[i];
        ((pos) => {
            calculate_ending_amount(actual_amount, cycle, 0.0025, (ending_amount) => {
                if(ending_amount < starting_amount) scores.push({position: pos, score: -1});
                else scores.push({position: pos, score: ending_amount-starting_amount});
                if(scores.length == cycles.length) callback();
            });
        })(i);
    }
}

function get_exchange(v1, v2, callback){
    if(currencies.indexOf(v1+'_'+v2) >= 0){
        Tick.findOne({'currencyPair': v1+'_'+v2}).sort({timestamp: 'desc'}).limit(1).exec((err, tick) => {
            if(err) callback(err, undefined);
            else callback(undefined, tick.last);
        });
    }else{
        Tick.findOne({'currencyPair': v2+'_'+v1}).sort({timestamp: 'desc'}).limit(1).exec((err, tick) => {
            if(err) callback(err, undefined);
            else callback(undefined, 1/tick.last);
        });
    }
}

function calculate_ending_amount(actual_amount, order, fee, callback){
    let last = undefined;
    let actual = actual_amount;
    let count = 0;
    for(let c of order){
        if(last !== undefined){
            get_exchange(last, c, (err, last) => {
                actual = actual*last*(1-fee);
                count += 1;
                if(count == order.length) callback(actual);
            });
        }
        last = c;
    }
}
