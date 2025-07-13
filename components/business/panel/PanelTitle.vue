<template>
    <div class="flex flex-row items-center gap-2" v-bind="$attrs">
        <PanelOrderNumber v-if="props.order">{{ props.order }}</PanelOrderNumber>
        <p class="public-sans md:text-base/6 text-sm/5">
            {{ props.title }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { PanelOrderNumber } from '~/components/business/panel';

const props = defineProps({
    order: {
        type: Number,
        default: null
    },
    title: {
        type: String,
        default: ''
    }
})
</script>