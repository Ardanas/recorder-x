<script lang="ts" setup>
import Panel from '@/components/business/Panel.vue';
import Welcome from '@/components/business/Welcome.vue';
import { ref } from 'vue'

const isRecording = ref(false)
</script>

<template>
  <div class="w-screen h-screen">
    <Welcome v-model="isRecording" v-if="!isRecording"/>
    <Panel v-model="isRecording" v-else />
  </div>
</template>

<style scoped>

</style>
