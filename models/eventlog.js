
const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
    event: String,
    triggerTime: {
        type: Date,
        default: () => new Date()
    }
})

module.exports = mongoose.model('EventLog', eventLogSchema);