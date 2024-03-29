import mongoose from 'mongoose';

const { Schema } = mongoose;
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    default: 1,
    required: true,
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
    required: true
  }
});

export default mongoose.model('User', userSchema);
