import { Component, OnInit } from '@angular/core';
import { ResolutionService } from '../services/resolution.service'; // Сервис для работы с резолюцями
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../services/incident.service';  // Сервис для работы с инцидентами
@Component({
  selector: 'app-resolution-directory',
  templateUrl: './resolution-directory.component.html',
  styleUrls: ['./resolution-directory.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class ResolutionDirectoryComponent implements OnInit {
  resolutions: any[] = [];
  incidents: any[] = [];
  newResolution = { id: 0, resolution: '' };  // Для добавления нового резолюции
  editedResolution: any = null;  // Для редактирования резолюции


  constructor(private resolutionService: ResolutionService,private incidentService: IncidentService) { }

  ngOnInit(): void {
    this.getResolutions();
    this.getIncidents();
  }
  getIncidents(): void {
    this.incidentService.getIncidents().subscribe((data) => {

      this.incidents = data;
    });
  }
  getResolutions(): void {
    this.resolutionService.getResolutions().subscribe(
      (data) => {
        console.log('Resolutions loaded:', data);  // Для дебага
        this.resolutions = data;
      },
      (error) => {
        console.error('Error loading :', error);  // Логирование ошибок
      }
    );
  }

  // Добавление новой резолюции
  addResolution(): void {
    if (!this.isNewResolutionValid()) {
      console.error('Ошибка: все обязательные поля должны быть заполнены.');
      alert('Ошибка: все обязательные поля должны быть заполнены.');
      return;
    }
    this.resolutionService.addResolution(this.newResolution).subscribe( {

      next: (client) => {
        this.resolutions.push(client);
        this.newResolution = { id: 0, resolution: '' };  // Очистить форму
      },
        error: (err) => {
        console.error('Ошибка при :',err);
      }
    });
  }

  // Начало редактирования резолюции
  startEditing(client: any): void {
    this.editedResolution = { ...client };  // Создаем копию клиента для редактирования
  }

  // Сохранение отредактированного резолюции
  saveResolution(): void {
    if (!this.isEditedResolutionValid()) {
      console.error('Ошибка: все обязательные поля должны быть заполнены.');
      alert('Ошибка: все обязательные поля должны быть заполнены.');
      return;
    }
    if (this.editedResolution) {
      this.resolutionService.editResolution(this.editedResolution.id, this.editedResolution).subscribe( {

        next: () => {
          const index = this.resolutions.findIndex(c => c.id === this.editedResolution.id);
          if (index !== -1) {
            this.resolutions[index] = this.editedResolution;  // Обновить данные в списке
          }
          this.editedResolution = null;  // Завершить редактирование
        },
          error: (err) => {
          console.error('Ошибка при редакатировании резолюции:',err);
        }
      });

    }
  }
  cancelEditing(): void {
    this.editedResolution = null;
  }
  // Удаление резолюции
  deleteResolution(resolutionId: number): void {
    this.resolutionService.deleteResolution(resolutionId).subscribe(() => {
      this.resolutions = this.resolutions.filter(resolution => resolution.id !== resolutionId);  // Удалить из списка
    });
  }
  //Проверка на то, что все поля нового элемента заполнены
  isNewResolutionValid(): boolean {
    return (
      this.newResolution.resolution.trim() !== ''
    );
  }
  //Проверка на то, что все поля нового элемента заполнены
  isEditedResolutionValid(): boolean {
    return (
      this.editedResolution.resolution.trim() !== ''
    );
  }
}
