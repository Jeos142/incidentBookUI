import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  private apiUrl = `${environment.base_url}/api/IncidentClassifications`;

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
