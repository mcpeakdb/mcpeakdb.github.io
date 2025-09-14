<template>
  <div 
    ref="draggableElement"
    class="absolute cursor-grab select-none transition-transform duration-100 ease-in-out"
    :class="[
      partType === 'eyes' ? 'w-20 h-10' : 
      partType === 'ears' ? 'w-10 h-15 rounded-t-full' : 
      partType === 'nose' ? 'w-8 h-8 rounded-full' : 
      'w-15 h-15 rounded-full',
      isDragging ? 'cursor-grabbing z-[1000]' : 'z-[1]'
    ]"
    :style="elementStyle"
    @mousedown="startDrag"
    @mousemove="drag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { BodyPartType, BodyPartStyle } from '../types'

interface Props {
  partType: BodyPartType
  bodyPartType: BodyPartStyle
  variation: string
  color: string
}

interface Emits {
  (e: 'color-change', partType: BodyPartType, color: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const draggableElement = ref<HTMLElement>()
const isDragging = ref(false)
const currentX = ref(0)
const currentY = ref(0)
const initialX = ref(0)
const initialY = ref(0)
const xOffset = ref(0)
const yOffset = ref(0)

const elementStyle = computed(() => ({
  position: 'absolute' as const,
  filter: 'brightness(0) saturate(100%)',
  backgroundColor: props.color,
  transform: `translate3d(${currentX.value}px, ${currentY.value}px, 0)`,
}))

const startDrag = (e: MouseEvent) => {
  if (!draggableElement.value) return
  
  initialX.value = e.clientX - xOffset.value
  initialY.value = e.clientY - yOffset.value
  
  if (e.target === draggableElement.value) {
    isDragging.value = true
  }
}

const drag = (e: MouseEvent) => {
  if (isDragging.value) {
    e.preventDefault()
    currentX.value = e.clientX - initialX.value
    currentY.value = e.clientY - initialY.value
    
    xOffset.value = currentX.value
    yOffset.value = currentY.value
  }
}

const endDrag = () => {
  if (draggableElement.value) {
    initialX.value = currentX.value
    initialY.value = currentY.value
    isDragging.value = false
  }
}

onMounted(() => {
  // Set random initial position
  if (draggableElement.value) {
    const workspace = draggableElement.value.parentElement
    if (workspace) {
      const maxX = workspace.offsetWidth - 100
      const maxY = workspace.offsetHeight - 100
      currentX.value = Math.random() * maxX
      currentY.value = Math.random() * maxY
      xOffset.value = currentX.value
      yOffset.value = currentY.value
    }
  }
})
</script>