/*
 * SPDX-FileCopyrightText: noridev and cherrypick-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class AddListenBrainz1740137797464 {
	name = "AddListenBrainz1740137797464";

	async up(queryRunner) {
		await queryRunner.query(`
            ALTER TABLE "user_profile"
            ADD "listenbrainz" character varying(128) NULL
        `);
		await queryRunner.query(`
            COMMENT ON COLUMN "user_profile"."listenbrainz"
						IS 'listenbrainz username to fetch currently playing.'
        `);
	}

	async down(queryRunner) {
		await queryRunner.query(`
            ALTER TABLE "user_profile" DROP COLUMN "listenbrainz"
        `);
	}
}