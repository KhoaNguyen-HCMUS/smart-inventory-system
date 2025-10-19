export interface UserPayload {
  id: string;
  displayName: string;
  email: string;
}

export interface JwtPayload {
  email: string;
  sub: string;
}
