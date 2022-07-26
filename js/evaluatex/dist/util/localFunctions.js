"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
Javascript's Math API omits some important mathematical functions. These are included here.
 */

var fact = exports.fact = function fact(a) {
    a = Math.round(a);
    var result = 1;

    if (a < 0) {
        throw "Can't factorial a negative.";
    }

    for (a; a > 1; a--) {
        result *= a;
    }
    return result;
};

var frac = exports.frac = function frac(a, b) {
    return a / b;
};

var logn = exports.logn = function logn(x, b) {
    return Math.log(x) / Math.log(b);
};

var rootn = exports.rootn = function rootn(x, n) {
    return Math.pow(x, 1 / n);
};

var sec = exports.sec = function src(x) {
    return 1 / Math.cos(x);
};

var csc = exports.csc = function csc(x) {
    return 1 / Math.sin(x);
};

var cot = exports.cot = function cot(x) {
    return 1 / Math.tan(x);
};

var locals = { fact: fact, frac: frac, logn: logn, rootn: rootn, sec: sec, csc: csc, cot: cot };

// Copy things from Math. Can't use Object.assign since Math has non-enumerable properties.
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = Object.getOwnPropertyNames(Math)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var k = _step.value;

        locals[k] = Math[k];
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

exports.default = locals;