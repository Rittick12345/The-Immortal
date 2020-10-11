const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
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
