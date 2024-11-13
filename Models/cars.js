
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
  marque: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User model
});

module.exports = mongoose.model('Car', carSchema);
