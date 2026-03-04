<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="emit('close')"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-ink/60 backdrop-blur-sm" @click="emit('close')" />
      <!-- Modal box -->
      <div class="relative z-10 bg-cream border-3 border-ink shadow-brutal-xl w-full max-w-md">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
}>()

onMounted(() => {
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
