const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const UserModel = require('./src/Users.js');
const FoodsModal = require('./src/Foods.js');
const SelectedFoodsModel = require('./src/SelecteddFoods.js');
const GuestModel = require("./src/Guest.js"); 
const ReviewModel = require('./src/Review.js')
const OrderListModel = require("./src/OrderLists.js")


const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = "gsdg23734dfhhjsqdq";

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());

mongoose.connect('mongodb+srv://vijaykarunanithi2003:qDzooMjm0hW3vznl@cluster0.awfmc6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.listen(5000, () => {
    console.log("server running in  port 5000");
});
app.post("/signup", async(req, res) => {
    const {name, email, password} = req.body;
    try{
        const User = await UserModel.create({
            name,
            email,
            password: bcrypt.hashSync(password, salt)
        })
        res.status(200).json("Success");
    }
    catch(e){
      res.status(400).json(e);
    }
});

app.post("/login", async(req, res) => {
    const {email, password} =req.body;
    const UserDetails = await UserModel.findOne({email});
    if(UserDetails){
        const pass = bcrypt.compareSync(password, UserDetails.password);
        if(pass){
            jwt.sign({email, name: UserDetails.name, id: UserDetails._id}, secret, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token',token).json("Success");
            })
        }
        else{
           res.status(400).json("!Incorrect Password");
        }
    }
    else{
        res.status(400).json("!Email not found");
    }
})

app.get("/profile", (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    })
})
app.post("/logout", (req, res) => {
    res.cookie('token','').json("logged out!").status(200);
})

app.post("/addFood", async(req, res) => {
    const {id, title, category, price} = req.body;
    try{
        const foodsDoc = await FoodsModal.create({
            id,
            title,
            category,
            price,
        })
        res.status(200).json("Success");
    }
    catch(e){
     res.status(400).json(e);
    }
})

app.get("/foodItems", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, secret);

    const categoryOrder = ["BreakFast", "Lunch", "Dinner", "Refreshment"];
    
    const foods = await FoodsModal.find({ id: decoded.id });

    const sortedFoods = foods.sort(
      (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    );

    res.status(200).json(sortedFoods);
  } catch (error) {
    console.error("Error fetching food items:", error.message);
    res.status(401).json({ error: "Unauthorized or invalid token" });
  }
});

app.get("/breakfast", async(req, res) => {
    const{token} =req.cookies;
    let id;
    jwt.verify(token, secret, {}, (err, info)=> {
        if(err) throw err;
        id = info.id;
    })
    const breakfast = await FoodsModal.countDocuments({id, category: "BreakFast"});
    res.status(200).json(breakfast);
})
app.get("/lunch", async(req, res) => {
    const{token} =req.cookies;
    let id;
    jwt.verify(token, secret, {}, (err, info)=> {
        if(err) throw err;
        id = info.id;
    })
    const lunch = await FoodsModal.countDocuments({id, category: "Lunch"});
    res.status(200).json(lunch);
})
app.get("/dinner", async(req, res) => {
    const{token} =req.cookies;
    let id;
    jwt.verify(token, secret, {}, (err, info)=> {
        if(err) throw err;
        id = info.id;
    })
    const dinner = await FoodsModal.countDocuments({id, category: "Dinner"});
    res.status(200).json(dinner);
})
app.get("/refreshment", async(req, res) => {
    const{token} =req.cookies;
    let id;
    jwt.verify(token, secret, {}, (err, info)=> {
        if(err) throw err;
        id = info.id;
    })
    const refreshment = await FoodsModal.countDocuments({id, category: "Refreshment"});
    res.status(200).json(refreshment);
})

app.delete("/delete", async(req, res)=> {
    const {id} = req.body;
    try{
        const foodDel = await FoodsModal.deleteOne({_id:id})
        res.status(200).json(foodDel);
    }
    catch(e){
        res.status(400).json(e);
    }
})

