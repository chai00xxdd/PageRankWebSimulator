function create_random_graph_by_in_edge_prob_of_node(num_nodes, nodes_edge_prob) {

    if (!check_nums_in_range(nodes_edge_prob, 0, 1)) {
        throw_exception(ExceptionType.OUT_OF_RANGE, `qi(x) not in range [${0}, ${1}]`)
    }
    g = new Graph(num_nodes)
    for (let i of g.nodes) {
        for (let j of g.nodes) {
            if (Math.random() < nodes_edge_prob[j - 1])
                g.add_edge(i, j)
        }
    }

    return g

}

function create_random_graph_by_same_edge_prob(num_nodes, q) {
    return create_random_graph_by_in_edge_prob_of_node(num_nodes, [...new Array(num_nodes).fill(q)])
}

function create_prufer_sequence(num_nodes) {
    let prufer_sequence = [...new Array(num_nodes - 2)]
    return prufer_sequence.map(x => get_random_number(1, num_nodes))
}

function create_random_tree(num_nodes) {
    if (num_nodes == 1) {
        return new Graph(1)
    }
    return convert_prufer_sequence_to_tree(create_prufer_sequence(num_nodes))
}

function convert_prufer_sequence_to_tree(prufer_sequence) {
    tree = new Graph(prufer_sequence.length + 2)
    degree = [...new Array(tree.num_nodes).fill(1)]
    prufer_sequence.forEach(node => degree[node - 1]++);

    for (i of prufer_sequence) {
        for (j of tree.nodes) {
            if (degree[j - 1] == 1) {
                degree[i - 1]--
                degree[j - 1]--
                tree.add_edge(i, j)
                break
            }
        }
    }

    let u, v
    for (node of tree.nodes) {
        if (degree[node - 1] == 1) {
            u = v
            v = node
        }
    }

    tree.add_edge(u, v)
    if (tree.num_nodes > 1) {
        all_edges = tree.get_all_edges()
        nodes_with_out_root = all_edges.map(x => x[1])
        root = tree.nodes.filter(x => nodes_with_out_root.indexOf(x) == -1)[0]
        if (root != 1) {
            tree.replace_nodes_names(root, 1)
        }
    }
    return tree


}

