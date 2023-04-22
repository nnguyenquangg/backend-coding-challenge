import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '~auth/entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
