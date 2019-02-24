import { Welcome } from './example';

export class WelcomeModule {
    welcome() {
        let welcome = new Welcome("world");
        console.log("Write in WelcomeModule " + welcome.greet())
    }
}