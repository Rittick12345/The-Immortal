const mongoose = require('mongoose');
const colors = require('colors');
const fs = require('fs');
const dotenv = require('dotenv');
const Bootcamp = require('./models/Bootcamp');

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});
const bootcamp = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

const importData = async () => {
  try {
    await Bootcamp.create(bootcamp);
    console.log(`data imported...`.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log(`data deleted...`.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
