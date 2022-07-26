class PageRankController {
    constructor(graph_container, node_size = 50) {
        this.init(graph_container, node_size)

    }

    init(graph_container, node_size) {
        this.graph_container = graph_container
        this.graph_drawer = create_cy(graph_container, node_size)
        this.selectedNode = null
        this.graph = new Graph()
        this.on_node_removed_call_backs = []
        this.on_edge_removed_call_backs = []
        this.on_node_add_call_backs = []
        this.on_clear_call_backs = []
        this.on_set_graph_call_backs = []
        this.node_size = node_size
        this.init_events()
    }

    add_on_set_graph_listener(callback) {
        this.on_set_graph_call_backs.push(callback)
    }

    add_on_clear_listener(callback) {
        this.on_clear_call_backs.push(callback)
    }

    add_on_node_add_listner(callback) {
        this.on_node_add_call_backs.push(callback)
    }

    add_on_node_remove(callback) {
        this.on_node_removed_call_backs.push(callback)
    }

    add_on_edge_remove(callback) {
        this.on_node_removed_call_backs.push(callback)
    }

    get_graph() {
        return this.graph
    }

    destroy() {
        clearInterval(this.fixNodePosInterval)
    }

    init_events() {

        this.start_auto_fix_node_position_interval()
        this.graph_drawer.on('tap', evt => {
            const target = evt.target
            if (target == this.graph_drawer || target.group() != GraphGroup.NODES) {
                this.selectedNode = null
            }

        })
        this.graph_drawer.on('cxttap', 'node', e => {
            this.remove_node_elem(e.target)
        })
        this.graph_drawer.on('cxttap', 'edge', e => {
            this.remove_edge_elem(e.target)
        })
        this.graph_drawer.on('tap', 'node', e => {
            const prev_selected = this.selectedNode
            this.selectedNode = e.target.id()
            if (prev_selected != null && this.add_edge(parseInt(prev_selected), parseInt(e.target.id()))) {
                this.selectedNode = null

            }

        })

    }

    add_page(x = 50, y = 50) {
        const node_number = this.graph.add_node()
        this.add_page_element(node_number, x, y)
        return node_number
    }

    add_page_element(node_number, x = 50, y = 50) {
        const [offset_x, offset_y] = this.get_pan_offsets()
        const node_element = this.graph_drawer.add({ group: GraphGroup.NODES, data: { id: node_number, name: `page ${node_number}` }, position: { x: x - offset_x, y: y - offset_y } })
        this.on_node_add_call_backs.forEach(callback => callback(node_number))
    }

    put_nodes_bfs_position() {
        this.position_nodes(NodesPositionLayoutName.BFS)
    }

    remove_edge_elem(edge) {
        const u = parseInt(edge.data('source'))
        const v = parseInt(edge.data('target'))
        this.graph.remove_edge(u, v)
        this.graph_drawer.remove(edge)
        this.on_edge_removed_call_backs.forEach(callback => {
            callback(g, [u, v])
        })
    }

    remove_edge(u, v) {
        const edges_element = this.graph_drawer.edges()
        edges_element = edges_element.filter(edge => edge.data('source') == u && edge.data('target') == v);
        if (edges_element.length > 0) {
            this.remove_edge_elem(edges_element[0])
        }

    }

    remove_node(u) {
        const node_elem = this.graph_drawer.getElementById(u)
        if (node_elem)
            this.remove_node(node_elem)
    }

    remove_node_elem(node) {
        const vertex_id = parseInt(node.data('id'))
        this.graph_drawer.remove(node)
        this.graph.remove_node(vertex_id)
        this.on_node_removed_call_backs.forEach(callback => {
            callback(this.graph, vertex_id)
        })

    }

    add_edge(u, v) {
        const added_edge = this.graph.add_edge(u, v)
        if (added_edge) {
            this.add_edge_element(u, v)
        }
        return added_edge
    }

    add_edge_element(u, v, edge_id = null) {
        this.graph_drawer.add({ group: GraphGroup.EDGES, data: { id: `edge${edge_id ? edge_id : this.graph.max_edges_was}`, source: u, target: v } })
    }


    run_page_rank(config = { walk_length: 32, iterations: 10000, random_vertex_probality: 1 / 32 }) {
        const ranks = new PageRank(this.graph).run(config.walk_length, config.iterations, config.random_vertex_probality)
        this.set_pages_names(page_id => `page ${page_id} (${ranks.get(page_id)})`)
        return ranks;
    }

    set_page_name(id, name) {
        const node_element = this.graph_drawer.getElementById(id)
        node_element.data('name', name)
    }

    set_graph(new_graph) {
        this.clear()
        this.graph = new_graph.copy()
        this.draw_graph(this.graph)
        this.on_set_graph_call_backs.forEach(callback => callback())

    }

    create_display_random_tree(num_nodes) {
        const tree = create_random_tree(num_nodes)
        this.set_graph(tree)
        this.put_nodes_bfs_position()
    }

    create_display_random_graph_by_edge_prob(num_nodes, edge_prob) {
        const g = create_random_graph_by_same_edge_prob(num_nodes, edge_prob)
        this.set_graph(g)
        this.choose_put_nodes_position_by_num_nodes()
    }

    choose_put_nodes_position_by_num_nodes() {
        if (this.graph.num_nodes > 4) {
            this.put_nodes_grid_position()
        }
        else {
            this.put_nodes_circle_position()
        }
    }

    create_display_random_graph_by_node_in_edge_prob(num_nodes, nodes_in_edge_probs) {
        const g = create_random_graph_by_in_edge_prob_of_node(num_nodes, nodes_in_edge_probs)
        this.set_graph(g)
        this.choose_put_nodes_position_by_num_nodes()
    }


    draw_graph(g) {
        for (const node of g.nodes) {
            this.add_page_element(node)
        }

        let edge_id = 1
        for (const [u, v] of g.get_all_edges()) {
            this.add_edge_element(u, v, edge_id++)
        }
    }



    set_pages_names(page_id_to_name_func) {
        this.graph.nodes.forEach(page_id => {
            this.set_page_name(page_id, page_id_to_name_func(page_id))
        })
    }

    put_nodes_random_position() {
        this.position_nodes(NodesPositionLayoutName.RANDOM)
    }

    put_nodes_circle_position() {
        this.position_nodes(NodesPositionLayoutName.CIRCLE)
    }

    put_nodes_grid_position() {
        this.position_nodes(NodesPositionLayoutName.GRID)
    }

    fix_nodes_offset() {
        const [offset_x, offset_y] = this.get_pan_offsets()
        const zoom = this.graph_drawer.zoom()
        for (const node of this.graph_drawer.nodes()) {
            const pos = node.position()
            node.position('x', pos.x + offset_x / zoom)
            node.position('y', pos.y + offset_y / zoom)
        }

        this.graph_drawer.pan('x', 0)
        this.graph_drawer.pan('y', 0)

    }

    fit_positions() {
        this.graph_drawer.fit()
        this.fix_nodes_offset()
    }

    position_nodes(position_name = NodesPositionLayoutName.RANDOM) {
        const num_nodes = this.graph_drawer.nodes().length
        const sources = this.graph.get_sources()
        if (num_nodes > 1) {
            const random_layout = this.graph_drawer.layout({
                name: position_name,
                animate: false,
                roots: position_name == NodesPositionLayoutName.BFS && sources.length != 0 ? this.graph.get_sources() : undefined
            })
            random_layout.run()
        }
        else {
            this.graph_drawer.center()
        }
        this.fix_nodes_offset()
    }

    clear_ranks() {
        this.set_pages_names(page_id => `page ${page_id}`)
    }


    get_pan_offsets() {
        const offset_x = this.graph_drawer.pan('x')
        const offset_y = this.graph_drawer.pan('y')
        return [offset_x, offset_y]
    }

    start_auto_fix_node_position_interval(time_ms = 20) {
        const graph_drawer = this.graph_drawer

        this.fixNodePosInterval = setInterval(() => {

            if (graph_drawer.nodes().length == 0)
                return;
            const node_fixed_width = graph_drawer.nodes()[0].width() / 2
            const node_fixed_height = graph_drawer.nodes()[0].height() / 2
            const zoom = graph_drawer.zoom()
            const container_width = (graph_drawer.width()) / zoom
            const container_height = (graph_drawer.height()) / zoom


            for (const node of graph_drawer.nodes()) {
                if (node.position().x + node_fixed_width >= container_width - 1) {
                    node.position('x', container_width - node_fixed_width - 2)
                }
                if (node.position().x - node_fixed_width < 0) {
                    node.position('x', node_fixed_width)
                }

                if (node.position().y - node_fixed_height < 0) {
                    node.position('y', node_fixed_height)
                }
                if (node.position().y + node_fixed_height >= container_height - 1) {
                    node.position('y', container_height - node_fixed_height - 2)
                }
            }

        }, time_ms)
    }

    stop_auto_fix_node_position_interval() {
        clearInterval(this.auto_fix_node_interval)
    }

    clear() {

        this.graph.clear()
        this.graph_drawer.remove(this.graph_drawer.nodes())
        this.graph_drawer.reset()
        this.selectedNode = null
        this.on_clear_call_backs.forEach(callback => callback())

    }

}

class NodesPositionLayoutName {
    static CIRCLE = 'circle'
    static GRID = 'grid'
    static BFS = 'breadthfirst'
    static RANDOM = 'random'
}