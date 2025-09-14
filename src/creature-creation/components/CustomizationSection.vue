<template>
  <div class="bg-white rounded-3xl p-8 shadow-2xl mb-5 animate-fade-in">
    <h2 class="text-3xl font-bold text-center mb-8">Customize Your Creature!</h2>
    <div class="flex gap-5 mb-8 flex-wrap justify-center">
      <div class="flex flex-col gap-3">
        <label for="color-selector" class="font-bold text-gray-800">Choose Color:</label>
        <input 
          id="color-selector" 
          v-model="selectedColor" 
          type="color"
          class="w-15 h-10 border-none rounded-lg cursor-pointer"
          @change="changeBodyPartColor"
        >
      </div>
      <div class="flex flex-col gap-3">
        <label for="part-selector" class="font-bold text-gray-800">Select Body Part:</label>
        <select 
          id="part-selector" 
          v-model="selectedPart"
          class="px-3 py-2 border-2 border-gray-300 rounded-lg text-base"
          @change="selectBodyPartForCustomization"
        >
          <option 
            v-for="(type, partType) in unlockedBodyPartTypes" 
            :key="partType"
            :value="partType"
          >
            {{ partType.charAt(0).toUpperCase() + partType.slice(1) }} ({{ type }})
          </option>
        </select>
      </div>
    </div>
    
    <div class="bg-gray-100 rounded-2xl p-8 mb-5 min-h-[300px] relative">
      <div class="w-full h-full relative">
        <DraggableBodyPart
          v-for="(type, partType) in unlockedBodyPartTypes"
          :key="partType"
          :part-type="partType"
          :body-part-type="type"
          :variation="selectedVariations[partType] || ''"
          :color="bodyPartColors[partType] || '#ff6b6b'"
          @color-change="updateBodyPartColor"
        />
      </div>
    </div>
    
    <button 
      class="px-6 py-3 border-none rounded-lg text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 hover:shadow-lg" 
      @click="$emit('restart')"
    >
      Start New Quiz
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { BodyPartType, BodyPartStyle } from '../types'
import DraggableBodyPart from './DraggableBodyPart.vue'

interface Props {
  unlockedBodyPartTypes: Record<BodyPartType, BodyPartStyle>
  selectedVariations: Record<BodyPartType, string>
}

interface Emits {
  (e: 'restart'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedColor = ref('#ff6b6b')
const selectedPart = ref<BodyPartType | ''>('')
const bodyPartColors = reactive<Record<BodyPartType, string>>({} as Record<BodyPartType, string>)

const changeBodyPartColor = () => {
  if (selectedPart.value) {
    bodyPartColors[selectedPart.value] = selectedColor.value
  }
}

const selectBodyPartForCustomization = () => {
  if (selectedPart.value && bodyPartColors[selectedPart.value]) {
    selectedColor.value = bodyPartColors[selectedPart.value]
  }
}

const updateBodyPartColor = (partType: BodyPartType, color: string) => {
  bodyPartColors[partType] = color
}
</script>

<style scoped>
@keyframes fade-in {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in;
}
</style> 