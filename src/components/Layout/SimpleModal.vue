<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

const show = ref(false);

function setShow(val: boolean): void {
  show.value = val;
}

function handleEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape' && show.value) {
    show.value = false;
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});

defineExpose({ setShow });
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black opacity-50 transition-opacity z-40"
          @click="show = false"
        ></div>

        <!-- Modal -->
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            class="modal-content rounded-lg shadow-xl transform transition-all max-h-[90vh] overflow-y-auto bg-white"
            @click.stop
          >
            <!-- Close button -->
            <button
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close modal"
              @click="show = false"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <!-- Modal content -->
            <div class="p-6">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-content {
  /* Responsive width with reasonable minimum */
  width: 100%;
  min-width: 320px;
  max-width: 500px;
}

/* Responsive breakpoints */
@media (min-width: 640px) {
  .modal-content {
    width: 90%;
    max-width: 600px;
  }
}

@media (min-width: 768px) {
  .modal-content {
    width: 80%;
    max-width: 700px;
  }
}

@media (min-width: 1024px) {
  .modal-content {
    width: 70%;
    max-width: 800px;
  }
}

@media (min-width: 1280px) {
  .modal-content {
    width: 60%;
    max-width: 900px;
  }
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  opacity: 0;
  transform: scale(0.9) translateY(-100vh);
}
</style>
