import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterPhone1721204929047 implements MigrationInterface {
    name = 'AlterPhone1721204929047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NOT NULL`);
    }

}
