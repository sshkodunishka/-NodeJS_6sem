const express = require('express');
const path = require('path')
const fs = require('fs')
const app = express();

const wasmPath = path.resolve('func.wasm');
const wasmCode = fs.readFileSync(wasmPath);
const wasmImports = {};
const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule, wasmImports);

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/task2.html');
});

app.get('/wasm', (request, response) => {
    response.sendFile(__dirname + '/func.wasm');
});

app.get('/sum', (request, response) => {
    response.json(wasmInstance.exports.sum(3,4))
});

app.get('/mul', (request, response) => {
    response.json(wasmInstance.exports.mul(3,4))
});

app.get('/sub', (request, response) => {
    response.json(wasmInstance.exports.sub(3,4))
});

app.get('/task1', (request, response) => {
    response.sendFile(__dirname + '/task1.html');
});

app.listen(3000, () => {
    console.log(' http://localhost:3000');
});
