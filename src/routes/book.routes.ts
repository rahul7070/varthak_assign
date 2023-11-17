import { Router, Request, Response } from 'express';
import { auth, checkRole } from '../middlewares/auth.middleawre';
import Book, { BookDocument } from '../models/book.model';

const bookRouter = Router();

// Get all books
bookRouter.get('/', auth, async (req: Request, res: Response) => {
  try {
    const userRoles = (req.user as any)?.roles || [];
    // console.log(userRoles)
    let books: BookDocument[] = [];

    if (userRoles.includes('VIEW ALL')) {
      books = await Book.find();
    } else if (userRoles.includes('VIEWER')) {
      books = await Book.find({ createdBy: (req.user as any)?._id });
    }

    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a book
bookRouter.post('/', auth, checkRole('CREATOR'), async (req: Request, res: Response) => {
  try {
    const { title, author } = req.body;
    const createdBy = (req.user as any)?._id;

    const newBook: BookDocument = new Book({ title, author, createdBy });
    await newBook.save();

    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get books based on query params
bookRouter.get('/search', auth, async (req: Request, res: Response) => {
  try {
    const { old, new: isNew } = req.query;
    let books: BookDocument[] = [];

    if (old === '1') {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      books = await Book.find({ createdAt: { $lte: tenMinutesAgo } });
    } else if (isNew === '1') {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      books = await Book.find({ createdAt: { $gte: tenMinutesAgo } });
    }

    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



export default bookRouter;
