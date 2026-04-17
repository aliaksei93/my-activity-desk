import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type UiButtonVariant = 'text' | 'filled' | 'outlined' | 'elevated';
export type UiButtonColor = 'primary' | 'neutral' | 'danger';

@Component({
  selector: 'ui-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  @Input() label = 'Button';
  @Input() color: UiButtonColor = 'primary';
  @Input() variant: UiButtonVariant = 'filled';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() ariaLabel?: string;
}
