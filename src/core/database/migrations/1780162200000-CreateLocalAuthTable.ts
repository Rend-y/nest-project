import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocalAuthTable1780162200000 implements MigrationInterface {
  name = 'CreateLocalAuthTable1780162200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "local_auth" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_local_auth_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_local_auth_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_local_auth_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "local_auth"`);
  }
}
