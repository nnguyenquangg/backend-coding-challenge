import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '~auth/entities/user.entity';
import { AuthService } from '~auth/services/auth.service';
import { envConfig } from '~config/env.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: envConfig.JWT.SECRET_KEY,
    });
  }

  async validate(payload: { email: string; sub: string }): Promise<UserEntity> {
    const user = await this.authService.findUser(payload.email);
    if (!user) {
      throw new UnauthorizedException('Authenticated Failed');
    }

    return user;
  }
}
