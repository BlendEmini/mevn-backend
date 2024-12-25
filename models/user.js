import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Keep 'name' required for registration
  },
  email: {
    type: String,
    required: true, // Keep 'email' required for registration
  },
  passwordHash: {
    type: String,
    required: true, // Keep 'passwordHash' required for registration
  },
  phone: {
    type: String,
    required: false, // Make phone optional for registration
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: "", // Make street optional for registration
  },
  apartment: {
    type: String,
    default: "", // Make apartment optional for registration
  },
  zip: {
    type: String,
    default: "", // Make zip optional for registration
  },
  city: {
    type: String,
    default: "", // Make city optional for registration
  },
  country: {
    type: String,
    default: "", // Make country optional for registration
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

const User = mongoose.model("User", userSchema);
export default User;
