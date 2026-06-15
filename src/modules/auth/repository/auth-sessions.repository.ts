import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuthSessionEntity } from '../entities/auth-session.entity';

@Injectable()
export class AuthSessionsRepository extends Repository<AuthSessionEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AuthSessionEntity, dataSource.createEntityManager());
  }
}
