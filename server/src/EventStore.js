
const EventEmitter = require('events')

class EventStore extends EventEmitter {
    constructor(eventStore) {
        super();
        this.events = [];
        this.sequenceNumber = 0;
        this.userStore = eventStore;
    }

    append(event) {
        event.meta.sequenceNumber = this.sequenceNumber;
        event.meta.userName = this.userStore.getUserName(event.meta.clientInstanceId)
        // console.log("appending event:", event)
        this.events[this.sequenceNumber] = event
        this.emit("event", event)
        this.sequenceNumber++
    }

    getAllEvents() {
        return this.events;
    }

}

module.exports = EventStore;