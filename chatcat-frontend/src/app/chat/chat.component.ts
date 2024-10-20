import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent {
  @ViewChild('userInput') userInput!: ElementRef;

  responseData: any;
  isLoading = false;
  errorMessage: string | null = null;
  userQuery = '';
  chatHistory: { text: string; time: string; sender: string }[] = [];
  sfweLogo = 'assets/images/SFWE_logo.png';
  chatcatLogo = 'assets/images/chatcat.png';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  fetchQueryResponse() {
    if (!this.userQuery.trim()) {
      return; // Avoid sending empty requests
    }

    this.isLoading = true;
    this.errorMessage = null;

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { query_text: this.userQuery };

    this.addChatMessage(this.userQuery, 'user');

    const apiUrl = 'http://127.0.0.1:5000/query';

    console.log('Sending request with body:', body);

    this.http.post(apiUrl, body, { headers })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.responseData = response;
          this.addChatMessage(response.answer, 'admin');
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.status === 0) {
            this.errorMessage = 'Error connecting to the server. Please check your network connection.';
          } else {
            this.errorMessage = `Error occurred while fetching the response: ${error.status} - ${error.statusText}`;
          }
          console.error('Error occurred:', error);
          this.addChatMessage(this.errorMessage, 'admin');
        },
        complete: () => {
          this.userQuery = '';
          this.focusInput();
        }
      });
  }

  addChatMessage(text: string, sender: 'user' | 'admin') {
    const currentTime = this.getCurrentTime();
    this.chatHistory.push({ text, time: currentTime, sender });
    this.cd.detectChanges();
  }

  getCurrentTime(): string {
    const date = new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  startNewChat() {
    this.chatHistory = [];
    this.userQuery = '';
    this.errorMessage = null;
    this.focusInput();
    this.cd.detectChanges();
  }

  focusInput() {
    setTimeout(() => {
      this.userInput.nativeElement.focus();
    });
  }
}