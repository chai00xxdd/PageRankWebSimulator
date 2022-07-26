class MathInput {
    constructor(container) {
        this.MQ = MathQuill.getInterface(2);
        this.container = container
        this.mathElement = this.MQ.MathField(this.container)
        this.set_to_repciprocal_function()
        this.evalute_x_calc = evaluatex
        this.math_func = undefined
    }

    getMathElement() {
        return this.mathElement
    }

    create_math_function_from_input() {
        this.math_func = this.evalute_x_calc(this.get_latex())
        return this.math_func
    }

    evalute_x(x) {
        this.create_math_function_from_input()
        return this.math_func({ x: x })
    }

    get_latex() {
        let latex = this.mathElement.latex().replace('\\ ', '')
        while (latex.includes(' ')) {
            latex = latex.replace('\\ ', '')
        }
        return latex
    }

    evalute_x_list(x_list) {
        if (this.mathElement.latex().includes('log'))
            throw_exception(ExceptionType.ERROR, 'log not supported')
        try {
            this.create_math_function_from_input()
            let y_list = []
            x_list.forEach(x => y_list.push(this.math_func({ x: x })))
            return y_list
        }
        catch (e) {
            throw_exception(ExceptionType.ERROR, 'bad function')
        }
    }

    set_to_repciprocal_function() {
        this.mathElement.latex('\\frac{ 1}{ x }')
    }


}