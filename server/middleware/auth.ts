import { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from './catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import jwt from 'jsonwebtoken';
import { redis } from '../utils/redis';

// Check if user is authenticated
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler('Please login to access this resource', 401));
    }
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as jwt.JwtPayload;
    if(!decoded) {
        return next(new ErrorHandler('access token is not valid', 400));
    }

    const user = await redis.get(decoded.id);

    if (user) {
        req.user = JSON.parse(user);
    } else {
        return next(new ErrorHandler('User not found', 404));
    }
    next();
    
});

// Check if user is admin
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler(`Role (${req.user?.role}) is not allowed to access this resource`, 403));
        }
        next();
    };
}