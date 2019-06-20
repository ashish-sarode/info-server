import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as validator from 'validator';
//import userRoleModel from './UserRoleModel';

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'Please enter your name!'] },
  email: { type: String, unique: true, lowercase: true, trim: true, required: [true, 'Please enter your email!'] },
  password: { type: String, required: [true, 'Please enter your password!'] },
  isActive: { type: Boolean, default: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'userRole', required: [true, 'Please assign role to user!'] },
  device: String,
  deviceId: String,
  fcmToken: String
});


userSchema.path('email').validate(function (email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, 'Invalid email given.')

// Before saving the user, hash the password
userSchema.pre('save', function (next) {
  const user = this;
  user.username = validator.escape(user.username);
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) { return next(error); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;