<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="[$style.root, { [$style.collapsed]: collapsed }]">
	<div>
		<span v-if="note.isHidden" style="opacity: 0.5">({{ i18n.ts.private }})</span>
		<span v-if="note.deletedAt" style="opacity: 0.5">({{ i18n.ts.deletedNote }})</span>
		<EmA v-if="note.replyId" :class="$style.reply" :to="`/notes/${note.replyId}`"><i class="ti ti-arrow-back-up"></i></EmA>
		<EmMfm v-if="note.text" :text="note.text" :author="note.user" :nyaize="'respect'" :emojiUrls="note.emojis"/>
		<EmA v-if="note.renoteId" :class="$style.rp" :to="`/notes/${note.renoteId}`">RN: ...</EmA>
		<div>
			<div v-if="note.files && note.files.length > 0">
				<EmMediaList :mediaList="note.files" :originalEntityUrl="`${url}/notes/${note.id}`"/>
			</div>
			<div v-if="note.poll">
				<EmPoll :noteId="note.id" :poll="note.poll"/>
			</div>
		</div>
	</div>
	<button v-if="(isLong || isMFM || (note.files && note.files.length) > 0 || note.poll) && collapsed" :class="$style.fade" class="_button" @click="collapsed = false">
		<span :class="$style.fadeLabel">
			{{ i18n.ts.showMore }}
			<span v-if="note.files && note.files.length > 0" :class="$style.label">({{ collapseLabel }})</span>
		</span>
	</button>
	<button v-else-if="(isLong || isMFM || (note.files && note.files.length) > 0 || note.poll) && !collapsed" :class="$style.showLess" class="_button" @click="collapsed = true">
		<span :class="$style.showLessLabel">{{ i18n.ts.showLess }}</span>
	</button>
	<EmReactionsViewer v-if="note.reactionAcceptance !== 'likeOnly'" ref="reactionsViewer" :maxNumber="16" :note="note">
		<template #more>
			<EmA :to="`/notes/${note.id}`" :class="[$style.reactionOmitted]">{{ i18n.ts.more }}</EmA>
		</template>
	</EmReactionsViewer>
	<footer>
		<a :href="`/notes/${note.id}`" target="_blank" rel="noopener" :class="[$style.noteFooterButton, $style.footerButtonLink]" class="_button">
			<i class="ti ti-arrow-back-up"></i>
			<p v-if="note.repliesCount > 0" :class="$style.noteFooterButtonCount">{{ number(note.repliesCount) }}</p>
		</a>
		<a :href="`/notes/${note.id}`" target="_blank" rel="noopener" :class="[$style.noteFooterButton, $style.footerButtonLink]" class="_button">
			<i class="ti ti-repeat"></i>
			<p v-if="note.renoteCount > 0" :class="$style.noteFooterButtonCount">{{ (note.renoteCount) }}</p>
		</a>
		<a :href="`/notes/${note.id}`" target="_blank" rel="noopener" :class="[$style.noteFooterButton, $style.footerButtonLink]" class="_button">
			<i v-if="note.reactionAcceptance === 'likeOnly'" class="ti ti-heart"></i>
			<i v-else class="ti ti-plus"></i>
			<p v-if="(note.reactionAcceptance === 'likeOnly') && note.reactionCount > 0" :class="$style.noteFooterButtonCount">{{ (note.reactionCount) }}</p>
		</a>
		<a :href="`/notes/${note.id}`" target="_blank" rel="noopener" :class="[$style.noteFooterButton, $style.footerButtonLink]" class="_button">
			<i class="ti ti-quote"></i>
		</a>
		<a :href="`/notes/${note.id}`" target="_blank" rel="noopener" :class="[$style.noteFooterButton, $style.footerButtonLink]" class="_button">
			<i class="ti ti-dots"></i>
		</a>
	</footer>
</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import * as Misskey from 'cherrypick-js';
import { concat } from '@@/js/array.js';
import { url } from '@@/js/config.js';
import { shouldCollapsed, shouldMfmCollapsed } from '@@/js/collapsed.js';
import EmMediaList from '@/components/EmMediaList.vue';
import EmPoll from '@/components/EmPoll.vue';
import { i18n } from '@/i18n.js';
import EmA from '@/components/EmA.vue';
import EmMfm from '@/components/EmMfm.js';
import EmReactionsViewer from '@/components/EmReactionsViewer.vue';

const props = defineProps<{
	note: Misskey.entities.Note;
}>();

const note = ref(props.note);

const isRenote = (
	note.value.renote != null &&
	note.value.reply == null &&
	note.value.text == null &&
	note.value.cw == null &&
	note.value.fileIds && note.value.fileIds.length === 0 &&
	note.value.poll == null
);

const isLong = shouldCollapsed(props.note, []);
const isMFM = shouldMfmCollapsed(props.note);
const appearNote = computed(() => isRenote ? note.value.renote as Misskey.entities.Note : note.value);

const collapsed = ref(isLong || isMFM);

const collapseLabel = computed(() => {
	return concat([
		props.note.files && props.note.files.length !== 0 ? [i18n.tsx._cw.files({ count: props.note.files.length })] : [],
	] as string[][]).join(' / ');
});
</script>

<style lang="scss" module>
.root {
	overflow-wrap: break-word;

	&.collapsed {
		position: relative;
		min-height: 4.5em;
		max-height: 9em;
		overflow: clip;

		> .fade {
			display: block;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 64px;
			background: linear-gradient(0deg, var(--MI_THEME-panel), color(from var(--MI_THEME-panel) srgb r g b / 0));
			z-index: 2;

			> .fadeLabel {
				display: inline-block;
				background: var(--MI_THEME-panel);
				padding: 6px 10px;
				font-size: 0.8em;
				border-radius: 999px;
				box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
			}

			&:hover {
				> .fadeLabel {
					background: var(--MI_THEME-panelHighlight);
				}
			}
		}
	}

	.footer {
		position: relative;
		z-index: 1;
	}

	&:hover > .article > .main > .footer > .footerButton {
		opacity: 1;
	}
}

.reply {
	margin-right: 6px;
	color: var(--MI_THEME-accent);
}

.rp {
	margin-left: 4px;
	font-style: oblique;
	color: var(--MI_THEME-renote);
}

.footer {
	margin: 7px 0 -14px;
}

.noteFooterButton {
	margin: 0;
	padding: 8px;
	opacity: 0.7;

	&:not(:last-child) {
		margin-right: 10px;
	}

	&:hover {
		color: var(--MI_THEME-fgHighlighted);
	}
}

.noteFooterButtonCount {
	display: inline;
	margin: 0 0 0 8px;
	opacity: 0.7;
}

@container (max-width: 500px) {
	.footer {
		margin-bottom: -8px;
	}
}

.showLess {
	width: 100%;
	margin-top: 14px;
	position: sticky;
	bottom: calc(var(--MI-stickyBottom, 0px) + 14px);
}

.showLessLabel {
	display: inline-block;
	background: var(--MI_THEME-popup);
	padding: 6px 10px;
	font-size: 0.8em;
	border-radius: 999px;
	box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
}

.reactionOmitted {
	display: inline-block;
	margin-left: 8px;
	opacity: .8;
	font-size: 95%;
}
</style>
