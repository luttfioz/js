import EventBusService from './Eventbus'

class EventBusServiceInstance {

    constructor() {
    }

    post() {
        EventBusService.dispatch({ type: 'data1', payload: { data: 'osman' } })
    }

    get() {
        const foo = EventBusService.select('data1');
        foo.subscribe(x => {
            console.log(x.payload)
        });


    }



}

export default new EventBusServiceInstance();