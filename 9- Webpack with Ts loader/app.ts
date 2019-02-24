import {WelcomeModule} from './example.module';

let mod = new WelcomeModule();
mod.welcome();
 
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeterObj = new Greeter("world");

let button = document.createElement('button');
button.textContent = "Say Hello";
button.onclick = function() {
    alert(greeterObj.greet());
}

document.body.appendChild(button);