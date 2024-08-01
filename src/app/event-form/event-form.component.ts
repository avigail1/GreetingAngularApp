import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OpenaiService } from '../openai.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';



@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgFor, NgIf],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
})

export class EventFormComponent {
  eventForm: FormGroup;
  eventTypes = ['יום הולדת', 'חתונה', 'ברית', 'בר מצוה', 'בת מצוה', 'יום נישואין', 'אירוסין', 'חגי ישראל'];
  greetingStyles = ['קליל', 'מחורז', 'מכתב'];
  showAgeField = false;
  showYearsMarriedField = false;
  greetings: any;
  currentGreetingIndex = 0;
  currentGreeting: string | undefined;
  generatedGreeting?: string;
  loading = false;
  showform = true;
  timeout = false;

  constructor(private fb: FormBuilder, private openaiService: OpenaiService) {
    this.eventForm = this.fb.group({
      eventType: [''],
      eventName: [''],
      greetingStyle: [''],
      greetingLength: [''],
      relationship: [''],
      personalContent: [''],
      age: [''],
      yearsMarried: ['']
    });
  }

  onEventTypeChange() {
    const eventType = this.eventForm.get('eventType')?.value;
    this.showAgeField = eventType === 'יום הולדת';
    this.showYearsMarriedField = eventType === 'יום נישואין';
  }

  onSubmit() {
    this.loading = true;
    this.showform = false;
    const formData = this.eventForm.value;
    const prompt = this.createPrompt(formData);

  
    this.openaiService.generateGreetings(prompt).subscribe(response => {
      this.greetings = response.choices;
      this.currentGreetingIndex = 0;
      this.currentGreeting = this.greetings[this.currentGreetingIndex].message.content;
      this.loading = false;
    });

  }

  createPrompt(formData: {
    eventType: string;
    eventName: string;
    greetingStyle?: string;
    greetingLength?: string;
    relationship?: string;
    personalContent?: string;
    age?: string;
    yearsMarried?: string;
  }): string {
    let prompt = `ברכה ל${formData.eventType} עבור ${formData.eventName}. `;
    if (formData.greetingStyle) {
      prompt += `סגנון הברכה הוא ${formData.greetingStyle}. `;
    }
    if (formData.greetingLength) {
      prompt += `אורך הברכה הוא ${formData.greetingLength} מילים. `;
    }
    if (formData.relationship) {
      prompt += `הקרבה היא ${formData.relationship}. `;
    }
    if (formData.personalContent) {
      prompt += `תוכן אישי: ${formData.personalContent}. `;
    }
    if (formData.age) {
      prompt += `גיל: ${formData.age}. `;
    }
    if (formData.yearsMarried) {
      prompt += `שנות נישואין: ${formData.yearsMarried}. `;
    }
    return prompt;
  }

  nextGreeting() {
  if (this.greetings.length > 0) {
    this.currentGreetingIndex = (this.currentGreetingIndex + 1) % this.greetings.length;
    this.currentGreeting = this.greetings[this.currentGreetingIndex].message.content;
  }
}

copyToClipboard() {
  const greetingText = this.currentGreeting
  if (greetingText) {
    navigator.clipboard.writeText(greetingText).then(() => {
      alert('הברכה הועתקה ללוח!');
    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  }
}

  returnToPromt() {
    this.currentGreeting = "";
    this.greetings = "";
    this.showform = true;
  }

}
