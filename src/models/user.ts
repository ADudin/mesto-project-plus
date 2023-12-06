import mongoose from 'mongoose';

const validator = require('validator');

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'неправильнй формат почты'
    }
  },
  password: {
    type: String,
    required: true
  }
});

export default mongoose.model<IUser>('user', userSchema);