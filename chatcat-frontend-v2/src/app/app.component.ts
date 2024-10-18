import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this line to import FormsModule
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule], // Include FormsModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'API Call Example';
  responseData: any; // To store the API response
  isLoading = false; // Loading state
  errorMessage: string | null = null; // Error message
  userQuery: string = ''; // Property for user input
  chatHistory: { text: string; time: string; sender: string }[] = []; // Chat history
  showMessageInput = false; // Controls whether the input area is visible

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  // Function to call the API
  fetchQueryResponse() {
    this.isLoading = true; // Set loading to true
    this.errorMessage = null; // Clear any previous errors

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      query_text: this.userQuery // Use dynamic query
    };

    // Display the user question in the chat history
    this.addChatMessage(this.userQuery, 'user'); // Add user question to chat

    // Call the API
    this.http.post('https://7992-34-105-70-74.ngrok-free.app/query/', body, { headers })
      .subscribe({
        next: (response) => {

          
          this.responseData = response; // Store the API response
          this.addChatMessage(this.responseData, 'admin'); // Add admin response to chat
          this.cd.detectChanges(); // Force Angular to detect changes
          console.log('Response:', this.responseData); // Log the response for debugging
        },
        error: (error) => {
          console.error('Error occurred:', error); // Handle any errors
          this.errorMessage = 'An error occurred while fetching data'; // Set error message
        },
        complete: () => {
          this.isLoading = false; // Set loading to false when complete
          this.userQuery = ''; // Clear user input
        }
      });
  }

  // Method to add messages to chat history
  addChatMessage(text: string, sender: 'user' | 'admin') {
    const currentTime = this.getCurrentTime();
    this.chatHistory.push({ text, time: currentTime, sender });
  }

  // Helper method to get current time
  getCurrentTime(): string {
    const date = new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Method to show the input message area when "New Message" is clicked
  startNewMessage() {
    this.showMessageInput = true; // Show text area and Ask button
  }
}
