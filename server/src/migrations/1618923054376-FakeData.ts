import { MigrationInterface, QueryRunner } from "typeorm";

export class FakeData1618923054376 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {}

  public async down(__: QueryRunner): Promise<void> {}
}
