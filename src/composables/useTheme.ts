import { CARD_BACKS } from '@/constants/cardStyles';
import { TABLE_THEMES } from '@/constants/tableThemes';
import { ref } from 'vue';

const cardBack = ref<string>(CARD_BACKS['red']);
const tableTheme = ref<string>(TABLE_THEMES['classic']);

export default {
  cardBack,
  tableTheme,
};
