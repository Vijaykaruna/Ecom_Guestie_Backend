const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const FoodItemSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const OrderListsSchema = new Schema({
  guestId: { type: String, required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  roomNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true},
  date: { type: String, required: true },
  foods: [FoodItemSchema],
});
module.exports = model("Order_Lists", OrderListsSchema);