import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String},
  username: { type: String },
  password: { type: String },
  email: { type: String },
  phone: { type: String },
  dob: { type: Date },
  gender: { type: String },
  signature: { type: String },
})

const UserModel = mongoose.model('User', userSchema)
export {UserModel as User}

