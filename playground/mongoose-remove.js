const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

Todo.remove({}).then((result) => {
    console.log(result);
});

// return removed doc
Todo.findOneAndRemove({}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove('abcde').then((todo) => {
    console.log(todo);
});