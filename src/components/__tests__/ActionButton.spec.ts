import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import ActionButton from '../Layout/Buttons/ActionButton.vue';

describe('ActionButton', () => {
  it('renders properly with action variant', () => {
    const wrapper = mount(ActionButton, {
      props: { variant: 'action' },
      slots: { default: 'Click Me' },
    });
    expect(wrapper.classes()).toContain('bg-yellow-700');
    expect(wrapper.text()).toBe('Click Me');
  });

  it('renders properly with neutral variant', () => {
    const wrapper = mount(ActionButton, {
      props: { variant: 'neutral' },
      slots: { default: "Don't Click Me" },
    });
    expect(wrapper.classes()).toContain('bg-neutral-900');
    expect(wrapper.text()).toBe("Don't Click Me");
  });

  it('renders properly with plain variant', () => {
    const wrapper = mount(ActionButton, {
      props: { variant: 'plain' },
      slots: { default: 'Click Me' },
    });
    expect(wrapper.classes()).not.toContain('bg-neutral-900');
    expect(wrapper.classes()).not.toContain('bg-yellow-700');
    expect(wrapper.text()).toBe('Click Me');
  });
});
