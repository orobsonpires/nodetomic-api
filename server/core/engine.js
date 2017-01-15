
const path = require('path'); // Paths
const helmet = require('helmet'); // protection
const favicon = require('serve-favicon');
const bodyParser = require('body-parser'); //Parse params POST
const compression = require('compression'); //Compress response
const methodOverride = require('method-override'); // Put and DELETE methods
const cookieParser = require('cookie-parser'); // secret cookies
const config = require('./../config');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

module.exports = (app) => {

    //app.disable('x-powered-by')
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(bodyParser.urlencoded({extended: false}));
    /* app.all('*', function (req, res, next) {
     res.set('Access-Control-Allow-Origin', 'http://localhost');
     res.set('Access-Control-Allow-Credentials', true);
     res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
     res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
     if ('OPTIONS' == req.method)
     return res.send(200);
     next();
     });*/
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(compression());
    app.use(helmet());

    app.use(cors({
        origin: true,
        credentials: true
    }));

    /*SessionStore with Mongo*/
    /*
     const mongoStore = require('connect-mongo')(session);
     const mongoose = require('mongoose');
     app.use(session({
     secret: config.secret,
     saveUninitialized: true,
     resave: true,
     store: new mongoStore({
     mongooseConnection: mongoose.connection,
     collection: 'sessions' // default
     })
     }));
     */

    /*SessionStore with Redis*/
    //const RedisStore = require('connect-redis')(session);
    //Use for Twitter Auth -_-
    app.use(session({
        /* store: new RedisStore({
         //client: redisClient,
         host: config.redis.session.ip,
         port: config.redis.session.port,
         db: config.redis.session.db,
         ttl: config.redis.session.time
         }),*/
        secret: config.secret,
        resave: false,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(favicon(path.join(config.root, config.client, 'favicon.ico')));
    require('./dev')(app);
};