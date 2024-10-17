import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div id="chat-container" class="container">
      <img [src]="sfweLogo" alt="University of Arizona SFWE Logo" id="sfwelogo" class="img-fluid">
      <h2>Welcome to the SFWE ChatCat</h2>
      <div class="image-container">
        <img [src]="chatcatLogo" alt="University of Arizona SFWE ChatCat Logo" id="chatcatlogo" class="img-fluid">
      </div>
      <div id="chat-messages" class="mb-3">
        <div *ngFor="let message of messages">
          <p [ngClass]="{'text-right': message.isUser, 'text-left': !message.isUser}">
            {{ message.text }}
          </p>
        </div>
      </div>
      <form id="chat-form" class="input-group mb-3" (ngSubmit)="sendMessage()">
        <input type="text" id="user-input" class="form-control" placeholder="Ask the cat!" [(ngModel)]="userInput" name="userInput">
        <button type="submit" class="btn btn-primary">Send</button>
      </form>
    </div>
  `
})
export class ChatComponent {
  userInput: string = '';
  messages: {text: string, isUser: boolean}[] = [];
  sfweLogo = 'assets/images/SFWE_logo.png';
  chatcatLogo = 'assets/images/chatcat.png';

  sendMessage() {
    if (this.userInput.trim() === '') return;
    
    this.messages.push({text: this.userInput, isUser: true});
    console.log('Message sent:', this.userInput);
    // We'll add the API call later
    this.userInput = ''; // Clear the input after sending
  }
}