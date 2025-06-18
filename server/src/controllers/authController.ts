import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/config';
import { logger } from '../utils/logger';
import { ExtendedRequest } from '../types/express';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = uuidv4();
    const newUser = {
      id: userId,
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db('users').insert(newUser);

    // Create JWT token
    const token = jwt.sign(
      { id: userId, email, role: 'user' },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const user = {
      id: userId,
      email,
      firstName,
      lastName,
      role: 'user',
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (err: any) {
    logger.error('Registration error:', err);
    res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };

    res.json({
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (err: any) {
    logger.error('Login error:', err);
    res.status(500).json({
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: ExtendedRequest, res: Response) => {
  try {
    // User is already loaded via authenticate middleware
    const user = await db('users')
      .where({ id: req.user?.id })
      .select('id', 'email', 'first_name', 'last_name', 'role', 'created_at')
      .first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      createdAt: user.created_at,
    });
  } catch (err: any) {
    logger.error('Get user profile error:', err);
    res.status(500).json({
      message: 'Server error while retrieving user profile',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await db('users').where({ email }).first();
    if (!user) {
      // Don't reveal that the user doesn't exist for security
      return res.status(200).json({ 
        message: 'If a user with that email exists, a password reset link has been sent' 
      });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token in database
    await db('password_resets').insert({
      user_id: user.id,
      token: resetToken,
      expires_at: resetTokenExpiry,
      created_at: new Date(),
    });

    // In a real application, send email with reset link
    // For this example, just return the token in the response
    res.status(200).json({
      message: 'If a user with that email exists, a password reset link has been sent',
      // Only include token in development for testing
      token: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (err: any) {
    logger.error('Forgot password error:', err);
    res.status(500).json({
      message: 'Server error during password reset request',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find valid reset token
    const resetRequest = await db('password_resets')
      .where({ token })
      .where('expires_at', '>', new Date())
      .first();

    if (!resetRequest) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password
    await db('users')
      .where({ id: resetRequest.user_id })
      .update({
        password: hashedPassword,
        updated_at: new Date(),
      });

    // Delete used reset token
    await db('password_resets').where({ token }).delete();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err: any) {
    logger.error('Reset password error:', err);
    res.status(500).json({
      message: 'Server error during password reset',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};