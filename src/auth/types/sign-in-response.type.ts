import { UserEntity } from '~auth/entities/user.entity';

export type SignInResponse = {
  accessToken: string;
  user: UserEntity;
};
