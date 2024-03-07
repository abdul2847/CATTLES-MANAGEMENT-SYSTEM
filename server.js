const express = require('express')
require("dotenv").config();
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session')
const flash = require('express-flash')
const morgan = require('morgan')
const compression = require('compression')
const MongoStore = require('connect-mongo');


const app = express();


// ==========================Configure express-session=============================//

// Use MongoStore as session store
app.use(session({
    secret: 'Your_Secret_Key',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://abdulhafis2847:pious2847@managementsystem.xc5xoxl.mongodb.net/'
    })
  }));

app.use(flash());

app.use((req, res, next) => {
    res.locals.message = req.flash('alert');
    next();
});
app.use(cookieParser());
app.use(morgan('tiny'))

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================================Intializing of Database==========================//
require('./database/database')()

//============================== Configure EJS as the view engine===================//
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




// requiring all the route enpoints
const managerRouter = require('./routes/managerRouter')
const ownerRouter = require('./routes/ownerRouter')
const generalRouter = require('./routes/routers')

// Configure Express to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, './public')));

// Middleware for parsing JSON data
app.use(express.json());
app.use(compression());

// measuring the sped of site load
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} took ${duration}ms`);
    });
    next();
});


// Middleware for parsing form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }));


// Using the route endpoint
app.use(managerRouter)
app.use( ownerRouter)
app.use('/', generalRouter)

// ===============Handiling UncaughtExeptions ======================//

process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log(err)
    console.log("UNHANDLED EXCEPTION! 💥 Shutting down...");
    process.exit(1);
});


// ==================Handeling non-existing routers===============//
app.use(function(req, res, next) {
    res.status(404).render('404');
});

app.use(function(req, res, next) {
    res.status(503).render('503');
});


// =======================Starting Server and listening on port ============================//
const port = process.env.PORT || 3000;

const server = app.listen(port,(error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log(`Server loaded on http://localhost:${port}`)
    }
})

// ===============Handiling UnhandledRejection======================//

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log(err)
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});