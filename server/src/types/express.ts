import { Request } from 'express';
import { Server } from 'socket.io';

// Extended Express Request interface to include user and socket.io
export interface ExtendedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  io?: Server;
}