/*
 * SPDX-FileCopyrightText: Lilia <lirisia@outlook.ie>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class AddBlockDeliver1745066409734 {
	name = "AddBlockDeliver1745066409734";

	async up(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "user_profile" ADD "blockdeliver" boolean NOT NULL DEFAULT true`
		);
	}

	async down(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "user_profile" DROP COLUMN "blockdeliver"`
		);
	}
}
