import express, { Request, Response } from 'express';

import dotenv from 'dotenv';
import { connection } from './config/db';
import authRouter from './routes/auth.routes';
import { auth } from './middlewares/auth.middleawre';
import bookRouter from './routes/book.routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// MongoDB Connection
connection();



// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Library App API');
});

app.use('/auth', authRouter);
app.use(auth);
app.use('/books', bookRouter);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
