const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

// middleware give to express
app.use(bodyParser.json());

// config route
// POST
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
           todos 
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/123456
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

// DELETE
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) return res.status(404).send();

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

// PATCH, update a resource
app.patch('/todos/:id', (req, res) => {
     const id = req.params.id;
     var body = _.pick(req.body, ['text', 'completed']);

     if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();        // javascript timestamp
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {
    app
};