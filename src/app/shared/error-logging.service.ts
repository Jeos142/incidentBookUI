import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggingService {
  log(error: any): void {
    console.group('[ERROR LOG]');
    console.error('Ошибка:', error);

    if (error instanceof HttpErrorResponse) {
      console.log('Статус:', error.status);
      console.log('URL:', error.url);
      console.log('Сообщение:', error.message);
    }

    console.groupEnd();
  }
}
