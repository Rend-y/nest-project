import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Index('UQ_users_username', ['username'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
@Index('UQ_users_email', ['email'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'integer' })
  age: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
