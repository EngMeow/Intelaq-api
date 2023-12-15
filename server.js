import express from 'express';
import dotenv from 'dotenv'
import path from 'path';
import dbConnection from './dbConnection.js'
import { AppError } from './src/utils/AppError.js';
import { globalErrorMiddleware } from './src/utils/globalErrorMiddleware.js';
import userRouter from './src/modules/user/user.router.js';
import authRouter from './src/modules/auth/auth.Routes.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import employerRouter from './src/modules/employer/employer.router.js';
import employeeRouter from './src/modules/employee/employee.router.js';
import jobRouter from './src/modules/job/job.router.js';
import cors from 'cors';
import myApplicationRouter from './src/modules/application/myApp.router.js';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';

// create my port number
dbConnection()
dotenv.config()

const port = process.env.SERVER_PORT || 3000 ;
const app = express();
const __dirname = path.resolve();

// to extract data from json

// HTTP request logger middleware for node.js
app.use(morgan('dev'));

// enable cors
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// set security headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// protect against HTTP Parameter Pollution attacks
app.use(hpp());

// compress all responses
app.use(compression());

// parse json and urlencoded data into req.body
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message:
//     'Too many accounts created from this IP, please try again after an hour',
// });

// serve static files
app.use(
  '/static',
  express.static(path.join(__dirname, 'backend', 'public', 'uploads'))
);

// middle-ware
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/employers', employerRouter);
app.use('/api/v1/employees', employeeRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/applications', myApplicationRouter);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find this route ${req.originalUrl}`, 404))
})

// global error handling middleware
app.use(globalErrorMiddleware)
// data base connection 
const server = app.listen( port , (err) =>{
    if (!err) return console.log('server listening on port : ' + port);
    console.log('error listening on port' + err);
})

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error(`Shutting down....`);
      process.exit(1);
    });
  });
  
  // Handle uncaughtException outside express
  process.on('uncaughtException', (err) => {
    console.error(`uncaughtException Errors: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error(`Shutting down....`);
      process.exit(1);
    });
  });