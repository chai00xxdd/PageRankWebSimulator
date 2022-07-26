class GraphChartComponent {
    constructor(div_container_id, canvas_id, x_label = '', y_label = '', chart_types = [ChartType.BAR, ChartType.PLOT]) {
        this.div_container = document.getElementById(div_container_id)

        this.canavs = document.createElement("CANVAS");
        this.canavs.id = canvas_id
        this.chart_types = chart_types


        this.choose_chart_type_box = this.create_chart_type_selection_box()

        this.div_container.append(this.choose_chart_type_box, this.canavs)
        this.chart = new GraphChart(this.canavs.id, x_label, y_label)
        this.init_events()

    }

    create_chart_type_selection_box() {
        this.choose_chart_type_box = document.createElement('select')
        for (const chart_type of this.chart_types) {
            const option = document.createElement("option");
            option.value = chart_type
            option.innerHTML = chart_type.toLocaleLowerCase()
            this.choose_chart_type_box.appendChild(option)
        }
        return this.choose_chart_type_box
    }

    init_events() {

        this.choose_chart_type_box.addEventListener('change', (e) => {
            this.chart.set_default_type(this.choose_chart_type_box.value)
        })

    }

    clear() {
        this.chart.clear()
    }

    populate(x_axis, y_axis) {
        this.chart.populate_by_default_type(x_axis, y_axis)
    }

    create_title(title) {
        this.title_element = document.createElement('h1')
        this.title_element.innerHTML = title
        return this.title_element
    }
}