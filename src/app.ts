import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardsRouter from './routes/cards';

const { PORT = 3000, BASE_PATH = 'none' } = process.env;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestdb');

app.use((req: any, res, next) => {
  req.user = {
    _id: '6568d3a536fbf604553c811e'
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardsRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(BASE_PATH);
});