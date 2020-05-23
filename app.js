const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs-crud'
});

conn.connect(function (err) {
    if (!!err)
        console.log(err);
    else
        console.log("Connected!")
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    let sql = "SELECT * FROM users";
    let query = conn.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('index', {
            title: "CRUD Application using NODE JS and MySQL",
            users: rows
        });
    });
});

app.get('/add-user', (req, res) => {
    res.render('add-user', {
        'title': 'Add new User'
    });
});

app.get('/edit-user/:id', (req, res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM users WHERE id= ${id}`;
    let query = conn.query(sql, (err, result) => {
        if (err) throw err;
        res.render('edit-user', {
            title: "Update User Information",
            user: result[0]
        });
    });
});

app.post('/save-user', (req, res) => {
    let data = { firstname: req.body.firstname, lastname: req.body.lastname, address: req.body.address };
    let sql = "INSERT INTO users SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect("/");
    });
});

app.post('/update-user', (req, res) => {
    const id = req.body.id;
    let sql = "UPDATE users SET firstname='" + req.body.firstname + "', lastname='" + req.body.lastname + "', address='" + req.body.address + "' WHERE id=" + id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/delete-user/:id', (req, res) => {
    const id = req.params.id;
    let sql = `DELETE FROM users WHERE id=${id}`;
    let query = conn.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});


app.listen(3000, () => {
    console.log("Server is running in port 3000");
});