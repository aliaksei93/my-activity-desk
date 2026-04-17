import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiInputComponent {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'search' = 'text';
  @Input() value = '';
  @Input() disabled = false;
  @Input() required = false;

  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
