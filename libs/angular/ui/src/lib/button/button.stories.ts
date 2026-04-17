import type { Meta, StoryObj } from '@storybook/angular';
import { UiButtonComponent } from './button.component';

const meta: Meta<UiButtonComponent> = {
  title: 'Angular/UI/Button',
  component: UiButtonComponent,
  tags: ['autodocs'],
  args: {
    label: 'Create task',
    variant: 'filled',
    color: 'primary',
    disabled: false,
    type: 'button',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['text', 'filled', 'outlined', 'elevated'],
    },
    color: {
      control: 'radio',
      options: ['primary', 'neutral', 'danger'],
    },
  },
};

export default meta;

type Story = StoryObj<UiButtonComponent>;

export const Primary: Story = {};
