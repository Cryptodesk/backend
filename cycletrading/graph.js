// class based on https://github.com/benoitvallon/computer-science-in-javascript/blob/master/data-structures-in-javascript/graph.es6.js

class Graph {
    constructor() {
        this.vertices = [];
        this.edges = [];
        this.numberOfEdges = 0;
    }

    addVertex(vertex) {
        this.vertices.push(vertex);
        this.edges[vertex] = [];
    }

    hasVertex(vertex) {
        return (this.vertices.indexOf(vertex) !== -1);
    }

    removeVertex(vertex) {
        const index = this.vertices.indexOf(vertex);
        if(~index) {
            this.vertices.splice(index, 1);
        }
        while(this.edges[vertex].length) {
            const adjacentVertex = this.edges[vertex].pop();
            this.removeEdge(adjacentVertex, vertex);
        }
    }

    addEdge(vertex1, vertex2) {
        this.edges[vertex1].push(vertex2);
        this.edges[vertex2].push(vertex1);
        this.numberOfEdges++;
    }

    removeEdge(vertex1, vertex2) {
        const index1 = this.edges[vertex1] ? this.edges[vertex1].indexOf(vertex2) : -1;
        const index2 = this.edges[vertex2] ? this.edges[vertex2].indexOf(vertex1) : -1;
        if(~index1) {
            this.edges[vertex1].splice(index1, 1);
            this.numberOfEdges--;
        }
        if(~index2) {
            this.edges[vertex2].splice(index2, 1);
        }
    }

    hasEdge(vertex1, vertex2) {
        return (this.edges[vertex1].indexOf(vertex2) !== -1) && (this.edges[vertex2].indexOf(vertex1) !== -1);
    }

    getVertexEdges(vertex){
        return this.edges[vertex];
    }

    size() {
        return this.vertices.length;
    }

    relations() {
        return this.numberOfEdges;
    }

    print() {
        console.log(this.vertices.map(function(vertex) {
            return (`${vertex} -> ${this.edges[vertex].join(', ')}`).trim();
        }, this).join(' | '));
    }
}

module.exports = Graph
