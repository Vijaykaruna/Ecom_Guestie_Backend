const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const FoodItems = new Schema({
    id: { type : String, required: true},
    title: { type: String, required: true},
    category: { type: String, required: true},
    price: { type: Number, required: true},
});

const FoodsModal = model("food_Items", FoodItems);
module.exports = FoodsModal;

