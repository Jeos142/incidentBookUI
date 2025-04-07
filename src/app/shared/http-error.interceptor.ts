import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorLoggingService } from './error-logging.service';
//Логирование ошибок http запросов
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private logger: ErrorLoggingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('%c[Interceptor] Ошибка HTTP:', 'color: red', error);
        this.logger.log(error);
        return throwError(() => error);
      })
    );
  }
}
