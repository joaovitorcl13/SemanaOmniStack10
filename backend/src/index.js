const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const {setupWebsocket} = require('./websocket');

const port = 3333;

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@oministack-paq5s.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use(cors());
app.use(express.json());

app.use(routes);

server.listen(port, () => {
    console.log(`App running on port ${port}.`);
});