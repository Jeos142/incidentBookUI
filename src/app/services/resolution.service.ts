import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResolutionService {
  private apiUrl = 'https://localhost:7187/api/ClosedIncidentsItems';

  constructor(private http: HttpClient) { }

  getResolutions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Добавление нового резолюции
  addResolution(resolution: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, resolution);
  }

  // Редактирование резолюции
  editResolution(resolutionId: number, resolution: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${resolutionId}`, resolution);
  }

  // Удаление резолюции
  deleteResolution(resolutionId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${resolutionId}`);
  }
}
