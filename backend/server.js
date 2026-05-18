const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS - Allow all origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/dxsurecrm")
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log(err));

// ROUTES CONNECTION ✅
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/pettycash", require("./routes/pettyCashRoutes"));
app.use("/api/client-payments", require("./routes/clientPaymentRoutes"));

app.listen(5000,()=>{
 console.log("Server running on port 5000");
});