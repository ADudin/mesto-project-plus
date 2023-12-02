import mongoose from "mongoose";

interface ICard {
  name: string;
  link: string;
  owner: mongoose.ObjectId;
  likes: mongoose.ObjectId[];
  createdAt: Date;
};

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ICard>('card', cardSchema);