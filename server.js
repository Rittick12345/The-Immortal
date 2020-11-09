const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

//routes file
const bootcampRouter = require('./routes/bootcamps');
const courseRouter = require('./routes/courses');
const auth = require('./routes/auth');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

//body parser middleware
app.use(express.json());

//cookie parser middleware
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  //setting the morgan middleware
  app.use(morgan('dev'));
}

//makeing public as static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', auth);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`server is running in ${process.env.NODE_ENV} mode at port no ${PORT}`.yellow.bold);
});

//handle unhandle promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`.red.underline);
  server.close(() => process.exit(1));
});
