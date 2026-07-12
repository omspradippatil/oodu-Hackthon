import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { error } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error occurred:', err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.reduce((acc: Record<string, string>, curr) => {
      const path = curr.path.join('.');
      acc[path] = curr.message;
      return acc;
    }, {});
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  // Prisma unique key violation
  if (err.code === 'P2002') {
    return error(res, `Database conflict: Record with unique constraint already exists.`, 409);
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return error(res, 'Requested resource not found.', 404);
  }

  // Custom client errors
  if (err.statusCode) {
    return error(res, err.message, err.statusCode);
  }

  return error(res, err.message || 'Internal Server Error', 500);
};
