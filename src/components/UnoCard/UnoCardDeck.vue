<script setup lang="ts">
import UnoCardComponent from './UnoCard.vue';

interface Props {
  cardBack?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showCount?: boolean;
  disabled?: boolean;
  cardsRemaining?: number;
}

const props = withDefaults(defineProps<Props>(), {
  cardBack: 'classic',
  size: 'md',
  showCount: true,
  disabled: false,
  cardsRemaining: 0,
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  if (!props.disabled) {
    emit('click');
  }
};
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Deck Stack Effect -->
    <div
      class="relative"
      :class="[
        {
          'cursor-pointer hover:scale-105 transition-transform': !disabled,
          'cursor-not-allowed opacity-50': disabled,
        },
      ]"
    >
      <!-- Bottom cards for stack effect -->
      <div v-if="cardsRemaining > 1" class="absolute -top-0.5 -left-0.5 opacity-60">
        <UnoCardComponent
          :card-back="cardBack"
          :size="size"
          :is-visible="false"
          :show-deck-text="false"
        />
      </div>
      <div v-if="cardsRemaining > 2" class="absolute -top-1 -left-1 opacity-30">
        <UnoCardComponent
          :card-back="cardBack"
          :size="size"
          :is-visible="false"
          :show-deck-text="false"
        />
      </div>

      <!-- Top card -->
      <UnoCardComponent
        :card-back="cardBack"
        :size="size"
        :is-visible="false"
        :is-interactive="!disabled"
        :show-deck-text="true"
        @click="handleClick"
      />
    </div>

    <div v-if="showCount" class="text-sm mt-2 font-medium text-center">
      <div>Draw Pile</div>
      <div v-if="cardsRemaining > 0" class="text-xs opacity-75">{{ cardsRemaining }} cards</div>
    </div>
  </div>
</template>
