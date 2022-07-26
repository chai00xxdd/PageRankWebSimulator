"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = parser;

var _Node = require("./Node");

var _Node2 = _interopRequireDefault(_Node);

var _Token = require("./Token");

var _Token2 = _interopRequireDefault(_Token);

var _arities = require("./util/arities");

var _arities2 = _interopRequireDefault(_arities);

var _localFunctions = require("./util/localFunctions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Parser
// ======

// The parser takes a list of Token objects and tries to construct a syntax
// tree that represents the math to be evaluated, taking into account the
// correct order of operations.
// This is a simple recursive-descent parser based on [Wikipedia's example](https://en.wikipedia.org/wiki/Recursive_descent_parser).

function parser(tokens) {
    var p = new Parser(tokens);
    return p.parse();
};

var Parser = function () {
    function Parser() {
        var tokens = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, Parser);

        this.cursor = 0;
        this.tokens = tokens;
    }

    _createClass(Parser, [{
        key: "parse",
        value: function parse() {
            //this.preprocess();
            var ast = this.sum();
            ast = ast.simplify();

            // Throw an exception if there are still tokens remaining after parsing
            if (this.currentToken !== undefined) {
                console.log(ast.printTree());
                throw "Parsing error: Expected end of input, but got " + this.currentToken.type + " " + this.currentToken.value;
            }

            return ast;
        }

        //preprocess() {
        // This function used to contain procedures to remove whitespace
        // tokens and replace symbol tokens with functions, but that work
        // has been moved to the lexer in order to keep the parser more
        // lightweight.
        //}

        /**
         * Accepts the current token if it matches the given type.
         * If it does, the cursor is incremented and this method returns true.
         * If it doesn't, the cursor stays where it is and this method returns false.
         * @param type Type of token to accept.
         * @returns {boolean} True if the token was accepted.
         */

    }, {
        key: "accept",
        value: function accept(type) {
            if (this.currentToken && this.currentToken.type === type) {
                this.cursor++;
                return true;
            }
            return false;
        }

        /**
         * Accepts the current token if it matches the given type.
         * If it does, the cursor is incremented.
         * If it doesn't, an exception is raised.
         * @param type
         */

    }, {
        key: "expect",
        value: function expect(type) {
            if (!this.accept(type)) {
                throw "Expected " + type + " but got " + (this.currentToken ? this.currentToken.toString() : "end of input.");
            }
        }

        // Rules
        // -----

        /**
         * Parses a math expression with
         */

    }, {
        key: "sum",
        value: function sum() {
            var node = new _Node2.default(_Node2.default.TYPE_SUM);
            node.addChild(this.product());

            while (true) {
                // Continue to accept chained addends
                if (this.accept(_Token2.default.TYPE_PLUS)) {
                    node.addChild(this.product());
                } else if (this.accept(_Token2.default.TYPE_MINUS)) {
                    node.addChild(new _Node2.default(_Node2.default.TYPE_NEGATE).addChild(this.product()));
                } else {
                    break;
                }
            }

            return node;
        }
    }, {
        key: "product",
        value: function product() {
            var node = new _Node2.default(_Node2.default.TYPE_PRODUCT);
            node.addChild(this.power());

            while (true) {
                // Continue to accept chained multiplicands

                if (this.accept(_Token2.default.TYPE_TIMES)) {
                    node.addChild(this.power());
                } else if (this.accept(_Token2.default.TYPE_DIVIDE)) {
                    node.addChild(new _Node2.default(_Node2.default.TYPE_INVERSE).addChild(this.power()));
                } else if (this.accept(_Token2.default.TYPE_LPAREN)) {
                    this.cursor--;
                    node.addChild(this.power());
                } else if (this.accept(_Token2.default.TYPE_SYMBOL) || this.accept(_Token2.default.TYPE_NUMBER) || this.accept(_Token2.default.TYPE_FUNCTION)) {
                    this.cursor--;
                    node.addChild(this.power());
                } else {
                    break;
                }
            }

            return node;
        }
    }, {
        key: "power",
        value: function power() {
            var node = new _Node2.default(_Node2.default.TYPE_POWER);
            node.addChild(this.val());

            // If a chained power is encountered (e.g. a ^ b ^ c), treat it like
            // a ^ (b ^ c)
            if (this.accept(_Token2.default.TYPE_POWER)) {
                node.addChild(this.power());
            }

            return node;
        }
    }, {
        key: "val",
        value: function val() {
            // Don't create a new node immediately, since we need to parse postfix
            // operators like factorials, which come after a value.
            var node = {};

            if (this.accept(_Token2.default.TYPE_SYMBOL)) {
                node = new _Node2.default(_Node2.default.TYPE_SYMBOL, this.prevToken.value);
            } else if (this.accept(_Token2.default.TYPE_NUMBER)) {
                node = new _Node2.default(_Node2.default.TYPE_NUMBER, parseFloat(this.prevToken.value));
            } else if (this.accept(_Token2.default.TYPE_COMMAND)) {
                var cmdToken = this.prevToken;
                node = new _Node2.default(_Node2.default.TYPE_FUNCTION, cmdToken.value);
                node.name = cmdToken.name;

                for (var i = 0; i < _arities2.default[cmdToken.name]; i++) {
                    node.addChild(this.val());
                }
            } else if (this.accept(_Token2.default.TYPE_FUNCTION)) {
                node = new _Node2.default(_Node2.default.TYPE_FUNCTION, this.prevToken.value);
                node.name = this.prevToken.name;

                // Multi-param functions require parens and have commas
                if (this.accept(_Token2.default.TYPE_LPAREN)) {
                    node.addChild(this.sum());

                    while (this.accept(_Token2.default.TYPE_COMMA)) {
                        node.addChild(this.sum());
                    }

                    this.expect(_Token2.default.TYPE_RPAREN);
                }

                // Single-parameter functions don't need parens
                else {
                        node.addChild(this.power());
                    }
            } else if (this.accept(_Token2.default.TYPE_MINUS)) {
                node = new _Node2.default(_Node2.default.TYPE_NEGATE).addChild(this.power());
            } else if (this.accept(_Token2.default.TYPE_LPAREN)) {
                node = this.sum();
                this.expect(_Token2.default.TYPE_RPAREN);
            } else if (this.accept(_Token2.default.TYPE_ABS)) {
                node = new _Node2.default(_Node2.default.TYPE_FUNCTION, Math.abs);
                node.addChild(this.sum());
                this.expect(_Token2.default.TYPE_ABS);
            } else {
                throw "Unexpected " + this.currentToken.toString() + " at token " + this.cursor;
            }

            if (this.accept(_Token2.default.TYPE_BANG)) {
                var factNode = new _Node2.default(_Node2.default.TYPE_FUNCTION, _localFunctions.fact);
                factNode.addChild(node);
                return factNode;
            }

            return node;
        }
    }, {
        key: "currentToken",
        get: function get() {
            return this.tokens[this.cursor];
        }
    }, {
        key: "prevToken",
        get: function get() {
            return this.tokens[this.cursor - 1];
        }
    }]);

    return Parser;
}();

