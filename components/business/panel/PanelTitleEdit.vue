<template>
  <div class="flex items-center gap-2">
    <Input
      v-if="isEditing"
      v-model="editingTitle"
      class="h-9"
      @blur="handleBlur"
      @keydown.enter="handleBlur"
      ref="inputRef"
    />
    <div
      v-else
      class="cursor-pointer hover:text-primary"
      @click="startEdit"
    >
      {{ props.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { Input } from '~/components/ui/input';

const props = defineProps<{
  title: string;
}>();

const emits = defineEmits<{
  (e: 'update', value: string): void;
}>();

const isEditing = ref(false);
const editingTitle = ref(props.title);
const inputRef = ref<HTMLInputElement>();

function startEdit() {
  isEditing.value = true;
  editingTitle.value = props.title;
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function handleBlur() {
  if (editingTitle.value.trim() === '') {
    editingTitle.value = props.title;
  }
  isEditing.value = false;
  if (editingTitle.value !== props.title) {
    emits('update', editingTitle.value);
  }
}
</script>