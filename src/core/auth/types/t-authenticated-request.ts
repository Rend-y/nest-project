import type { Request } from 'express';

import { TAccessTokenPayload } from './token.service';

export type TAuthenticatedRequest = Request & {
  user: TAccessTokenPayload;
};
