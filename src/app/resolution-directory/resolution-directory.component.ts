import { Component, OnInit } from '@angular/core';
import { ResolutionService } from '../services/resolution.service'; // Сервис для работы с резолюцями
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resolution-directory',
  templateUrl: './resolution-directory.component.html',
  styleUrls: ['./resolution-directory.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class ResolutionDirectoryComponent implements OnInit {
  resolutions: any[] = [];
  newResolution = { id: 0, resolution: '' };  // Для добавления нового резолюции
  editedResolution: any = null;  // Для редактирования резолюции

  constructor(private resolutionService: ResolutionService) { }

  ngOnInit(): void {
    this.getResolutions();
  }

  getResolutions(): void {
    this.resolutionService.getResolutions().subscribe(
      (data) => {
        console.log('Clients loaded:', data);  // Для дебага
        this.resolutions = data;
      },
      (error) => {
        console.error('Error loading clients:', error);  // Логирование ошибок
      }
    );
  }

  // Добавление новой резолюции
  addResolution(): void {
    this.resolutionService.addResolution(this.newResolution).subscribe((client) => {
      this.resolutions.push(client);
      this.newResolution = { id: 0, resolution: '' };  // Очистить форму
    });
  }

  // Начало редактирования резолюции
  startEditing(client: any): void {
    this.editedResolution = { ...client };  // Создаем копию клиента для редактирования
  }

  // Сохранение отредактированного резолюции
  saveResolution(): void {
    if (this.editedResolution) {
      this.resolutionService.editResolution(this.editedResolution.id, this.editedResolution).subscribe(() => {
        const index = this.resolutions.findIndex(c => c.id === this.editedResolution.id);
        if (index !== -1) {
          this.resolutions[index] = this.editedResolution;  // Обновить данные в списке
        }
        this.editedResolution = null;  // Завершить редактирование
      });
    }
  }

  // Удаление резолюции
  deleteResolution(resolutionId: number): void {
    this.resolutionService.deleteResolution(resolutionId).subscribe(() => {
      this.resolutions = this.resolutions.filter(resolution => resolution.id !== resolutionId);  // Удалить из списка
    });
  }
}
