<script setup>
import { useLoadConfig } from '@/hooks/useLoadConfig'
</script>
<template>
  <a-button type="text" @click="useLoadConfig">
    <template #icon>
      <icon-ic:round-cloud-download class="text-[var(--color-text-1)] text-16px" />
    </template>
  </a-button>
</template>
