<template>
  <div class="font-sans bg-gradient-to-br from-indigo-500 to-purple-600 min-h-screen text-gray-800">
    <div class="max-w-7xl mx-auto p-5">
      <header class="text-center mb-8 text-white">
        <h1 class="text-4xl md:text-5xl mb-3 font-bold drop-shadow-lg">🧩 Creature Creation Challenge</h1>
        <p class="text-lg opacity-90">Answer math questions to create your creature!</p>
      </header>

      <div 
        class="grid gap-8 mt-8" 
        :class="currentPhase === 'customization' || currentPhase === 'results' 
          ? 'grid-cols-1 max-w-4xl mx-auto' 
          : 'grid-cols-1 lg:grid-cols-[1fr_300px]'"
      >
        <!-- Left Side - Quiz Content -->
        <div class="min-h-[500px]">
          <!-- Loading State -->
          <div 
            v-if="!currentQuestionData && currentPhase === 'quiz'" 
            class="bg-white rounded-3xl p-8 shadow-2xl mb-5 animate-fade-in"
          >
            <h2 class="text-2xl font-bold mb-4">Loading questions...</h2>
            <p class="text-gray-600 mb-6">Please wait while we prepare your quiz.</p>
            <button 
              class="px-8 py-4 text-lg font-bold border-none rounded-full cursor-pointer transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/40" 
              @click="startNewGame"
            >
              Retry Loading
            </button>
          </div>

          <!-- Quiz Section -->
          <QuizSection 
            v-else-if="currentPhase === 'quiz' && currentQuestionData"
            :question="currentQuestionData"
            :progress="progress"
            :current-question-index="currentQuestionIndex"
            :total-questions="totalQuestions"
            @answer="handleAnswer"
            @select="handleBodyPartSelection"
            @continue="continueToNextQuestion"
          />

          <!-- Results Section -->
          <ResultsSection 
            v-if="currentPhase === 'results'"
            :score="score"
            :total-questions="totalQuestions"
            :incorrect-questions="incorrectQuestions"
            :unlocked-body-part-types="unlockedBodyPartTypes"
            :selected-variations="selectedVariations"
            :can-customize="canCustomize"
            :questions="questions"
            :quiz-results="quizResults"
            @retry="startRetryMode"
            @customize="startCustomization"
            @restart="resetGame"
          />

          <!-- Customization Section -->
          <CustomizationSection 
            v-if="currentPhase === 'customization'"
            :unlocked-body-part-types="unlockedBodyPartTypes"
            :selected-variations="selectedVariations"
            @restart="resetGame"
          />
        </div>

        <!-- Right Side - Creature Display -->
        <div 
          v-if="currentPhase !== 'customization' && currentPhase !== 'results'" 
          class="bg-white rounded-3xl p-5 shadow-2xl h-fit lg:sticky lg:top-5 order-first lg:order-last"
        >
          <h3 class="text-center mb-5 text-gray-800 font-bold">Your Creature</h3>
          <div class="flex justify-center mb-5">
            <CreatureRenderer :unlocked-body-part-types="completedBodyParts" :selected-variations="selectedVariations" />
          </div>
          <div class="text-center">
            <p v-if="Object.keys(completedBodyParts).length === 0" class="text-gray-600">
              Answer questions to build your creature!
            </p>
            <div v-else class="text-left">
              <h4 class="mb-3 text-green-600 font-bold">Body Parts:</h4>
              <ul class="list-none p-0">
                <li 
                  v-for="(type, partType) in completedBodyParts" 
                  :key="partType"
                  class="py-1 border-b border-gray-200 text-sm"
                >
                  {{ partType.charAt(0).toUpperCase() + partType.slice(1) }}: {{ type.charAt(0).toUpperCase() + type.slice(1) }}
                  <span v-if="selectedVariations[partType]" class="text-gray-500 italic text-xs">
                    ({{ selectedVariations[partType] }})
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useGameStore } from '@/creature-creation/stores/gameStore'
import QuizSection from '@/creature-creation/components/QuizSection.vue'
import ResultsSection from '@/creature-creation/components/ResultsSection.vue'
import CustomizationSection from '@/creature-creation/components/CustomizationSection.vue'
import CreatureRenderer from '@/creature-creation/components/CreatureRenderer.vue'
import type { BodyPartType, BodyPartStyle } from '@/creature-creation/types'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()

// Use storeToRefs for reactive values
const {
  currentPhase,
  currentQuestionIndex,
  score,
  totalQuestions,
  currentQuestionData,
  progress,
  incorrectQuestions,
  canCustomize,
  questions,
  unlockedBodyPartTypes,
  selectedVariations,
  quizResults
} = storeToRefs(gameStore)

// Computed property for fully selected body parts
const completedBodyParts = computed(() => {
  const completed: Record<BodyPartType, BodyPartStyle> = {} as Record<BodyPartType, BodyPartStyle>
  
  for (const [bodyPart, bodyPartType] of Object.entries(unlockedBodyPartTypes.value)) {
    if (selectedVariations.value[bodyPart as BodyPartType]) {
      completed[bodyPart as BodyPartType] = bodyPartType
    }
  }
  
  return completed
})

// Direct access for methods
const {
  startNewGame,
  answerQuestion,
  selectVariation,
  nextQuestion,
  startRetryMode,
  startCustomization,
  resetGame
} = gameStore

// Handle quiz answer
const handleAnswer = (answer: string) => {
  answerQuestion(answer)
}

// Handle body part selection
const handleBodyPartSelection = (bodyPartType: BodyPartType, variation: string) => {
  selectVariation(bodyPartType, variation)
}

// Continue to next question
const continueToNextQuestion = () => {
  nextQuestion()
}

// Initialize game on mount
onMounted(() => {
  startNewGame()
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