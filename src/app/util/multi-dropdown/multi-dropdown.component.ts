import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-multi-dropdown',
  templateUrl: './multi-dropdown.component.html',
  styleUrls: ['./multi-dropdown.component.scss']
})
export class MultiDropdownComponent {
  @Input() options: string[] = [];
  @Input() placeholder = 'Select options';
  @Input() selectedLabel = 'Selected: ';
  @Output() selectedValues = new EventEmitter<string[]>();

  isOpen = false;
  selectedItems: string[] = [];

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  toggleSelection(option: string) {
    if (this.selectedItems.includes(option)) {
      this.selectedItems = this.selectedItems.filter(item => item !== option);
    } else {
      this.selectedItems.push(option);
    }

    this.selectedValues.emit(this.selectedItems);
  }

  isSelected(option: string): boolean {
    return this.selectedItems.includes(option);
  }
}
