const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const ALLOWED_ROLES = ["admin", "employee"];

// REGISTER USER
exports.register = async(req,res)=>{
 try{
   const {name,email,password,role} = req.body;

   const normalizedEmail = (email || "").trim().toLowerCase();
   if(!name || !normalizedEmail || !password){
     return res.status(400).json({message:"Name, email and password are required"});
   }

   const existingUser = await User.findOne({email: normalizedEmail});
   if(existingUser){
     return res.status(400).json({message:"Email already registered"});
   }

   const hashedPassword = await bcrypt.hash(password,10);
   const normalizedRole = ALLOWED_ROLES.includes(role) ? role : "employee";

   const user = await User.create({
     name,
     email: normalizedEmail,
     password:hashedPassword,
     role: normalizedRole
   });

   res.status(201).json({
     id: user._id,
     name: user.name,
     email: user.email,
     role: user.role
   });
 }catch(err){
   res.status(500).json(err.message);
 }
};

// LOGIN USER
exports.login = async(req,res)=>{
 try{
   const {email,password} = req.body;

   const normalizedEmail = (email || "").trim().toLowerCase();
   if(!normalizedEmail || !password){
     return res.status(400).json({message:"Email and password are required"});
   }

   const user = await User.findOne({email: normalizedEmail});
   if(!user) return res.status(400).json({message:"User not found"});

   let match = await bcrypt.compare(password,user.password);

   // One-time migration path for old records that may have plaintext passwords.
   if(!match && user.password === password){
     user.password = await bcrypt.hash(password,10);
     await user.save();
     match = true;
   }

   if(!match) return res.status(400).json({message:"Invalid password"});

   const token = jwt.sign(
     {id:user._id, role:user.role, name:user.name, email:user.email},
     JWT_SECRET
   );

   res.json({
     token,
     user: {
       _id: user._id,
       email: user.email,
       role: user.role,
       name: user.name
     }
   });
 }catch(err){
   res.status(500).json({message: err.message});
 }
};

// GET LOGGED-IN USER PROFILE
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("_id name email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};