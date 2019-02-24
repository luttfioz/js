"use strict";
exports.__esModule = true;
var Welcome = /** @class */ (function () {
    function Welcome(message) {
        this.greeting = message;
    }
    Welcome.prototype.greet = function () {
        return "Welcome, " + this.greeting;
    };
    return Welcome;
}());
exports.Welcome = Welcome;
