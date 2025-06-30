<template>
  <div class="bg-white rounded-3xl p-8 shadow-2xl mb-5 animate-fade-in">
    <!-- Progress Bar -->
    <div class="bg-gray-200 rounded-full h-5 mb-8 relative overflow-hidden">
      <div class="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300" :style="{ width: `${progress}%` }"></div>
      <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-800">
        Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
      </span>
    </div>
    
    <div v-if="question" class="text-center mb-8">
      <h2 class="text-4xl mb-5 text-gray-800">{{ question.question }}</h2>
      <div class="bg-blue-100 p-4 rounded-2xl mb-8 inline-block">
        <span class="text-xl font-bold text-blue-700">{{ question.bodyPart.charAt(0).toUpperCase() + question.bodyPart.slice(1) }}</span>
      </div>
      
      <div v-if="!showSelection" class="grid grid-cols-2 gap-4 mb-5">
        <button 
          v-for="option in question.options" 
          :key="option"
          class="p-5 text-2xl font-bold border-3 border-gray-300 rounded-2xl bg-white cursor-pointer transition-all duration-300 hover:border-green-500 hover:bg-green-50 hover:-translate-y-0.5 hover:shadow-lg"
          :class="{ 
            'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-500 scale-105': selectedAnswer === option 
          }"
          @click="handleAnswer(option)"
        >
          {{ option }}
        </button>
      </div>
      
      <div v-if="selectedAnswer && !showSelection" class="mt-3 text-center p-5 bg-gray-50 rounded-xl border-2 border-green-500">
        <p class="text-lg text-gray-800 mb-3">You selected: <strong>{{ selectedAnswer }}</strong></p>
        <p class="text-sm text-gray-600 mb-4 italic">You can change your answer before continuing</p>
        <button 
          class="bg-gradient-to-br from-green-500 to-green-600 text-white border-none px-6 py-3 rounded-lg text-base cursor-pointer transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30" 
          @click="showSelectionChoices"
        >
          Continue to Selection
        </button>
      </div>
      
      <!-- Selection section -->
      <div v-if="showSelection && bodyPartType" class="mt-8">
        <p class="text-lg text-gray-800 mb-3">You selected: <strong>{{ selectedAnswer }}</strong></p>
        <p class="text-center text-gray-600 mb-5 text-lg">You unlocked <strong>{{ bodyPartType }}</strong> {{ question.bodyPart }}!</p>
        
        <div class="grid grid-cols-3 gap-5 mt-8">
          <div 
            v-for="variation in availableVariations" 
            :key="variation"
            class="text-center p-5 border-3 border-gray-300 rounded-2xl cursor-pointer transition-all duration-300 hover:border-green-500 hover:bg-green-50 hover:-translate-y-1 hover:shadow-xl"
            :class="{ 
              'border-green-500 bg-green-500 text-white': selectedVariation === variation 
            }"
            @click="selectVariation(variation)"
          >
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 relative flex items-center justify-center">
              <BodyPart 
                :body-part="question.bodyPart"
                :type="bodyPartType"
                :variation="variation"
                class="relative !left-auto !top-auto !transform-none !w-10 !h-10"
              />
            </div>
            <span>{{ variation.charAt(0).toUpperCase() + variation.slice(1) }} {{ bodyPartType }} {{ question.bodyPart.charAt(0).toUpperCase() + question.bodyPart.slice(1) }}</span>
          </div>
        </div>
        
        <div v-if="selectedVariation" class="mt-8 text-center p-5 bg-gray-50 rounded-xl border-2 border-green-500">
          <p class="text-lg text-gray-800 mb-4">You selected: <strong>{{ selectedVariation }}</strong></p>
          <button 
            class="bg-gradient-to-br from-green-500 to-green-600 text-white border-none px-6 py-3 rounded-lg text-base cursor-pointer transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30" 
            @click="continueToNext"
          >
            Continue to Next Question
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { QuestionGeneratorService } from '../services/QuestionGenerator'
import type { Question, BodyPartType, BodyPartStyle } from '../types'
import BodyPart from './BodyPart.vue'

interface Props {
  question: Question | null
  progress: number
  currentQuestionIndex: number
  totalQuestions: number
}

interface Emits {
  (e: 'answer', answer: string): void
  (e: 'select', bodyPart: BodyPartType, variation: string): void
  (e: 'continue'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const gameStore = useGameStore()

const selectedAnswer = ref<string | null>(null)
const showSelection = ref(false)
const selectedVariation = ref<string | null>(null)

// Reset state when question changes
watch(() => props.question, () => {
  selectedAnswer.value = null
  showSelection.value = false
  selectedVariation.value = null
})

const bodyPartType = computed(() => {
  if (!props.question || !selectedAnswer.value) return null
  return props.question.answerToBodyPartType[selectedAnswer.value]
})

const availableVariations = computed(() => {
  if (!bodyPartType.value || !props.question) return []
  const questionGenerator = QuestionGeneratorService.getInstance()
  return questionGenerator.getBodyPartVariations(props.question.bodyPart, bodyPartType.value)
})

const handleAnswer = (answer: string) => {
  if (!props.question) return
  
  selectedAnswer.value = answer
  emit('answer', answer)
}

const showSelectionChoices = () => {
  showSelection.value = true
}

const selectVariation = (variation: string) => {
  selectedVariation.value = variation
  if (props.question) {
    emit('select', props.question.bodyPart, variation)
  }
}

const continueToNext = () => {
  emit('continue')
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