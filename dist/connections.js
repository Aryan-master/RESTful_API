"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var Client = require('pg').Client;
exports.client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "test@123",
    database: "postgres",
});
exports.client.connect();
exports.client.query('SELECT NOW()', function (err, res) {
    var rows = res.rows;
    console.log("`db Connection established at ===============", rows);
    // console.log(err, res)  
});
// module.exports = {
//     query: (text, params) => client.query(text, params),
//   }
