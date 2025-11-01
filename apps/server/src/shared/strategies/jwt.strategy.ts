import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../modules/user/user.service';
import { appConfig } from '../../config';

export interface UserPayload {
  id: string;
  displayName: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
  }): Promise<UserPayload> {
    try {
      const user = await this.usersService.findById(payload.sub);

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      return {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
