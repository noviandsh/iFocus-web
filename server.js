const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const mongoose = require('mongoose')

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

mongoose.connect('mongodb://127.0.0.1:27017/ifocus')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

const userSchema = new mongoose.Schema({
    name: String,
    online: Number,
    block: Number,
    choosen: Number,
    get_window: Number,
    window: String
});

const User = mongoose.model('pc', userSchema);

const getUsers = async () => {
    const users = await User.find({ name: 'PC01' });
    return users
};

// console.log(getUsers().then(data => { return data }));
// getUsers()

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const data = await User.find();
    res.render('index', { data })
});

io.on('connection', (socket) => {
    console.log('an user connected');

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg)
    })
    socket.on('disconnected', () => {
        console.log('a user disconnected');
    })
});

// main().catch(err => console.log("error: ", err))

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/ifocus')
//     const pcSchema = new mongoose.Schema({
//         name: String,
//         online: Number,
//         block: Number,
//         choosen: Number,
//         get_window: Number,
//         window: String
//     })
//     const pcData = mongoose.model('data_pc', pcSchema)
//     const pc = await pcData.find().exec()
//     console.log(pc);
//     console.log('object');
// }

// const createUser = async () => {
//     const user = new User({
//         name: "PC04",
//         online: 0,
//         block: 0,
//         choosen: 0,
//         get_window: 0,
//         window: null
//     });
//     await user.save();
//     console.log("User created:", user);
// };

// createUser();

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
