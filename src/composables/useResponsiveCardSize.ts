import { ref, onMounted, onUnmounted } from 'vue';

export function useResponsiveCardSize() {
  const cardSize = ref<'sm' | 'md' | 'lg'>('md');

  const updateCardSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < 768 || height < 600) {
      cardSize.value = 'sm';
    } else if (width < 1200 || height < 800) {
      cardSize.value = 'md';
    } else {
      cardSize.value = 'lg';
    }
  };

  onMounted(() => {
    updateCardSize();
    window.addEventListener('resize', updateCardSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateCardSize);
  });

  return { cardSize };
}