app.get("/listBreakfast", async(req, res) => {
    const {token} = req.cookies;
    let id;
    try {
        jwt.verify(token, secret, {}, async (err, info) => {
          if (err) throw err;
          id = info.id;
          const foods = await FoodsModal.find({ id, category: "BreakFast" });
          res.status(200).json(foods);
        });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
})
app.get("/listDinner", async(req, res) => {
    const {token} = req.cookies;
    let id;
    try {
        jwt.verify(token, secret, {}, async (err, info) => {
          if (err) throw err;
          id = info.id;
          const foods = await FoodsModal.find({ id, category: "Dinner" });
          res.status(200).json(foods);
        });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
})
app.get("/listLunch", async(req, res) => {
    const {token} = req.cookies;
    let id;
    try {
        jwt.verify(token, secret, {}, async (err, info) => {
          if (err) throw err;
          id = info.id;
          const foods = await FoodsModal.find({ id, category: "Lunch" });
          res.status(200).json(foods);
        });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
})
app.get("/listRefreshment", async(req, res) => {
    const {token} = req.cookies;
    let id;
    try {
        jwt.verify(token, secret, {}, async (err, info) => {
          if (err) throw err;
          id = info.id;
          const foods = await FoodsModal.find({ id, category: "Refreshment" });
          res.status(200).json(foods);
        });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
})

app.post("/addSelectedFoods", async (req, res) => {
  const { cart, roomNumber, mobile, guestId } = req.body;

  if (!roomNumber || !mobile || !Array.isArray(cart)) {
    return res.status(400).json({ error: "Invalid data" });
  }
  try {
    const formattedCart = cart.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      roomNumber,
      mobile,
      guestId,
    }));

    const savedItems = await SelectedFoodsModel.insertMany(formattedCart);
    res.status(200).json({ message: "Success", data: savedItems });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({ error: "Insert failed", details: error.message });
  }
});

app.get("/SelectedFoods", async (req, res) => {
  const { mobile } = req.query;
  const { token } = req.cookies;
  let id;

  try {
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      id = info.id;
      const selectFoods = await SelectedFoodsModel.find({ id, mobile });
      res.status(200).json(selectFoods);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/addGuest", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, secret);

    const newGuest = new GuestModel({
      ...req.body,
      id: decoded.id,
    });

    const savedGuest = await newGuest.save();
    res.status(200).json({ message: "Guest added", id: savedGuest._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add guest" });
  }
});

app.patch("/updateStay/:id", async (req, res) => {
  const { id } = req.params;
  const { stay } = req.body;

  try {
    const updatedGuest = await GuestModel.findByIdAndUpdate(
      id,
      { stay },
      { new: true }
    );
    if (!updatedGuest) {
      return res.status(404).json({ message: "Guest not found" });
    }
    res.status(200).json({ message: "Stay updated", data: updatedGuest });
  } catch (err) {
    console.error("Error updating stay:", err);
    res.status(500).json({ message: "Failed to update stay" });
  }
});

app.get("/guests", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, secret);

    const guests = await GuestModel.find({ id: decoded.id });
    res.status(200).json(guests);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized or invalid token" });
  }
});

app.post("/verifyGuest", async (req, res) => {
  const { mobile, roomNumber } = req.body;
  const token = req.cookies.token;

  if (!mobile || !roomNumber) {
    return res.status(400).json({ success: false, message: "Mobile and Room Number are required" });
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Missing authentication token" });
  }

  try {
  const decoded = jwt.verify(token, secret);
  const id = decoded.id;

  const guest = await GuestModel.findOne({ mobile, roomNumber, id });

  if (!guest || guest.stay !== "Yes") {
    return res.status(200).json({ success: false });
  }

  const guestId = guest._id;
  return res.status(200).json({ success: true, guestId });

} catch (error) {
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
  console.error("Database error:", error);
  return res.status(500).json({ success: false, message: "Internal server error" });
}
});

app.post("/AddOrderFoods", async (req, res) => {
  const { guestId, mobile, name, amount, roomNumber, date, foods } = req.body;
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, secret);
    const id = decoded.id;
    const guestOrder = await OrderListModel.create({
      id: id,
      guestId,
      mobile,
      name,
      status: "Pending",
      amount,
      roomNumber,
      date,
      foods: foods.map(food => ({
        title: food.title,
        price: food.price,
        quantity: food.quantity,
      }))
    });

    res.status(201).json({ message: "Order placed", order: guestOrder });
  } catch (error) {
    console.error("Error while creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

app.get("/guestName", async (req, res) => {
  const { mobile } = req.query;
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, secret);

    const guests = await GuestModel.find({ id: decoded.id, mobile });

      if (!guests.length) return res.status(404).json({ error: "Guest not found" });
      res.status(200).json({ name: guests[0].name });

  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized or invalid token" });
  }
});

