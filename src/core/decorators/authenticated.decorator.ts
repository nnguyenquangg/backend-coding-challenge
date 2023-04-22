import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '~auth/controllers/guards/jwt-auth.guard';

export function Authenticated(): ClassDecorator {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
