const mongoose = require('mongoose');

// Supplier Schema
const supplierSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

module.exports = mongoose.model('Supplier', supplierSchema);