<template>
  <div class="bg-white rounded-3xl p-8 shadow-2xl mb-5 animate-fade-in">
    <h2 class="text-3xl font-bold text-center mb-8">Quiz Complete!</h2>
    
    <!-- Perfect Score Message -->
    <div v-if="score === totalQuestions" class="text-center my-8">
      <div class="mb-8 p-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-2xl shadow-green-500/30">
        <h3 class="text-4xl md:text-5xl mb-4 drop-shadow-lg">🎉 Congratulations! 🎉</h3>
        <p class="text-2xl md:text-3xl mb-3 font-bold">You got all the questions right!</p>
        <p class="text-lg opacity-90">Your creature is perfect as it is!</p>
      </div>
      
      <div class="text-center p-5 bg-white rounded-xl shadow-lg">
        <h3 class="mb-4 text-gray-800 text-2xl font-bold">Your Perfect Creature</h3>
        <div class="flex justify-center mb-4 min-h-[200px] items-center">
          <CreatureRenderer 
            :unlocked-body-part-types="unlockedBodyPartTypes" 
            :selected-variations="selectedVariations" 
          />
        </div>
        <p class="text-gray-600 text-sm italic m-0">Your amazing creation!</p>
      </div>
    </div>
    
    <!-- Imperfect Score - Show Comparison -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-10 my-8 p-5 bg-gray-50 rounded-2xl">
      <div class="text-center p-5 bg-white rounded-xl shadow-lg">
        <h3 class="mb-4 text-gray-800 text-2xl font-bold">Your Creature</h3>
        <div class="flex justify-center mb-4 min-h-[200px] items-center">
          <CreatureRenderer 
            :unlocked-body-part-types="unlockedBodyPartTypes" 
            :selected-variations="selectedVariations" 
          />
        </div>
        <p class="text-gray-600 text-sm italic m-0">Your unique creation!</p>
      </div>
      
      <div class="text-center p-5 bg-white rounded-xl shadow-lg">
        <h3 class="mb-4 text-gray-800 text-2xl font-bold">Perfect Creature</h3>
        <div class="flex justify-center mb-4 min-h-[200px] items-center">
          <CreatureRenderer 
            :unlocked-body-part-types="correctBodyPartTypes" 
            :selected-variations="correctVariations"
            :incorrect-parts="incorrectBodyParts"
          />
        </div>
        <p class="text-gray-600 text-sm italic m-0">What it could look like with all correct answers!</p>
      </div>
    </div>
    
    <div class="flex flex-col gap-4 mt-8">
      <button 
        v-if="incorrectQuestions.length > 0"
        class="px-6 py-3 border-none rounded-lg text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 hover:shadow-lg" 
        @click="$emit('retry')"
      >
        Practice More Questions
      </button>
      <button 
        v-if="score === totalQuestions"
        class="px-6 py-3 border-none rounded-lg text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-lg" 
        @click="$emit('customize')"
      >
        Customize Creature
      </button>
      <button 
        class="px-6 py-3 border-none rounded-lg text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 hover:shadow-lg" 
        @click="$emit('restart')"
      >
        Start New Quiz
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CreatureRenderer from './CreatureRenderer.vue'
import type { Question, BodyPartType, BodyPartStyle } from '../types'

interface Props {
  score: number
  totalQuestions: number
  incorrectQuestions: Question[]
  unlockedBodyPartTypes: Record<BodyPartType, BodyPartStyle>
  selectedVariations: Record<BodyPartType, string>
  canCustomize: boolean
  questions: Question[]
  quizResults: Array<{
    questionId: string
    selectedAnswer: string
    isCorrect: boolean
    timeSpent: number
  }>
}

interface Emits {
  (e: 'retry'): void
  (e: 'customize'): void
  (e: 'restart'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

// Generate the "perfect" creature based on player's actual performance
const correctBodyPartTypes = computed(() => {
  const correctTypes: Record<BodyPartType, BodyPartStyle> = {} as Record<BodyPartType, BodyPartStyle>
  
  props.questions.forEach(question => {
    // Find the quiz result for this question
    const result = props.quizResults.find(r => r.questionId === question.id)
    
    if (result) {
      if (result.isCorrect) {
        // Player got it right, use their actual choice
        const bodyPartType = question.answerToBodyPartType[result.selectedAnswer]
        correctTypes[question.bodyPart] = bodyPartType
      } else {
        // Player got it wrong, use the correct answer
        const correctAnswer = question.correctAnswer
        const bodyPartType = question.answerToBodyPartType[correctAnswer]
        correctTypes[question.bodyPart] = bodyPartType
      }
    }
  })
  
  return correctTypes
})

// Generate variations for the correct creature
const correctVariations = computed(() => {
  const variations: Record<BodyPartType, string> = {} as Record<BodyPartType, string>
  
  props.questions.forEach(question => {
    const result = props.quizResults.find(r => r.questionId === question.id)
    
    if (result) {
      if (result.isCorrect) {
        // Player got it right, use their actual variation if they selected one
        const playerVariation = props.selectedVariations[question.bodyPart]
        if (playerVariation) {
          variations[question.bodyPart] = playerVariation
        } else {
          // Fallback to first variation
          const bodyPartType = question.answerToBodyPartType[result.selectedAnswer]
          variations[question.bodyPart] = `${bodyPartType}-1`
        }
      } else {
        // Player got it wrong, use first variation of correct type
        const correctAnswer = question.correctAnswer
        const bodyPartType = question.answerToBodyPartType[correctAnswer]
        variations[question.bodyPart] = `${bodyPartType}-1`
      }
    }
  })
  
  return variations
})

// Identify which body parts were incorrect (for red highlighting)
const incorrectBodyParts = computed(() => {
  const incorrect: BodyPartType[] = []
  
  props.questions.forEach(question => {
    const result = props.quizResults.find(r => r.questionId === question.id)
    
    if (result && !result.isCorrect) {
      incorrect.push(question.bodyPart)
    }
  })
  
  return incorrect
})
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