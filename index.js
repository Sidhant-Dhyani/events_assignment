
const mongoose = require('mongoose');
const EventLog = require('./models/eventlog');
const fs = require('fs');
const path = require('path');

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
        printEventInLog(eventName);
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

function printEventInLog(eventName) {
    const message = `${eventName} --> ${new Date().toISOString()}`;
    const logFilePath = path.join(__dirname, 'app.log');
    fs.appendFile(logFilePath, message + '\n', (err) => {
        if (err) {
            console.error(err);
        }
    });
}

const events = new Events();

events.on('click', () => console.log('Click triggered!!'));
events.trigger('click');

