const express = require('express');
const authRouter = express.Router();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
require('dotenv').config();
const store = new session.MemoryStore();
const {pool} = require('../model/database');
const {body} = require('express-validator');
// const csrfProtection = require('../csrfConfig');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async function verify(username, password, done) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [username]);
        if (result.rows.length === 0) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
    } catch(err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
      
passport.deserializeUser(async (id, done) => {
    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return done(null, false);
        }

        done(null, result.rows[0]);
    } catch (err) {
        done(err);
    }
});

authRouter.post('/register', async (req, res, next) => {
    try {
        const { email, name, password } = req.body;

        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (email, name, password) 
            VALUES ($1, $2, $3) 
            RETURNING id, email, name`,
            [email, name, hashedPassword]
        );

        const newUser = result.rows[0];

        req.logIn(newUser, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(201).json(newUser);
        });
        
    } catch (error) {
        next(error);
    }
});

authRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
});

authRouter.get('/is_logged_in', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ user: req.user, isAuth: true });
    } else {
        return res.status(401).json({ error: 'Not authenticated', isAuth: false });
    }
});

const initAuth = (app) => {
    app.set('trust proxy', 1);
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true, 
            maxAge: 8640000000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' //none
        },
        store: store
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};

module.exports = {authRouter, initAuth};