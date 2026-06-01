export type TAccessTokenPayload = {
  sub: string;
  username: string;
  type: 'access';
};
export type TRefreshTokenPayload = {
  sub: string;
  sid: string;
  jti: string;
  type: 'refresh';
};
