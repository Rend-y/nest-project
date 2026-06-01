import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthSessionsTable1780162800000 implements MigrationInterface {
  name = 'CreateAuthSessionsTable1780162800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_users_username" ON "users" ("username")
      WHERE "deleted_at" IS NULL
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_users_email" ON "users" ("email")
      WHERE "deleted_at" IS NULL
    `);
    await queryRunner.query(`
      CREATE TABLE "auth_sessions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "refresh_token_hash" character varying(255) NOT NULL,
        "user_agent" character varying(512),
        "ip" character varying(64),
        "expires_at" TIMESTAMP NOT NULL,
        "revoked_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_auth_sessions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_auth_sessions_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_auth_sessions_user_id" ON "auth_sessions" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_auth_sessions_user_id"`);
    await queryRunner.query(`DROP TABLE "auth_sessions"`);
    await queryRunner.query(`DROP INDEX "UQ_users_email"`);
    await queryRunner.query(`DROP INDEX "UQ_users_username"`);
  }
}