/*
// Non-terminal rules
// ------------------

// The following parser functions match certain motifs that are called
// "non-terminals" in parsing lingo.
// Essentially, they implement a sort of finite state automaton.
// You should read the [Wikipedia article](https://en.wikipedia.org/wiki/Recursive_descent_parser) on recursive-descent parsing if you want to know more about how these work.

// ### Grammar:
// ```
// orderExpression : sum
// sum : product { ('+'|'-') product }
// product : power { ('*'|'/') power }
//         | power '(' orderExpression ')'
// power : TODO power
// val : SYMBOL
//     | NUMBER
//     | FUNCTION '(' orderExpression { ',' orderExpression } ')'
//     | '-' val
//     | '(' orderExpression ')'
//     | '{' orderExpression '}'
//     | '|' orderExpression '|'
//     | val '!'
// ```
*/

// Parses values or nested expressions.
//Parser.prototype.val = function() {
// Don't return new nodes immediately, since we need to parse
// factorials, which come at the END of values.
//var node = {};


// Parse negative values like -42.
// The lexer can't differentiate between a difference and a negative,
// so that distinction is done here.
// Notice the `power()` rule that comes after a negative sign so that
// expressions like `-4^2` return -16 instead of 16.


// Parse nested expression with parentheses.
// Notice that the parser expects an RPAREN token after the expression.


// Parse absolute value.
// Absolute values are contained in pipes (`|`) and are treated quite
// like parens.


// All parsing rules should have terminated or recursed by now.
// Throw an exception if this is not the case.


// Process postfix operations like factorials.

// Parse factorial.


//return node;
//};