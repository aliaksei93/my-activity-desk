import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UiSelectOption } from './select.types';

@Component({
  selector: 'ui-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSelectComponent<T = string> {
  @Input() label?: string;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() value?: T;
  @Input() options: UiSelectOption<T>[] = [];

  @Output() valueChange = new EventEmitter<T>();

  get selectedIndex(): string {
    const index = this.options.findIndex((option) => option.value === this.value);
    return index >= 0 ? String(index) : '';
  }

  onSelectChange(event: Event): void {
    const index = Number((event.target as HTMLSelectElement).value);
    const option = this.options[index];

    if (option) {
      this.valueChange.emit(option.value);
    }
  }
}
