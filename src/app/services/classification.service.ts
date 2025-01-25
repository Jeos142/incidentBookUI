import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  private apiUrl = 'https://localhost:7187/api/IncidentClassifications';

  constructor(private http: HttpClient) { }

  getClassifications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Добавление
  addClassification(classification: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, classification);
  }

  // Редактирование
  editClassification(ClassificationId: number, classification: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ClassificationId}`, classification);
  }

  // Удаление
  deleteClassification(ClassificationId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${ClassificationId}`);
  }
}
