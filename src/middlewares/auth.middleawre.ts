// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/user.model';


declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // Extend Request object with 'user' property
    }
  }
}


export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const authHeader = req.headers.authorization;
  // const token = authHeader && authHeader.split(' ')[1];
  const token = req.header('Authorization')|| req.header('Authorization')?.split(' ')[1];
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    // console.log(decoded)
    const user: UserDocument | null = await User.findById(decoded.userId);
    // console.log(user)

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
       
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const checkRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user:any = req.user as UserDocument;
    console.log(user)

    if (!user.roles.includes(role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
  };
};
