<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="$style.root">
	<XNotification :notification="notification" :class="{ [$style.reduceBlurEffect]: !prefer.s.useBlurEffect }" class="notification _acrylic" :full="false"/>
</div>
</template>

<script lang="ts" setup>
import { } from 'vue';
import * as Misskey from 'cherrypick-js';
import XNotification from '@/components/MkNotification.vue';
import { prefer } from '@/preferences.js';

defineProps<{
	notification: Misskey.entities.Notification;
}>();
</script>

<style lang="scss" module>
.root {
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	border-radius: 8px;
	overflow: clip;
	contain: content;
}

.reduceBlurEffect {
	background: var(--MI_THEME-panel) !important;
}
</style>
