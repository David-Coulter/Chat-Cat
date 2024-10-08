import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [FormsModule]
})
export class ChatComponent {
  userInput: string = '';
  sfweLogo = 'assets/images/SFWE_logo.png';
  chatcatLogo = 'assets/images/chatcat.png';

  sendMessage() {
    console.log('Message sent:', this.userInput);
    // Add your message sending logic here
    this.userInput = ''; // Clear the input after sending
  }
}