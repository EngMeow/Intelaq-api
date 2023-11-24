import express from 'express';
import dotenv from 'dotenv'
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

// create my port number
dbConnection()
dotenv.config()

const port = process.env.SERVER_PORT || 3000 ;
const app = express();
// to extract data from json

// parse cookies
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// middle-ware
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/employers', employerRouter);
app.use('/api/v1/employees', employeeRouter);
app.use('/api/v1/jobs', jobRouter);
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