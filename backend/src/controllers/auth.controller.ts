import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authService } from '../services/auth.service';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);

  res.status(201).json({
    success: true,
    message: 'Account created successfully. Please verify your email.',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const ipAddress = req.ip || req.socket.remoteAddress;
  const result = await authService.login(req.body, ipAddress);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const loginPhone = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginPhone(req.body.phone);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone, otp, deviceInfo } = req.body;
  const ipAddress = req.ip || req.socket.remoteAddress;
  const result = await authService.verifyOtp(phone, otp, deviceInfo, ipAddress);

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    data: result,
  });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyEmail(req.body.token);

  res.status(200).json({
    success: true,
    message: result.message,
    data: result.user,
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.refreshToken(req.body.refreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body.email);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body.token, req.body.password);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  const result = await authService.logout(req.user!.userId, token);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
