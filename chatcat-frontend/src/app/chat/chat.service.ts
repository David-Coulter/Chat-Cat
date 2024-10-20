// src/app/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5000'; 

  constructor(private http: HttpClient) {}

  query(userInput: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/query`, { query: userInput })
      .pipe(
        retry(3),  // Retry failed requests up to 3 times
        catchError(this.handleError)
      );
  }

  scrape(urls: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/scrape`, { urls })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message
    return throwError('Something went wrong; please try again later.');
  }
}