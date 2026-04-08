import type { Preview } from '@storybook/angular';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals['theme'] as string | undefined;
      document.documentElement.dataset['theme'] = theme ?? 'light';
      return story();
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'App',
      values: [
        { name: 'App', value: '#fafafa' },
        { name: 'Surface', value: '#ffffff' },
        { name: 'Dark', value: '#121212' },
      ],
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
};

export default preview;
