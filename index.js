var http = require('http');
var fs = require('fs');

const PORT=8080;

fs.readFile('./Serverliste/index.html', function (err, html) {
    if(err) throw err;

    const server = http.createServer((request, response) => {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
        console.log("[Server]: Server erfollgreich erstellt!");
    }).listen(PORT);

    server.listen(PORT, "127.0.0.1/test", () => {
        console.log("Test bestanden!");
    })
});