"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Node represents a node in an abstract syntax tree. Nodes have the following properties:
 *  - A type, which determines how it is evaluated;
 *  - A value, such as a number or function; and
 *  - An ordered list of children.
 */
var Node = function () {
    function Node(type) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

        _classCallCheck(this, Node);

        this.type = type;
        this.value = value;
        this.name = null; // Used in function and command nodes to retain the fn name when minified
        this.children = [];
    }

    /**
     * Adds a node to the list of children and returns this Node.
     * @param node Child node to addChild.
     * @returns {Node} This node.
     */


    _createClass(Node, [{
        key: "addChild",
        value: function addChild(node) {
            this.children.push(node);
            return this;
        }

        /**
         * Returns this Node's first child.
         */

    }, {
        key: "evaluate",


        /**
         * Evaluates this Node and all child nodes recursively, returning the numerical result of this Node.
         */
        value: function evaluate(vars) {
            var result = 0;

            switch (this.type) {
                case Node.TYPE_FUNCTION:
                    var evaluatedChildren = this.children.map(function (childNode) {
                        return childNode.evaluate(vars);
                    });
                    result = this.value.apply(this, evaluatedChildren);
                    break;
                case Node.TYPE_INVERSE:
                    result = 1.0 / this.child.evaluate(vars);
                    break;
                case Node.TYPE_NEGATE:
                    result = -this.child.evaluate(vars);
                    break;
                case Node.TYPE_NUMBER:
                    result = this.value;
                    break;
                case Node.TYPE_POWER:
                    result = Math.pow(this.children[0].evaluate(vars), this.children[1].evaluate(vars));
                    break;
                case Node.TYPE_PRODUCT:
                    result = this.children.reduce(function (product, child) {
                        return product * child.evaluate(vars);
                    }, 1);
                    break;
                case Node.TYPE_SUM:
                    result = this.children.reduce(function (sum, child) {
                        return sum + child.evaluate(vars);
                    }, 0);
                    break;
                case Node.TYPE_SYMBOL:
                    if (isFinite(vars[this.value])) {
                        return vars[this.value];
                    }
                    throw new Error("Symbol " + this.value + " is undefined or not a number");
            }

            return result;
        }

        /**
         * Determines whether this Node is unary, i.e., whether it can have only one child.
         * @returns {boolean}
         */

    }, {
        key: "isUnary",
        value: function isUnary() {
            return UNARY_NODES.indexOf(this.type) >= 0;
        }
    }, {
        key: "printTree",


        /**
         * Prints a tree-like representation of this Node and all child Nodes to the console.
         * Useful for debugging parser problems.
         * If printTree() is called on the root node, it prints the whole AST!
         * @param level (Integer, Optional) Initial level of indentation. You shouldn't need to use this.
         */
        value: function printTree() {
            var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            // Generate the indent string from the current `level`.
            // Child nodes will have a greater `level` and will appear indented.
            var indent = "";
            var indentString = "  ";
            for (var i = 0; i < level; i++) {
                indent += indentString;
            }

            console.log(indent + this.toString());

            // Print each child.
            for (var _i in this.children) {
                this.children[_i].printTree(level + 1);
            }
        }
    }, {
        key: "simplify",
        value: function simplify() {
            if (this.children.length > 1 || this.isUnary()) {
                // Node can't be simplified.
                // Clone this Node and simplify its children.
                var newNode = new Node(this.type, this.value);
                for (var i in this.children) {
                    newNode.addChild(this.children[i].simplify());
                }
                return newNode;
            } else if (this.children.length === 1) {
                // A non-unary node with no children has no function.
                return this.children[0].simplify();
            } else {
                // A node with no children is a terminal.
                return this;
            }
        }
    }, {
        key: "toString",
        value: function toString() {
            var val = typeof this.value === "function" ? this.name : this.value;
            return this.children.length + " " + this.type + " [" + val + "]";
        }
    }, {
        key: "child",
        get: function get() {
            return this.children[0];
        }
    }, {
        key: "nodeCount",
        get: function get() {
            var count = 1;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    count += i.nodeCount;
                }
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

            return count;
        }
    }]);

    return Node;
}();

Node.TYPE_FUNCTION = "FUNCTION";
Node.TYPE_INVERSE = "INVERSE";
Node.TYPE_NEGATE = "NEGATE";
Node.TYPE_NUMBER = "NUMBER";
Node.TYPE_POWER = "POWER";
Node.TYPE_PRODUCT = "PRODUCT";
Node.TYPE_SUM = "SUM";
Node.TYPE_SYMBOL = "SYMBOL";
exports.default = Node;


var UNARY_NODES = ["FACTORIAL", "FUNCTION", "INVERSE", "NEGATE"];