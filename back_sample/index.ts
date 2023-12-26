import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});