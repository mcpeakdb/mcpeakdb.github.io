import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      screens: {
        short: { raw: '(max-height: 400px)' },
        tall: { raw: '(min-height: 401px)' },
        grande: { raw: '(min-height: 601px)' },
        venti: { raw: '(min-height: 801px)' },
      },
    },
  },
} satisfies Config;
