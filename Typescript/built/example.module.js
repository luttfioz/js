"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var example_1 = require("./example");
var WelcomeModule = /** @class */ (function () {
    function WelcomeModule() {
    }
    WelcomeModule.prototype.welcome = function () {
        var welcome = new example_1.Welcome("world");
        console.log("Write in WelcomeModule " + welcome.greet());
    };
    return WelcomeModule;
}());
exports.WelcomeModule = WelcomeModule;
