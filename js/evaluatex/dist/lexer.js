"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = lexer;

var _Token = require("./Token");

var _Token2 = _interopRequireDefault(_Token);

var _arities = require("./util/arities");

var _arities2 = _interopRequireDefault(_arities);

var _localFunctions = require("./util/localFunctions");

var _localFunctions2 = _interopRequireDefault(_localFunctions);

var _replaceToken = require("./util/replaceToken");

var _replaceToken2 = _interopRequireDefault(_replaceToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Single-arg tokens are those that, when in LaTeX mode, read only one character as their argument OR a block delimited by { }. For example, `x ^ 24` would be read as `SYMBOL(x) POWER NUMBER(2) NUMBER(4).
var CHAR_ARG_TOKENS = [_Token2.default.TYPE_POWER, _Token2.default.TYPE_COMMAND];

var DEFAULT_OPTS = {
    latex: false
};

/**
 * The lexer reads a math expression and breaks it down into easily-digestible Tokens.
 * A list of valid tokens can be found lower in this file.
 * @param equation (String) The equation to lex.
 * @param constants (Object) An object of functions and variables.
 * @param opts Options.
 * @returns {Array} An array of Tokens.
 */
function lexer(equation) {
    var constants = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTS;

    var l = new Lexer(equation, constants, opts);
    l.lex();

    // toString() each token and concatenate into a big string. Useful for debugging.
    l.tokens.toString = function () {
        return l.tokens.map(function (token) {
            return token.toString();
        }).join(" ");
    };

    return l.tokens;
}

var Lexer = function () {
    function Lexer(buffer, constants, opts) {
        _classCallCheck(this, Lexer);

        this.buffer = buffer;
        this.constants = Object.assign({}, constants, _localFunctions2.default);
        this.opts = opts;
        this.tokens = [];
    }

    _createClass(Lexer, [{
        key: "lex",
        value: function lex() {
            this.lexExpression();
            this.replaceConstants();
            this.replaceCommands();
        }

        /**
         * Lexes an expression or sub-expression.
         */

    }, {
        key: "lexExpression",
        value: function lexExpression() {
            var charMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            while (this.hasNext()) {
                var token = charMode ? this.nextCharToken() : this.next();
                this.tokens.push((0, _replaceToken2.default)(token));

                if (this.opts.latex && isCharArgToken(token)) {
                    var arity = 1;
                    if (token.type === _Token2.default.TYPE_COMMAND) {
                        arity = _arities2.default[token.value.substr(1).toLowerCase()];
                    }
                    for (var i = 0; i < arity; i++) {
                        this.lexExpression(true);
                    }
                } else if (isStartGroupToken(token)) {
                    this.lexExpression(false);
                }

                if (charMode || isEndGroupToken(token)) {
                    return;
                }
            }
        }
    }, {
        key: "hasNext",
        value: function hasNext() {
            return this.buffer.length > 0;
        }

        /**
         * Retrieves the next non-whitespace token from the buffer.
         * @param len
         * @returns {Token}
         */

    }, {
        key: "next",
        value: function next() {
            var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            this.skipWhitespace();

            if (!this.hasNext()) {
                throw "Lexer error: reached end of stream";
            }

            // Try to match each pattern in tokenPatterns to the remaining buffer
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _Token2.default.patterns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var type = _ref2[0];
                    var regex = _ref2[1];

                    // Force the regex to match only at the beginning of the string
                    var regexFromStart = new RegExp(/^/.source + regex.source);

                    // When `len` is undefined, substr reads to the end
                    var match = regexFromStart.exec(this.buffer.substr(0, len));
                    if (match) {
                        this.buffer = this.buffer.substr(match[0].length);
                        return new _Token2.default(type, match[0]);
                    }
                }

                // TODO: Meaningful error
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            throw "Lexer error: can't match any token";
        }

        /**
         * Tokenizes the next single character of the buffer, unless the following token is a LaTeX command, in which case the entire command is tokenized.
         */

    }, {
        key: "nextCharToken",
        value: function nextCharToken() {
            this.skipWhitespace();
            if (this.buffer.charAt(0) === "\\") {
                return this.next();
            }
            return this.next(1);
        }
    }, {
        key: "replaceCommands",
        value: function replaceCommands() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.tokens[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var token = _step2.value;

                    if (token.type === _Token2.default.TYPE_COMMAND) {
                        token.value = token.value.substr(1).toLowerCase();
                        token.name = token.value; // Save name of function for debugging later
                        token.value = this.constants[token.name];
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "replaceConstants",
        value: function replaceConstants() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.tokens[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var token = _step3.value;

                    if (token.type === _Token2.default.TYPE_SYMBOL) {
                        // Symbols will need to be looked up during the evaluation phase.
                        // If the symbol refers to things defined in either Math or
                        // the locals, compile them, to prevent slow lookups later.
                        if (typeof this.constants[token.value] === "function") {
                            token.type = _Token2.default.TYPE_FUNCTION;
                            token.name = token.value; // Save name of function for debugging later
                            token.value = this.constants[token.value];
                        } else if (typeof this.constants[token.value] === "number") {
                            token.type = _Token2.default.TYPE_NUMBER;
                            token.value = token.fn = this.constants[token.value];
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        /**
         * Removes whitespace from the beginning of the buffer.
         */

    }, {
        key: "skipWhitespace",
        value: function skipWhitespace() {
            var regex = new RegExp(/^/.source + _Token2.default.patterns.get(_Token2.default.TYPE_WHITESPACE).source);
            this.buffer = this.buffer.replace(regex, "");
        }
    }]);

    return Lexer;
}();

function isCharArgToken(token) {
    return CHAR_ARG_TOKENS.indexOf(token.type) !== -1;
}

function isStartGroupToken(token) {
    return token.type === _Token2.default.TYPE_LPAREN && token.value === "{";
}

function isEndGroupToken(token) {
    return token.type === _Token2.default.TYPE_RPAREN && token.value === "}";
}