<script setup>
import HeaderBar from '@/components/header.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <HeaderBar />
    <div class="flex flex-1">
      <main class="flex-1 p-6 bg-gray-50">
        <RouterView />
      </main>
    </div>
  </div>
</template>
