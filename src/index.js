const express = require('express');
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const collection = require('./config');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const JWT_SECRET = "login12";

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send("User already exists. Use a different username.");
    } else {
        const salt = 10;
        const hash = await bcrypt.hash(data.password, salt);
        data.password = hash;

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect('/');
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("User not found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            const token = jwt.sign({ username: check.name }, JWT_SECRET, { expiresIn: '10m' });
            res.json({ message: "Login done ", token: token });
        } else {
            res.send("Wrong password");
        }
    } catch {
        res.send("Wrong details");
    }
});


app.get('/home', authenticateToken, (req, res) => {
    res.render("home");
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on :${port}`);
});
