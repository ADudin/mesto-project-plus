import mongoose from 'mongoose';
import validator from 'validator';

const bcrypt = require('bcrypt');

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
};

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
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
    required: true,
    select: false
  }
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {

  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if(!user) {
        return Promise.reject(new Error('неправильная почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched: boolean) => {

        if (!matched) {
          return Promise.reject(new Error('неправильная почта или пароль'));
        }

        return user;
      });
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);