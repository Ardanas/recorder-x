<script setup lang="ts">
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Trash2, CirclePlus } from 'lucide-vue-next';

const isRecording = defineModel();
const recordList = ref([
  {
    id: 1,
    title: 'hello',
    url: '',
    time: Date.now(),
  },
  {
    id: 2,
    title: 'hello',
    url: '',
    time: Date.now(),
  },
  {
    id: 3,
    title: 'hello',
    url: '',
    time: Date.now(),
  },
  {
    id: 4,
    title: 'hello',
    url: '',
    time: Date.now(),
  },
  {
    id: 5,
    title: 'hello',
    url: '',
    time: Date.now(),
  },
]);
</script>

<template>
  <div class="w-full h-full overflow-hidden flex flex-col gap-4">
    <main class="flex-1 p-2 overflow-auto">
      <div v-for="(item, index) in recordList" :key="item.id">
        <Card class="shadow-none">
          <CardHeader>
            <CardTitle class="flex justify-between items-center">
              <div>
                <span>{{ index + 1 }}</span>
                <span> {{ item.title }}</span>
              </div>
              <Trash2 class="size-4 cursor-pointer text-gray-300 hover:text-red-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img src="@/assets/vue.svg" alt="" srcset="" />
          </CardContent>
          <CardFooter class="text-2 text-gray-500 text-right">
            {{ item.time }}
          </CardFooter>
        </Card>
        <div class="flex justify-center p-2 text-sm text-gray-300 hover:text-black cursor-pointer">
          <CirclePlus />
        </div>
      </div>
    </main>
    <footer class="flex-shrink-0 border-t-1 p-2">
      <Button variant="outline" class="cursor-pointer">暂停录制</Button>
      <div class="mt-2">
        <Button class="w-full cursor-pointer" @click="isRecording = false">完成录制</Button>
      </div>
    </footer>
  </div>
</template>
