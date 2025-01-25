import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'https://localhost:7187/api/clientitems';

  constructor(private http: HttpClient) { }

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Добавление нового клиента
  addClient(client: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, client);
  }

  // Редактирование клиента
  editClient(clientId: number, client: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${clientId}`, client);
  }

  // Удаление клиента
  deleteClient(clientId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${clientId}`);
  }
}
