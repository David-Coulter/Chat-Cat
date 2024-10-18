import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true, // Standalone component
  imports: [FormsModule] // Import FormsModule for template-driven forms
})
export class ChatComponent {
  messages: { text: string; sender: string }[] = [];
  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, sender: 'User' });
      this.newMessage = '';
      setTimeout(() => {
        this.messages.push({ text: 'Bot response to: ' + this.newMessage, sender: 'Bot' });
      }, 1000);
    }
  }
}
