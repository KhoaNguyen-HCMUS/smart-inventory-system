export const appConfig = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET ?? 'default_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1y',
};
