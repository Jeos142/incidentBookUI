import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service'; // Сервис для работы с клиентами
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-directory',
  templateUrl: './client-directory.component.html',
  styleUrls: ['./client-directory.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class ClientDirectoryComponent implements OnInit {
  clients: any[] = [];
  newClient = { id: 0, name: '' };  // Для добавления нового клиента
  editedClient: any = null;  // Для редактирования клиента

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void {
    this.clientService.getClients().subscribe(
      (data) => {
        console.log('Clients loaded:', data);
        this.clients = data;
      },
      (error) => {
        console.error('Error loading clients:', error);  // Логирование ошибок
      }
    );
  }

  // Добавление нового клиента
  addClient(): void {
    if (!this.isNewClientValid()) {
      console.error('Ошибка: все обязательные поля должны быть заполнены.');
      alert('Ошибка: все обязательные поля должны быть заполнены.');
      return;
    }
    this.clientService.addClient(this.newClient).subscribe((client) => {
      this.clients.push(client);
      this.newClient = { id: 0, name: '' };  // Очистить форму
    });
  }

  //Проверка на то, что все поля нового элемента заполнены
  isNewClientValid(): boolean {
    return (
      this.newClient.name.trim() !== ''
    );
  }
  //Проверка на то, что все поля отредактированного элемента заполнены
  isEditedClientValid(): boolean {
    return (
      this.editedClient.name.trim() !== ''
    );
  }
  // Начало редактирования клиента
  startEditing(client: any): void {
    this.editedClient = { ...client };  // Создаем копию клиента для редактирования
  }

  // Сохранение отредактированного клиента
  saveClient(): void {
    if (this.editedClient) {
      if (!this.isEditedClientValid()) {
        console.error('Ошибка: все обязательные поля должны быть заполнены.');
        alert('Ошибка: все обязательные поля должны быть заполнены.');
        return;
      }

      this.clientService.editClient(this.editedClient.id, this.editedClient).subscribe(() => {
        const index = this.clients.findIndex(c => c.id === this.editedClient.id);
        if (index !== -1) {
          this.clients[index] = this.editedClient;  // Обновить данные в списке
        }
        this.editedClient = null;  // Завершить редактирование
      });
    }
  }

  // Отмена
  cancelEditing(): void {
    this.editedClient = null;
  }
  // Удаление клиента
  deleteClient(clientId: number): void {
    this.clientService.deleteClient(clientId).subscribe(() => {
      this.clients = this.clients.filter(client => client.id !== clientId);  // Удалить из списка
    });
  }
}
