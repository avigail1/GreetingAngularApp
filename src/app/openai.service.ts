import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class OpenaiService {

  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  // private apiKey = secrets.OPEN_AI_KEY;

  constructor(private http: HttpClient) {}

  generateGreetings(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      max_tokens: 300,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
      top_p: 1.0,
      n: 3,
      model: 'gpt-3.5-turbo'
    };

    console.log(body);

    return this.http.post(this.apiUrl, body, { headers });
  }
}

