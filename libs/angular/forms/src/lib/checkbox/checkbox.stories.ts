import type { Meta, StoryObj } from '@storybook/angular';
import { UiCheckboxComponent } from './checkbox.component';

const meta: Meta<UiCheckboxComponent> = {
  title: 'Angular/Forms/Checkbox',
  component: UiCheckboxComponent,
  tags: ['autodocs'],
  args: {
    label: 'Done',
    checked: true,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<UiCheckboxComponent>;

export const Default: Story = {};
