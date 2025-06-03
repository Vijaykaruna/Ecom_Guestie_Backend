const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const SelectedFoodsSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  mobile: {type: String, required: true},
  roomNumber: { type: Number, required: true },
  guestId: {type: String, required: true},
});

const SelectedFoodsModel = model("Selected_Foods", SelectedFoodsSchema);
module.exports = SelectedFoodsModel;
