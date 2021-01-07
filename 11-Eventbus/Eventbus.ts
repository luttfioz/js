import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, distinctUntilChanged, tap, take } from 'rxjs/operators';

// const Rx = require('rxjs')
// const  { filter, map, distinctUntilChanged, tap, take } = require('rxjs/operators')


export class EventBusService {

    private _store = new Map();
    private store = new BehaviorSubject(this._store);

    constructor() { }

    dispatch(action) {
        this._store.set(action.type, action);
        this.updateStore();
    }

    private updateStore(updatedStore = this._store) {
        this.store.next(updatedStore);
    }

    select(eventType: string) {
        return this.store.asObservable()
            .pipe(
                map(localStore => localStore.get(eventType)),
                filter(event => !!event),
                distinctUntilChanged()
            ) as Observable<Action>
    }

    selectPayload(eventType) {
        return this.select(eventType).pipe(map(action => action.payload));
    }

    selectAndDelete(eventType) {
        return this.selectPayload(eventType).
            pipe(
                tap(_ => this.remove(eventType)),
                take(1)
            );
    }

    hasEvent(eventType) {
        return !!this._store.get(eventType);
    }

    remove(eventType) {
        const retVal = this._store.get(eventType);
        this._store.delete(eventType);
        this.updateStore();
        return retVal;
    }

}

export interface Action {
    type: string;
    payload?: any;
}

export class UserData implements Action {
    readonly type = "user";
    constructor(public payload) { }
}

// module.exports = new EventBusService();

export default new EventBusService();