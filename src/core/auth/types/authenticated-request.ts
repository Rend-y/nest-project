import type { Request } from 'express';
import type { AccessTokenPayload } from '../services/token.service';

export type AuthenticatedRequest = Request & {
  user: AccessTokenPayload;
};
