"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Token represents a lexical token. It has a type and a value.
 * @param type (String) Token type. A list of types is found in "utils/tokens.js".
 * @param value Value of the token.
 */
var Token = function () {
    function Token(type) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

        _classCallCheck(this, Token);

        this.type = type;
        this.value = value;
        this.name = null; // Used in function and command tokens to retain the fn name when minified
    }

    _createClass(Token, [{
        key: "equals",
        value: function equals(token) {
            return this.type === token.type && this.value === token.value;
        }
    }, {
        key: "toString",
        value: function toString() {
            if (TRIVIAL_TOKENS.indexOf(this.type) >= 0) {
                return this.type;
            }

            var val = typeof this.value === "function" ? this.name : this.value;

            return this.type + "[" + val + "]";
        }
    }]);

    return Token;
}();

Token.TYPE_LPAREN = "LPAREN";
Token.TYPE_RPAREN = "RPAREN";
Token.TYPE_PLUS = "PLUS";
Token.TYPE_MINUS = "MINUS";
Token.TYPE_TIMES = "TIMES";
Token.TYPE_DIVIDE = "DIVIDE";
Token.TYPE_COMMAND = "COMMAND";
Token.TYPE_SYMBOL = "SYMBOL";
Token.TYPE_WHITESPACE = "WHITESPACE";
Token.TYPE_ABS = "ABSOLUTEVAL";
Token.TYPE_BANG = "BANG";
Token.TYPE_COMMA = "COMMA";
Token.TYPE_POWER = "POWER";
Token.TYPE_NUMBER = "NUMBER";
Token.patterns = new Map([[Token.TYPE_LPAREN, /(\(|\[|{|\\left\(|\\left\[)/], // Match (, [, {, \left(, \left[
[Token.TYPE_RPAREN, /(\)|]|}|\\right\)|\\right])/], // Match ), ], }, \right), \right]
[Token.TYPE_PLUS, /\+/], [Token.TYPE_MINUS, /-/], [Token.TYPE_TIMES, /\*/], [Token.TYPE_DIVIDE, /\//], [Token.TYPE_COMMAND, /\\[A-Za-z]+/], [Token.TYPE_SYMBOL, /[A-Za-z_][A-Za-z_0-9]*/], [Token.TYPE_WHITESPACE, /\s+/], // Whitespace
[Token.TYPE_ABS, /\|/], [Token.TYPE_BANG, /!/], [Token.TYPE_COMMA, /,/], [Token.TYPE_POWER, /\^/], [Token.TYPE_NUMBER, /\d+(\.\d+)?/]]);
exports.default = Token;
;

/**
 * Trivial tokens are those that can only have a single value, so printing their value is unnecessary.
 */
var TRIVIAL_TOKENS = ["TPLUS", "TMINUS", "TTIMES", "TDIVIDE", "TWS", "TABS", "TBANG", "TCOMMA", "TPOWER"];