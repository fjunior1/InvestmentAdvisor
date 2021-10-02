const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const AGE = ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60+"];
const INCOME = ["<30k", "30k-49k", "50k-69k", "70k-89k", "90k-109k", "110k-129k",
  "130k-149k", "150k-169k", "170k-189k", "190k-209k", "210k-229k", "230k-249k", "250k+"];
const RISK = ["minimum", "low", "medium", "high", "maximum"];
    
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },

  // FD adding extra information for user based on documentation : 
  // name, lastName, address, phone, income[range{ enum}], age[range{ enum}]
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
  },
  address: {
    type: String,
    required: false,
    minlength: 10,
  },
  phone: {
    type: String,
    required: false,
    unique: false,
    // regex101.com
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Must match phone number format !'],
  },
  income:{
    type: String,
    enum: INCOME,
    required: true,
  },
  age:{
    type: String,
    required: true,
    enum: AGE,
  },
  risk:{
    type: String,
    required: true,
    enum: RISK,
  }
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
