const mongoose = require('mongoose');

const connectDataBase = () => {

  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.log('Error', err));

}

module.exports = connectDataBase;