import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../services/incident.service';  // Сервис для работы с инцидентами
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ClassificationService} from '../services/classification.service'; // Сервис для работы с классификациями
import  {ResolutionService} from '../services/resolution.service'; // Сервис для работы с резолюциями
@Component({
  selector: 'app-incident-directory',
  templateUrl: './incident-directory.component.html',
  styleUrls: ['./incident-directory.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class IncidentDirectoryComponent implements OnInit {
  incidents: any[] = [];
  classifications: any[] = [];
  resolutions: any[]=[];
  resolutionOptions = [
    'Закрыто ТП 1 уровня',
    'Закрыто ТП 2 уровня',
    'Закрыто ТП 3 уровня',
    'Другое'
  ];
  newIncident = { id: 0, dateTime:new Date(),  description: '', classification: '', client: '', resolution:this.resolutionOptions[0], isComplete: false };  // Для добавления нового инцидента
  editedIncident: any = null;  // Для редактирования инцидента

  constructor(private incidentService: IncidentService, private classificationService: ClassificationService, private resolutionService: ResolutionService)  {}

  ngOnInit(): void {
    this.getIncidents();
    this.getClassifications();
    this.getResolutions();
  }
  // Получение списка классификаций
  getClassifications(): void {
    this.classificationService.getClassifications().subscribe((data) => {
      this.classifications = data;
    });
  }
  // Получение списка резолюций
  getResolutions(): void {
    this.resolutionService.getResolutions().subscribe((data) => {
      this.resolutions=data;
    })
  }
  // Получение списка инцидентов
  getIncidents(): void {
    this.incidentService.getIncidents().subscribe((data) => {
      this.incidents = data;
    });
  }

  // Добавление нового инцидента
  addIncident(): void {
    this.incidentService.addIncident(this.newIncident).subscribe((incident) => {
      this.incidents.push(incident);

      // Добавление элемента в классификации
      const newClassification = {
        id: incident.id, // ID инцидента
        classificationName: this.newIncident.classification // Классификация из инцидента
      };
      this.classificationService.addClassification(newClassification).subscribe((classification) => {
        this.classifications.push(classification); // Обновляем локальную таблицу классификаций

      });
      // Добавление элемента в таблицу резолюций, если инцидент завершен
      if (this.newIncident.isComplete) {
        const newResolution = {
          id: incident.id,
          resolution: this.newIncident.resolution
        };

        this.resolutionService.addResolution(newResolution).subscribe((resolution) => {})
        this.resolutions.push(newResolution);
      }
      // Очистить форму
      this.newIncident = { id: 0,dateTime:new Date(), description: '', classification: '', client: '',resolution:this.resolutionOptions[0], isComplete: false };
    });
  }

  // Начало редактирования инцидента
  startEditing(incident: any): void {
    this.editedIncident = { ...incident };  // Создаем копию инцидента для редактирования
  }

  // Сохранение отредактированного инцидента
  saveIncident(): void {
    if (this.editedIncident) {
      this.incidentService.editIncident(this.editedIncident.id, this.editedIncident).subscribe(() => {
        const index = this.incidents.findIndex((i) => i.id === this.editedIncident.id);
        if (index !== -1) {
          this.incidents[index] = this.editedIncident;

          // Обновляем классификацию для этого инцидента
          const classificationIndex = this.classifications.findIndex(
            (c) => c.id === this.editedIncident.id
          );
          if (classificationIndex !== -1) {
            this.classificationService
              .editClassification(this.editedIncident.id, {
                id: this.editedIncident.id,
                classificationName: this.editedIncident.classification
              })
              .subscribe((updatedClassification) => {
                this.classifications[classificationIndex] = updatedClassification; // Обновляем локальную классификацию
              });
          }


          const resolutionIndex = this.resolutions.findIndex(
            (s) => s.id === this.editedIncident.id
          );
          if (resolutionIndex !== -1 ) {                                                   //Проверка на существование элемента в таблице резолюций
            if (this.editedIncident.isComplete){                                           //Проверка на то что инцидент "завершен"
              this.resolutionService.editResolution(this.editedIncident.id, {
              id: this.editedIncident.id,
              resolution: this.editedIncident.resolution
              })
              .subscribe((updatedResolution) => {
              this.resolutions[resolutionIndex]=updatedResolution;
              });
            }
            else{                                                                           //Тут мы оказываемся, если после редактирования инцидент перестает быть завершенным
              this.resolutionService.deleteResolution(this.editedIncident.id).subscribe(() => {})
            }
          }
          else {
            if (this.editedIncident.isComplete) {                                              //Добавляем элемент в таблицу резолюций если его статус сменился на "Завершен"
              const newResolution = {
                id: this.editedIncident.id,
                resolution: this.newIncident.resolution
              };
              this.resolutionService.addResolution(newResolution).subscribe((resolution) => {})
              this.resolutions.push(newResolution);
            }

          }
        }
        this.editedIncident = null; // Завершить редактирование

        // Обновляем данные с сервера для синхронизации (без этого почему-то вылетает ошибка при редактировании)
        this.getIncidents();
        this.getClassifications();
        this.getResolutions();
      });
    }
  }


  // Удаление инцидента
  deleteIncident(incidentId: number): void {
    this.incidentService.deleteIncident(incidentId).subscribe(() => {
      this.incidents = this.incidents.filter(incident => incident.id !== incidentId);  // Удалить из списка
    });
  // Удаление элемента из таблицы классификаций
    this.classificationService.deleteClassification(incidentId).subscribe(() => {
      this.classifications = this.classifications.filter(classification => classification.id !== incidentId);  // Удалить из списка
    });

    //Проверка на существование элемента в таблице резолюций и последующее его удаление оттуда
    const index = this.resolutions.findIndex((i) => i.id === incidentId);
    if (index !== -1) {
      this.resolutionService.deleteResolution(incidentId).subscribe(() => {
        this.resolutions = this.resolutions.filter(resolution => resolution.id !== incidentId);
      })
    }
  }
}
