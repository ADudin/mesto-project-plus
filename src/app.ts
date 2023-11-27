import express from 'express';
import mongoose from 'mongoose';

const { PORT = 3000, BASE_PATH = 'none' } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestdb');

app.listen(PORT, () => {
  //console.log(BASE_PATH);
});