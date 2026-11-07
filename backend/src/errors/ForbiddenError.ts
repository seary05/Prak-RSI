import { AppError } from './AppError.ts';

export class ForbiddenError extends AppError {
  constructor(message = 'Kamu tidak memiliki akses ke endpoint ini') {
    super(403, message);
  }
}