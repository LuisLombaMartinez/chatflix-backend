import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from "cors";
import createHttpError from 'http-errors';
import routes from './routes/index.js';

// dotEnv config
dotenv.config();

const app = express();

// morgan
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// helmet
app.use(helmet());

// parse JSON request url
app.use(express.json());

// parse JSON request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// enable cookie-parser
app.use(cookieParser());

// gzip compression
app.use(compression());

// file upload
app.use(fileUpload({
    useTempFiles: true,
}));

// cors
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// api v1 routes
app.use('/api/v1', routes);

// define default error messages
app.use(async (req, res, next) => {
    next(createHttpError.NotFound('This route does not exist!'));
});

// error handling
app.use(async (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message || "Internal Server Error",
        },
    });
});

export default app;