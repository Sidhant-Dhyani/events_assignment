const mongoose = require('mongoose');
const EventLog = require('./models/eventlog');

const connectToDB = mongoose.connect('mongodb+srv://siddhantydhyani99:gmXeYJ70JYyPbNcN@cluster0.jvxhebo.mongodb.net/Events');

connectToDB.then(() => {
    console.log('Connected to DB!!');
});

class Events {
    constructor() {
        this.eventHandlers = {};
    }

    on(eventName, callbackFn) {
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }
        this.eventHandlers[eventName].push(callbackFn);
        logEventInMongoDB(eventName);
    }

    trigger(eventName) {
        const handlers = this.eventHandlers[eventName];
        if (handlers) {
            handlers.forEach(fn => {
                fn();
            });
        }
        logEventInMongoDB(eventName);
    }

    off(eventName) {
        delete this.eventHandlers[eventName];
        logEventInMongoDB(eventName);
    }

}

function logEventInMongoDB(eventName) {

    const newEventLog = new EventLog({
        event: eventName
    });
    newEventLog.save();
}

function printLogs(eventName, triggerTime) {
    const message = `${eventName} ====> ${triggerTime}`;
    console.log(message);
}

const events = new Events();

events.on('click', () => console.log('Click triggered!!'));
events.trigger('click');