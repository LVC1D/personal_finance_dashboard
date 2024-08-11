const express = require('express');
const app = express();
const port = process.env.PORT || 7934;
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const partials = require('express-partials');
const flash = require('connect-flash');
require('dotenv').config();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https://static-assets.codecademy.com"],
          connectSrc: ["'self'", "http://localhost:7934"]
        },
      },
}));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'personal_finance_dasboard', 'dist')));
app.use(partials());

app.use(flash());

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'personal_finance_dasboard', 'dist', 'index.html'));
});

app.listen(() => {
    console.log(`Listening on port ` + port);
    console.log(`Dirname: ${path.basename}`);
})