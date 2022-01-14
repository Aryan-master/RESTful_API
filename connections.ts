const {Client} = require('pg')

export const client= new Client({
host: "localhost",
user: "postgres",
port: 5432,
password: "test@123",
database: "postgres",
})
client.connect();


client.query('SELECT NOW()', (err, res) => {
    const {rows} = res
    console.log("`db Connection established at ===============",rows);
    // console.log(err, res)  
})


// module.exports = {
//     query: (text, params) => client.query(text, params),
//   }