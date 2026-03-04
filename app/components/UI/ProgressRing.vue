<template>
  <div class="relative inline-flex items-center justify-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <!-- Outer border ring -->
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="absolute top-0 left-0 -rotate-90"
      style="transform: rotate(-90deg);"
    >
      <!-- Track -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        stroke="#0D0D0D"
        :stroke-width="trackWidth"
        opacity="0.12"
      />
      <!-- Progress arc -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        style="transition: stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease;"
      />
    </svg>
    <!-- Slot for inner content -->
    <div class="relative z-10 flex flex-col items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  progress: number   // 0 to 1
  color?: string
  size?: number
  strokeWidth?: number
  trackWidth?: number
}>(), {
  progress: 0,
  color: '#FF3A5C',
  size: 320,
  strokeWidth: 14,
  trackWidth: 14,
})

const radius = computed(() => (props.size / 2) - (props.strokeWidth / 2) - 4)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - Math.min(1, Math.max(0, props.progress))))
</script>
