//containers
const pagerank_graph_container = document.querySelector('#PageRankGraphContainer')
//Buttons
const add_node_button = document.querySelector('#AddNodeButton')
const run_pagerank_button = document.querySelector('#RunPageRankButton')
const clear_graph_button = document.querySelector('#ClearButton')
const circle_position_button = document.querySelector('#CirclePositionButton')
const grid_position_button = document.querySelector('#GridPositionButton')
const generate_first_family_graph_button = document.querySelector('#GenerateFirstFamilyGraphButton')
const generate_random_tree_button = document.querySelector('#GenerateRandomTreeButton')
const bfs_position_button = document.querySelector('#BfsPositionButton')
const generate_second_family_graph_button = document.querySelector('#GenerateSecondFamilyGraphButton')
//inputs
const n_text_box = document.querySelector('#NParameterTextBox')
const t_text_box = document.querySelector('#TParameterTextBox')
const p_text_box = document.querySelector('#PParameterTextBox')
const first_family_edge_prob_text_box = document.querySelector('#FirstFamilyEdgeProbTextBox')
const num_pages_to_generate_text_box = document.querySelector('#NumPagesParameterTextBox')
const qi_math_input_controller = new MathInput(document.querySelector('#MathInputTextBox'))

//Error Labels
const second_family_error_label = document.querySelector('#SecondFamilyErrorLabel')

//checkbox
const run_algorithm_on_set_graph_checkbox = document.querySelector('#RunAlgorithmOnGraphCreatedSwitch')

//controllers
const pagerank_controller = new PageRankController(pagerank_graph_container)
//charts
const vertex_ranks_chart = new GraphChartComponent('VertexRanksChartDiv', 'VertexRanksChartCanavs', 'vertex num', 'rank')
const din_ranks_chart = new GraphChartComponent('DinRanksChartDiv', 'DinRanksChartCanavs', 'din', 'avg rank')
//evalutex
evalute_x_calc = evaluatex

//fn = evaluatex("\log(10)");
//result = fn({ x: 100 });
//console.log(result)




init_main_page()


function init_main_page() {


    document.addEventListener('keyup', (e) => {
        console.log('key up')
    })
    run_pagerank_button.disabled = true
    second_family_error_label.innerHTML = ''

    generate_first_family_graph_button.addEventListener('click', generate_first_family_button_clicked)
    generate_random_tree_button.addEventListener('click', generate_random_tree_button_clicked)
    generate_second_family_graph_button.addEventListener('click', generate_second_family_button_clicked)

    circle_position_button.addEventListener('click', () => { pagerank_controller.put_nodes_circle_position() })
    grid_position_button.addEventListener('click', () => { pagerank_controller.put_nodes_grid_position() })
    bfs_position_button.addEventListener('click', () => { pagerank_controller.put_nodes_bfs_position() })

    add_node_button.addEventListener('click', add_page)

    run_pagerank_button.addEventListener('click', run_pagerank_display_results)
    pagerank_controller.add_on_node_remove((g, node_removed_id) => {
        run_pagerank_button.disabled = g.num_nodes == 0
    })

    pagerank_controller.add_on_node_add_listner((node_id) => { run_pagerank_button.disabled = false; })
    pagerank_controller.add_on_set_graph_listener(() => {
        if (!(run_algorithm_on_set_graph_checkbox.checked && run_pagerank_display_results())) {
            clear_pagerank_analysis_charts()
        }
    })

    clear_graph_button.addEventListener('click', on_clear)
}

function add_page() {
    pagerank_controller.add_page()
}

function generate_first_family_button_clicked() {
    params = get_first_family_params_from_user()
    if (params) {
        generate_first_family_graph(params)
    }
}

function generate_second_family_button_clicked() {
    second_family_error_label.innerHTML = ''
    num_nodes = get_num_pages_to_generate_from_user()
    if (num_nodes) {
        try {
            nodes_in_edge_probs = qi_math_input_controller.evalute_x_list(range(1, num_nodes + 1))
            pagerank_controller.create_display_random_graph_by_node_in_edge_prob(num_nodes, nodes_in_edge_probs)

        }
        catch (e) {
            console.log(e)
            second_family_error_label.innerHTML = e.to_string()
        }
    }
}

function generate_random_tree_button_clicked() {
    num_nodes = get_num_pages_to_generate_from_user()
    if (num_nodes) {

        pagerank_controller.create_display_random_tree(num_nodes)
    }
}


function on_clear() {
    pagerank_controller.clear()
    run_pagerank_button.disabled = true;
    clear_pagerank_analysis_charts()
}

function clear_pagerank_analysis_charts() {
    vertex_ranks_chart.clear()
    din_ranks_chart.clear()
}

function run_pagerank_display_results() {
    pagerank_config = get_algorithm_config_from_user()
    if (pagerank_config == null)
        return false;

    ranks = pagerank_controller.run_page_rank(pagerank_config)
    vertex_bar = [...ranks.keys()]
    ranks_bar = [...ranks.values()]
    vertex_ranks_chart.populate(vertex_bar, ranks_bar)

    const [din_bar, din_avg_rank_bar] = get_din_avg_rank(pagerank_controller.get_graph(), ranks)
    din_ranks_chart.populate(din_bar, din_avg_rank_bar)
    return true
}

function get_algorithm_config_from_user() {
    if (n_text_box.reportValidity() && t_text_box.reportValidity() && p_text_box.reportValidity()) {
        walk_length = parseInt(n_text_box.value)
        iterations = parseInt(t_text_box.value)
        random_vertex_probality = parseFloat(p_text_box.value)
        return { walk_length, iterations, random_vertex_probality }
    }

    return null;
}

function get_num_pages_to_generate_from_user() {
    if (num_pages_to_generate_text_box.reportValidity()) {
        return parseInt(num_pages_to_generate_text_box.value)
    }
    return null;
}

function get_first_family_params_from_user() {
    num_nodes = get_num_pages_to_generate_from_user()
    if (num_nodes && first_family_edge_prob_text_box.reportValidity()) {
        return {
            num_nodes: num_nodes,
            edge_prob: parseFloat(first_family_edge_prob_text_box.value)
        }
    }
    return null;
}

function generate_first_family_graph(first_family_params) {

    pagerank_controller.create_display_random_graph_by_edge_prob(first_family_params.num_nodes, first_family_params.edge_prob)
}







