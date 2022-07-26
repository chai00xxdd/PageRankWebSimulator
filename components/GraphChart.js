class ChartType {
    static BAR = 'bar'
    static PLOT = 'line'
    static SCATTER = 'scatter'
}

class GraphChart {
    constructor(chart_canavs_id, x_label = '', y_label = '', default_chart_type = ChartType.BAR) {
        this.x_label = x_label
        this.y_label = y_label
        this.canavs = chart_canavs_id
        this.default_chart_type = default_chart_type
        this.init_chart(this.canavs)
        //this.make_responsive()


    }


    populate_by_default_type(x_axis = [], y_axis = []) {
        if (this.default_chart_type == ChartType.BAR) {
            this.bar(x_axis, y_axis)
        }
        else {
            this.plot(x_axis, y_axis)
        }
    }

    set_default_type(new_type = ChartType.BAR) {
        this.default_chart_type = new_type
        this.chart.config.type = this.default_chart_type
        this.chart.update()
    }

    plot(x_axis = [], y_axis = []) {
        this.chart.config.type = ChartType.PLOT
        this.populate_axis(x_axis, y_axis)

    }
    populate_axis(x_axis, y_axis) {
        this.chart.data.labels = x_axis;
        this.chart.data.datasets[0].data = y_axis;
        this.chart.update();
    }

    bar(x_axis = [], y_axis = []) {

        this.chart.config.type = ChartType.BAR
        this.populate_axis(x_axis, y_axis)
    }

    set_xlabel(x_label) {
        this.x_label = x_label
        this.update_labels()
    }
    set_ylabel(y_label) {
        this.y_label = y_label
        this.update_labels()
    }

    update_labels() {
        this.chart.config.options.scales.yAxes[0].scaleLabel.labelString = this.y_label
        this.chart.config.options.scales.xAxes[0].scaleLabel.labelString = this.x_label
    }

    clear() {
        this.plot([], [])
    }

    add_data(x, y) {
        this.chart.data.labels.push(x)
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(y);
        });
        this.chart.update();

    }

    make_responsive() {
        this.chart.options.responsive = true;
        this.chart.options.maintainAspectRatio = false;
    }

    set_max_bar_thickness(thickness) {
        this.chart.data.datasets[0].maxBarThickness = thickness
    }

    init_chart(canavs, x_axis = [], y_axis = []) {

        this.chart = new Chart(canavs, {
            type: this.default_chart_type,
            data: {
                labels: x_axis,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,1.0)",
                    data: y_axis,
                    maxBarThickness: 50,

                }]
            },
            options: {
                elements: {
                    point: {
                        radius: 0
                    }

                },
                legend: { display: false },
                scales: {
                    yAxes: [{
                        ticks: { min: 0 },
                        scaleLabel: {
                            display: true,
                            labelString: this.y_label
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            min: 0,
                            beginAtZero: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: this.x_label
                        }
                    }]
                }
            }
        });
    }
}