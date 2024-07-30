import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventFormComponent } from './event-form/event-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , EventFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'OpenAiClient';
}
