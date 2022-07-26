class PageRank {
    constructor(graph) {
        this.init_pagerank(graph)
    }

    init_pagerank(graph) {
        this.graph = graph
        let nodes_ranks = graph.nodes.map(node => [node, 0])
        this.visits = new Map(nodes_ranks)
        this.ranks = new Map(nodes_ranks)
        this.iterations = 0
    }

    get_ranks() {
        this.ranks.clear();
        for (let [v, visits] of this.visits) {
            this.ranks.set(v, visits / Math.max(1, this.iterations))
        }
        return this.ranks;
    }

    run_iteration(N, p) {
        this.iterations++;
        const v = new RandomWalk(this.graph, N, p).walk()
        this.visits.set(v, this.visits.get(v) + 1)

    }

    get_iterations() {
        return this.iterations
    }

    run(N, t, p) {
        if (this.iterations != 0)
            this.init_pagerank(this.graph)
        while (t-- > 0) {
            this.run_iteration(N, p)
        }
        return this.get_ranks()
    }
}

class RandomWalk {
    constructor(graph, N, p) {
        this.graph = graph
        this.N = N
        this.p = p
    }

    walk() {
        let v = this.graph.get_random_vertex()
        for (let i = 0; i < this.N; i++) {
            if (accept_prob(this.p)) {
                v = this.graph.get_random_vertex()
            }
            else {
                v = this.graph.get_random_neighbor(v)
            }
        }
        this.last_node_of_walk = v
        return v
    }

    get_last_node_of_walk() {
        return this.last_node_of_walk
    }
}

function get_din_avg_rank(graph, ranks_map) {
    const nodes = graph.nodes
    const nodes_din = graph.get_din_vec()
    const din_vec = sort([...new Set(nodes_din)])
    let din_avg_rank = []

    din_vec.forEach(din => {
        vertices_with_din = nodes.filter((x, index) => nodes_din[index] == din)
        din_ranks_sum = sum(vertices_with_din.map(x => ranks_map.get(x)))
        din_avg_rank.push(din_ranks_sum / vertices_with_din.length)
    })

    return [din_vec, din_avg_rank]
}