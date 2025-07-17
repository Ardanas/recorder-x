<script lang="ts" setup>
import SidePanel from './SidePanel.vue';
import Welcome from '~/components/business/Welcome.vue';
</script>

<template>
  <Suspense>
    <SidePanel />
    <template #fallback>
      <Welcome />
    </template>
  </Suspense>
</template>
