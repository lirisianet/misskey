/*
 * SPDX-FileCopyrightText: Miry(@catsmiry)
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class AddIpCheck1741347160640 {
	name = "AddIpCheck1741347160640";

	async up(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "meta" ADD "enableIpCheck" boolean NOT NULL DEFAULT false`,
		);
	}

	async down(queryRunner) {
		await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "enableIpCheck"`);
	}
}
