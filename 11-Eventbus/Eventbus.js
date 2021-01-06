import { BehaviorSubject } from 'rxjs';
import { filter, map, distinctUntilChanged, tap, take } from 'rxjs/operators';

// const Rx = require('rxjs')
// const  { filter, map, distinctUntilChanged, tap, take } = require('rxjs/operators')


class EventBusService {

    constructor() {
        this._store = new Map();

        this.store = new BehaviorSubject(this._store);
    }

    dispatch(action) {
        this._store.set(action.type, action);
        this.updateStore();
    }

    updateStore(updatedStore = this._store) {
        this.store.next(updatedStore);
    }

    select(eventType) {
        return this.store.asObservable()
            .pipe(
                map(localStore => localStore.get(eventType)),
                filter(event => !!event),
                distinctUntilChanged()
            );
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

// module.exports = new EventBusService();

export default new EventBusService();