import type { Meta, StoryObj } from '@storybook/angular';
import { UiSelectComponent } from './select.component';

const meta: Meta<UiSelectComponent> = {
  title: 'Angular/Forms/Select',
  component: UiSelectComponent,
  tags: ['autodocs'],
  args: {
    label: 'Priority',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
    value: 'medium',
    disabled: false,
    required: false,
  },
};

export default meta;

type Story = StoryObj<UiSelectComponent>;

export const Default: Story = {};
