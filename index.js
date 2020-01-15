const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

const db = require('./models/connection');

console.log(db);

const PORT = 3000;







server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});