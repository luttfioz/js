"use strict";
exports.__esModule = true;
var example_module_1 = require("./example.module");
var mod = new example_module_1.WelcomeModule();
mod.welcome();
var Greeter = /** @class */ (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
}());
var greeterObj = new Greeter("world");
var button = document.createElement('button');
button.textContent = "Say Hello";
button.onclick = function () {
    alert(greeterObj.greet());
};
document.body.appendChild(button);
