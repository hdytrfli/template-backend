import type { TokenPayload } from '@/services/auth.repository';

declare global {
  namespace Express {
    interface Request {
      user: TokenPayload;
    }
  }
}
