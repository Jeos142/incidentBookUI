import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = `${environment.base_url}/api/IncidentItems`;

  constructor(private http: HttpClient) {}

  // Получение списка инцидентов
  getIncidents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Добавление нового инцидента
  addIncident(incident: any, ): Observable<any> {
    return this.http.post<any>(this.apiUrl, incident);
  }

  // Редактирование инцидента
  editIncident(incidentId: number, incident: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${incidentId}`, incident);
  }

  // Удаление инцидента
  deleteIncident(incidentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${incidentId}`);
  }
}
