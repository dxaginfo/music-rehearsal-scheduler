import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/config';
import { logger } from '../utils/logger';
import { ExtendedRequest } from '../types/express';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const authenticate = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const secret = process.env.JWT_SECRET || 'supersecret';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    // Optionally check if user still exists in database
    const userExists = await db('users').where({ id: decoded.id }).first();
    if (!userExists) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    next();
  } catch (err: any) {
    logger.error('Authentication error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

// Optional: Middleware for role-based access control
export const authorize = (roles: string[]) => {
  return (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied: You do not have the required role to access this resource',
      });
    }

    next();
  };
};