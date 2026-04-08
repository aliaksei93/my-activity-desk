import type { Meta, StoryObj } from '@storybook/angular';
import { UiInputComponent } from './input.component';

const meta: Meta<UiInputComponent> = {
  title: 'Angular/Forms/Input',
  component: UiInputComponent,
  tags: ['autodocs'],
  args: {
    label: 'Task name',
    placeholder: 'Enter a title',
    hint: 'Up to 80 characters',
    error: '',
    value: '',
    disabled: false,
    required: false,
    type: 'text',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
  },
};

export default meta;

type Story = StoryObj<UiInputComponent>;

export const Default: Story = {};
