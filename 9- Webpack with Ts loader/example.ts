
export class Welcome {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Welcome, " + this.greeting;
    }
}

