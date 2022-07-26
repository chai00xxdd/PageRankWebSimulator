class Graph {
    constructor(num_nodes = 0) {
        this.init_graph(num_nodes)

    }
    add_edge(u, v) {
        if (this.is_edge_exists(u, v))
            return false;
        this.vertices.get(u).push(v)
        this.num_edges++;
        this.max_edges_was++;
        return true;
    }

    replace_nodes_names(u, v) {
        for (const node of this.nodes) {
            let neighbors = this.get_neighbors(node)
            neighbors = neighbors.map(x => x == u ? v : (x == v ? u : x))
            this.vertices.set(node, neighbors)
        }


        const u_new_neighbors = this.get_neighbors(v)
        const v_new_neighbors = this.get_neighbors(u)
        //console.log(u_new_neighbors)

        // console.log(v_new_neighbors)

        this.vertices.set(u, u_new_neighbors)
        this.vertices.set(v, v_new_neighbors)



    }

    init_graph(num_nodes) {
        this.num_nodes = num_nodes
        this.vertices = new Map()
        this.nodes = []
        this.num_edges = 0
        this.max_edges_was = 0
        if (num_nodes == 0)
            return
        this.nodes = range(1, num_nodes + 1)
        for (let i = 1; i < num_nodes + 1; i++) {
            this.vertices.set(i, [])
        }
    }

    copy() {
        let g = new Graph()
        g.num_nodes = this.num_nodes
        g.max_edges_was = this.max_edges_was
        g.num_edges = this.num_edge
        g.nodes = [...this.nodes]
        for (const [node, neighbors] of this.vertices) {
            g.vertices.set(node, neighbors)
        }

        return g
    }

    clear() {
        this.init_graph(0)
    }

    is_node_exists(u) {
        return this.vertices.has(u)
    }

    is_edge_exists(u, v) {
        return this.is_node_exists(u) && this.get_neighbors(u).indexOf(v) != -1
    }

    remove_node(u) {
        if (!this.is_node_exists(u)) {
            console.log('here wired')
            return false;
        }
        let num_edges_to_erase = this.get_neighbors(u).length;
        for (let [v, neighbors_v] of this.vertices) {
            if (v == u)
                continue;
            this.remove_edge(v, u)

        }
        this.num_edges -= num_edges_to_erase
        this.num_nodes--
        this.nodes = this.nodes.filter(x => x != u)
        this.vertices.delete(u)
        return true;
    }

    get_next_node_id() {
        return Math.max(...this.nodes.concat([0])) + 1
    }

    add_node() {
        const new_node_id = this.get_next_node_id()
        this.vertices.set(new_node_id, [])
        this.nodes.push(new_node_id)
        this.num_nodes++;
        return new_node_id
    }

    remove_edge(u, v) {
        if (!this.is_edge_exists(u, v))
            return false;
        this.vertices.set(u, this.vertices.get(u).filter(x => x != v))
        this.num_edges--
        return true;
    }

    get_all_edges() {
        let edges = []
        for (const [v, v_neighbors] of this.vertices) {
            for (let u of v_neighbors) {
                edges.push([v, u])
            }
        }

        return edges
    }

    get_neighbors(u) {
        return this.vertices.get(u)
    }
    get_random_neighbor(u) {
        const neighbors = this.get_neighbors(u)
        if (neighbors.length > 0)
            return getRandomItem(neighbors);
        return u;

    }

    get_parents(u) {
        let parents = []
        for (const [v, v_neighbors] of this.vertices) {
            if (v_neighbors.indexOf(u) != -1)
                parents.push(v)
        }

        return parents
    }

    get_din_vec() {
        let din_vec = []
        for (const v of this.nodes) {
            din_vec.push(this.get_parents(v).length)
        }

        return din_vec
    }

    get_din(v) {
        return this.get_parents(v).length
    }

    is_sink(v) {
        return this.get_neighbors(v).length == 0
    }

    is_source(v) {
        return this.get_din(v) == 0
    }

    get_sinks() {
        return this.nodes.filter(node => this.is_sink(node))
    }

    get_sources() {
        return this.nodes.filter(node => this.is_source(node))
    }

    get_random_vertex() {
        return getRandomItem(this.nodes)
    }


}

class GraphGroup {

    static NODES = 'nodes'
    static EDGES = 'edges'

}