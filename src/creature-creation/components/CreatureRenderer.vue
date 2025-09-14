<template>
  <div class="w-64 h-64 mx-auto relative bg-green-100 rounded-full border-3 border-green-500">
    <!-- Creature body -->
    <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-45 h-45 bg-green-500 rounded-full"></div>
    
    <!-- Body parts -->
    <BodyPart 
      v-for="(type, partType) in unlockedBodyPartTypes" 
      :key="partType"
      :body-part="partType"
      :type="type"
      :variation="selectedVariations[partType] || type + '-1'"
      :color="getBodyPartColor(partType)"
    />
  </div>
</template>

<script setup lang="ts">
import type { BodyPartType, BodyPartStyle } from '../types'
import BodyPart from './BodyPart.vue'

interface Props {
  unlockedBodyPartTypes: Record<BodyPartType, BodyPartStyle>
  selectedVariations: Record<BodyPartType, string>
  incorrectParts?: BodyPartType[]
}

const props = defineProps<Props>()

const getBodyPartColor = (partType: BodyPartType): string => {
  return props.incorrectParts && props.incorrectParts.includes(partType) ? '#ff0000' : ''
}
</script>

<style scoped>
/* No additional styles needed - all styling handled by Tailwind classes */
</style> 