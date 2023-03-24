
const mongoose = require('mongoose');

const users = new mongoose.Schema({
    uid: Number,
    email: String,
    selectedQuestions: [{questionId: Number,
        title: String,
        predicate: String,
        argument: String,
        option: String,
        score: Number}],
    date: {type: Date, default:  Date.now()},
    totalScore: Number,
    facts: String
});

module.exports = mongoose.model('users', users)