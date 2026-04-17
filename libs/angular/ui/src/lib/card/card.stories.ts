import type { Meta, StoryObj } from '@storybook/angular';
import { UiCardComponent } from './card.component';

const meta: Meta<UiCardComponent> = {
  title: 'Angular/UI/Card',
  component: UiCardComponent,
  tags: ['autodocs'],
  args: {
    title: 'Weekly review',
    subtitle: 'Personal board',
  },
};

export default meta;

type Story = StoryObj<UiCardComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-card [title]="title" [subtitle]="subtitle">
        <p>Draft a short plan for next week and sync with the team.</p>
        <div ui-card-actions>
          <button type="button">Dismiss</button>
          <button type="button">Open</button>
        </div>
      </ui-card>
    `,
  }),
};