app.get("/OrderFoods", async (req, res) => {
  const { guestId } = req.query;
  const { token } = req.cookies;
  let id;
  try {
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      id = info.id;
      const OrderFoods = await OrderListModel.find({ guestId });
      res.status(200).json(OrderFoods);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/ClearFoods", async (req, res) => {
  const { guestId } = req.body;
  try {
    const result = await SelectedFoodsModel.deleteMany({ guestId });
    res.status(200).json({ message: "All guest food entries deleted", result });
  } catch (e) {
    console.error("Deletion error:", e);
    res.status(400).json({ error: "Failed to delete records", details: e.message });
  }
});

app.get("/OrderFoodList", async (req, res) => {
  const { token } = req.cookies;
  let id;
  try {
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      id = info.id;

      const OrderFoods = await OrderListModel.find({ id });

      const statusOrder = {
        "Pending": 1,
        "Delivered": 2,
        "Rejected": 3
      };

      const sortedOrders = OrderFoods.sort(
        (a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99)
      );

      res.status(200).json(sortedOrders);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/OrderFoodListPending", async (req, res) => {
  const { token } = req.cookies;
  let id;
  try {
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      id = info.id;
      const OrderFoods = await OrderListModel.find({ id, status: "Pending" });
      res.status(200).json(OrderFoods);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/showOrderFoods", async (req, res) => {
  const { _id } = req.query;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const userId = decoded.id;

    const order = await OrderListModel.findOne({ _id, id: userId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json([order]);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/updateStatus", async (req, res) => {
  const { _id } = req.query;
  const { status } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Missing authentication token" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const updateStatus = await OrderListModel.findOneAndUpdate(
      { _id },
      { status },
      { new: true }
    );

    if (!updateStatus) {
      return res.status(404).json({ message: "Guest not found" });
    }

    res.status(200).json({ message: "Status updated", data: updateStatus });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

app.get("/orders/guest/:id", async (req, res) => {
  const { token } = req.cookies;

  try {
    const decoded = jwt.verify(token, secret);

    const orders = await OrderListModel.find({
      id: decoded.id,
      guestId: req.params.id,
      status: "Delivered"
    });

    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    const totalAmount = orders.reduce((sum, order) => {
      const orderTotal = order.foods.reduce((foodSum, item) => {
        return foodSum + item.price * item.quantity;
      }, 0);
      return sum + orderTotal;
    }, 0);

    await GuestModel.findByIdAndUpdate(req.params.id, { amount: totalAmount });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching guest orders:", error);
    res.status(500).json({ message: "Failed to fetch guest orders." });
  }
});

app.put("/sync/guest-amounts", async (req, res) => {
  try {
    const guests = await GuestModel.find();
    
    for (const guest of guests) {
      const orders = await OrderListModel.find({ guestId: guest._id, status: "Delivered" });

      const totalAmount = orders.reduce((sum, order) => {
        return sum + order.foods.reduce((foodSum, food) => foodSum + food.price * food.quantity, 0);
      }, 0);

      guest.amount = totalAmount;
      await guest.save();
    }

    res.status(200).json({ message: "Guest amounts updated successfully." });
  } catch (error) {
    console.error("Error syncing guest amounts", error);
    res.status(500).json({ message: "Failed to sync guest amounts." });
  }
});

app.get("/OrderFoodListDelivered", async (req, res) => {
  const { _id } = req.query;
  const { token } = req.cookies;

  try {
    const info = jwt.verify(token, secret);
    const id = info.id;

    const OrderFoods = await OrderListModel.find({
      id,
      guestId: _id,
      status: "Delivered",
    });

    res.status(200).json(OrderFoods);
  } catch (error) {
    console.error("Error in /OrderFoodListDelivered:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/PaymentAlert", async (req, res) => {
  const { _id } = req.query;
  const { token } = req.cookies;

  try {
    const info = jwt.verify(token, secret);
    const id = info.id;

    const OrderFoods = await GuestModel.findOne({
      id,
      _id,
    });

    res.status(200).json(OrderFoods);
  } catch (error) {
    console.error("Error in /OrderFoodListDelivered:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/PaymentStatus", async (req, res) => {
  const { _id } = req.query;
  const { token } = req.cookies;

  try {
    const info = jwt.verify(token, secret);
    const id = info.id;

    const updatedGuest = await GuestModel.findOneAndUpdate(
      { _id },
      { payment: "Paid", stay: "No" },
      { new: true }
    );

    if (!updatedGuest) {
      return res.status(404).json({ error: "Guest not found" });
    }

    res.status(200).json({ message: "Payment status updated successfully", guest: updatedGuest });
  } catch (error) {
    console.error("Error in /PaymentStatus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/AddReview", async (req, res) => {
  const { guestId, comments, name, date, roomNumber } = req.body; // <-- FIXED
  const { token } = req.cookies;

  try {
    const info = jwt.verify(token, secret);
    const id = info.id;

    const reviewDoc = await ReviewModel.create({
      id,
      guestId,
      message: comments,
      name,
      date,
      roomNumber,
    });

    res.status(200).json({ message: "Review added successfully", reviewDoc });
  } catch (e) {
    res.status(400).json(e);
  }
});

app.get("/Reviews", async (req, res) => {
  const { token } = req.cookies;
  try{
    const info = jwt.verify(token, secret);
    const id = info.id;
    const reviews = await ReviewModel.find({ id });
    res.status(200).json(reviews);
  }
  catch(error){
    res.status(error).json(error);
  }
})
