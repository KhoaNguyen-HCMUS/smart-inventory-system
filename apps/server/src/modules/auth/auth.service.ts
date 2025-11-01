import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Validate input
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    // Find user by email
    const user = await this.usersService.findByEmail(loginDto.email);

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Validate input
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    // Create user
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
    });

    return {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
    };
  }
}
