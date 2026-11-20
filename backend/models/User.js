const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    enrollmentId: {
      type: String,
      required: [true, 'University enrollment ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: [true, 'University email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid university email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    hostelName: {
      type: String,
      required: [true, 'Hostel name is required (e.g. Block B, Aryabhatta Hall)'],
      trim: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required (e.g. Room 304)'],
      trim: true,
    },
    academicYear: {
      type: String,
      default: '1st Year',
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    avgRating: {
      type: Number,
      default: 5.0,
      min: 1.0,
      max: 5.0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    disclaimerAccepted: {
      type: Boolean,
      default: false,
    },
    disclaimerAcceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password on login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook: Hash password with bcrypt before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next ? next() : undefined;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (next) next();
});

// Remove sensitive password field when serializing user to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
