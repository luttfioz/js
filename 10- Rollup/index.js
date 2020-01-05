import sayHello from './module';
import _ from 'lodash';
import { LitElement } from 'lit-element';

const arr = _.concat([1, 2, 3], 4, [5]);
sayHello('Hello from Rollup and lodash: ' + arr);


class TodoApp extends LitElement {
  constructor() {
    super();
    this.todos = ['Do A', 'Do B', 'Do C'];
  }
}
