import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware'; // assuming you defined this type

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Access Denied');
    }

    next(); // ✅ Must call next and return void
  };
};
