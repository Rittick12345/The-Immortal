const express = require('express');
const dotenv = require('dotenv');
const bootcampsRouter = require('./routes/bootcamps');

dotenv.config({ path: './config/config.env' });

const app = express();

app.use('/api/v1/bootcamps', bootcampsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running in ${process.env.NODE_ENV} at port no ${PORT}`);
});
