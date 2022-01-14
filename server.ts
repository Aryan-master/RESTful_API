import express from 'express';
import bodyParser from "body-parser";



import { client } from './connections';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import {check,validationResult} from 'express-validator';
import { v4 as uuidv4 } from 'uuid';


const PORT: Number = 4000;

app.listen(PORT, () => {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
})

app.get('/users', async (req, res) => {
    try {
        let sql = `SELECT * FROM users`
        const { rows } = await client.query(sql)
        res.send(rows)
    } catch (error) {
        throw error
    }
})


app.post('/users',[
    check('firstname').notEmpty().withMessage('firstname cannot be empty'),
    check('lastname').notEmpty().withMessage('lastname cannot be empty'), 
    check('location').notEmpty().withMessage('lastname cannot be empty').isAlpha('en-US',{ignore:' '}), 
],(req, res) => {

    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const user = req.body;
        // console.log(user);
        let id=uuidv4();
        const insertQuery = `insert into users(id, firstname, lastname, location) values('${id}','${user.firstname}', '${user.lastname}', '${user.location}')`
        client.query(insertQuery, (err, result) => {
            if (!err) {
                res.status(201).send("Added new user");
            }
            else {
                console.log(err)
            }
        })
    } catch (err) {
        console.error("400");
    }
    // client.end;
});

app.put('/users',(req, res) => {
    try {
        const id = req.query.id as string;
        const user = req.body;
        const updateQuery = `update users set firstname =$1,lastname = $2,
    location = $3 where id = $4`

        client.query(updateQuery,[user.firstname,user.lastname,user.location,id], (err, result) => {
            if (!err) {
                res.status(201).send('Update was successful')
            }
            else { console.log(err.message) }
        })
    } catch (err) {
        console.error("400");
    }
});

app.delete('/users/:id', (req, res) => {
    try {
        const insertQuery = `delete from users where firstname=${req.params.id}`

        client.query(insertQuery, (err, result) => {
            if (!err) {
                res.send('Deletion was successful')
            }
            else { console.log(err.message) }
        })
    } catch (err) {
        console.error("400");
    }
});