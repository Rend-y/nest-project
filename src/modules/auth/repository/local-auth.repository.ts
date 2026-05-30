import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LocalAuthEntity } from '../entities/local-auth.entity';

@Injectable()
export class LocalAuthRepository extends Repository<LocalAuthEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(LocalAuthEntity, dataSource.createEntityManager());
  }
}
