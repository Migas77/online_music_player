import {Component, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {KeyValuePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    KeyValuePipe
  ],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.css'
})
export class ErrorDisplayComponent {
  @Input() error_messages : Record<any, any> = {};

  reset_error_messages() : void {
    this.error_messages = {}
  }
}
