const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;


app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define a schema and model for to-do items
const todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

// API Routes

// Get all to-do items
app.get('/api/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

// Add a new to-do item
app.post('/api/todos', async (req, res) => {
    const newTodo = new Todo({
        task: req.body.task,
        completed: false
    });
    await newTodo.save();
    res.status(201).json(newTodo);
});

// Update a to-do item (mark as completed)
app.put('/api/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
        completed: req.body.completed
    }, { new: true });
    res.json(updatedTodo);
});

// Delete a to-do item
app.delete('/api/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});