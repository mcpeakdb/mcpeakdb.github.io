<script lang="ts" setup>
interface Props<T> {
  modelValue: T;
  options: Record<string, T>;
}

defineProps<Props<string>>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div>
    <label
      v-for="(_back, index) in options"
      :key="index"
      :for="`card-back-${index}`"
      class="relative capitalize flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
    >
      <span class="flex items-center gap-2">
        <span class="w-6 h-6 bg-gray-200 rounded p-1">
          <div v-if="modelValue === index" class="w-full h-full bg-green-600 rounded"></div>
        </span>
        {{ index }}
      </span>

      <input
        :id="`card-back-${index}`"
        :value="index"
        type="radio"
        name="card-back"
        class="w-full h-full absolute hidden"
        @click="emit('update:modelValue', index)"
      />
    </label>
  </div>
</template>
