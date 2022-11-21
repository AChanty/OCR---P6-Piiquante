const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// applique le plugin "mongoose unique validator" qui évite le fait que plusieurs utilisateurs puissent utliser la même adresse email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);