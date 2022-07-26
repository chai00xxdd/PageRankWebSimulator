"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = replaceToken;

var _Token = require("../Token");

var _Token2 = _interopRequireDefault(_Token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This table lists tokens that should be replaced by other tokens before parsing.
// The key has format "{token type}:{token value}"

/**
 * Replaces a token according to a set of replacement rules. This simplifies parsing and makes LaTeX work better.
 * @param token
 * @returns {*}
 */
function replaceToken(token) {
    // if (token.type === Token.TYPE_COMMAND && token.value === "\\left(") {
    //     return new Token(Token.TYPE_LPAREN, "(");
    // }
    // else if (token.type === Token.TYPE_COMMAND && token.value === "\\right(") {
    //     return new Token(Token.TYPE_RPAREN, "(");
    // }
    // else if (token.type === Token.TYPE_COMMAND && token.value === "\\left[") {
    //     return new Token(Token.TYPE_LPAREN, "[");
    // }
    // else if (token.type === Token.TYPE_COMMAND && token.value === "\\right]") {
    //     return new Token(Token.TYPE_RPAREN, "]");
    // }
    if (token.type === _Token2.default.TYPE_COMMAND && ["\\cdot", "\\times"].includes(token.value)) {
        return new _Token2.default(_Token2.default.TYPE_TIMES, "*");
    }
    return token;
};