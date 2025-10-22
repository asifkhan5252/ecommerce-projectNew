import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    // lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    minlength: 6
  },
  Address: {
    type: String,
    required: true,
    // minlength: 3
  },
  answer:{
    type:String,
    required:true,
  },

  role: {
    type: Number,
    // enum: ['user', 'admin'],
    default: 0
  },
},{timestamps:true});

const User = mongoose.model('users', userSchema);

export default User;
