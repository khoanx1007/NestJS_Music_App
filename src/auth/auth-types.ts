export interface JwtPayload {
  email: string;
  sub: number;
  artistId?: number;
}
export interface Enable2FAType {
  secret: string;
}
