import express from 'express';
import logger from 'morgan';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import {connect} from './config/db';
import {restRouter} from './api';
import swaggerDocument from './config/swagger.json';
import {configJWTStrategy} from './api/middlewares/passport-jwt';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

connect();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}
app.use(passport.initialize()); // req.user
configJWTStrategy();
app.use('/api', restRouter);
app.use(
    '/',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        explorer: true,
    })
);
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        error: {
            message: error.message,
        },
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at PORT http://localhost:${PORT}`);
});
