import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../modules/user/user.service';
import { appConfig } from '../../config';
import { UserPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
    });
  }

  async validate(payload: any): Promise<UserPayload> {
    try {
      const user = await this.usersService.findById(payload.sub);
      return {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
