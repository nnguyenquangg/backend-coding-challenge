import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { SignInDto } from '~auth/controllers/dtos/sign-in.dto';
import { UserEntity } from '~auth/entities/user.entity';
import { UserRepository } from '~auth/repositories/user.repository';
import { SignInResponse } from '~auth/types/sign-in-response.type';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, @InjectRepository(UserRepository) private userRepo: UserRepository) {}

  async signIn(dto: SignInDto): Promise<SignInResponse> {
    const { email, password } = dto;
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatchPassword = await compare(password, user.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        email,
        sub: user.id,
      }),
      user,
    };
  }

  findUser(email: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { email } });
  }
}
