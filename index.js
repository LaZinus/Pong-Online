const express = require('express');
const app = express();
const path = require('path');
const port = 8080;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./Serverliste/index.html"));
});

app.get('/test', (req, res) => {
    console.log("test");
})

app.listen(port, () => {
    console.log(`Website is on port ${port}`);
});