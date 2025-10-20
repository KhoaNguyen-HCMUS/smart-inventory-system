import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto';
import { ResponseUtil } from '../../shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      // Find user by email
      const user = await this.usersService.findByEmail(loginDto.email);

      // Validate password
      const isPasswordValid = await this.usersService.validatePassword(
        loginDto.password,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '1y',
      });

      return ResponseUtil.success(
        {
          accessToken,
          user: {
            id: user.id,
            name: user.displayName,
            email: user.email,
          },
        },
        'Login successful',
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.log(error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      // Create user
      const user = await this.usersService.create({
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
      });

      return ResponseUtil.success(
        {
          id: user.id,
          name: user.displayName,
          email: user.email,
        },
        'Registration successful',
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Registration failed');
    }
  }
}
