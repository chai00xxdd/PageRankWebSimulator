"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = evaluatex;

var _lexer = require("./lexer");

var _lexer2 = _interopRequireDefault(_lexer);

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Parses a given math expression and returns a function that computes the result.
 * @param {String} expression Math expression to parse.
 * @param {Object} constants A map of constants that will be compiled into the resulting function.
 * @param {Object} options Options to Evaluatex.
 * @returns {fn} A function that takes an optional map of variables. When invoked, this function computes the math expression and returns the result. The function has fields `ast` and `expression`, which respectively hold the AST and original math expression.
 */
function evaluatex(expression) {
    var constants = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var tokens = (0, _lexer2.default)(expression, constants, options);
    var ast = (0, _parser2.default)(tokens).simplify();
    var fn = function fn() {
        var variables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return ast.evaluate(variables);
    };
    fn.ast = ast;
    fn.expression = expression;
    fn.tokens = tokens;
    return fn;
}