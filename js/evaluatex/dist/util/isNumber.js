"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNumber;
/**
 * Returns true if the argument if a finite numeric value.
 */
function isNumber(a) {
  return a !== null && isFinite(a);
}