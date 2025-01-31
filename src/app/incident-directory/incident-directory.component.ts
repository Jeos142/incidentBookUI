import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../services/incident.service';  // Сервис для работы с инцидентами
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ClassificationService} from '../services/classification.service'; // Сервис для работы с классификациями
import  {ResolutionService} from '../services/resolution.service';// Сервис для работы с резолюциями
import {ClientService} from '../services/client.service';
@Component({
  selector: 'app-incident-directory',
  templateUrl: './incident-directory.component.html',
  styleUrls: ['./incident-directory.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class IncidentDirectoryComponent implements OnInit {
  incidents: any[] = [];
  clients: any[] = [];
  classifications: any[] = [];
  resolutions: any[]=[];
  resolutionOptions = [
    'Закрыто ТП 1 уровня',
    'Закрыто ТП 2 уровня',
    'Закрыто ТП 3 уровня',
    'Другое'
  ];
  newIncident = { id: 0,
    dateTime:new Date(),
    description: '',
    classification: '',
    client:0,
    clientName: '',
    resolution:this.resolutionOptions[0],
    isComplete: false
  };  // Для добавления нового инцидента

  editedIncident: any = null;  // Для редактирования инцидента

  constructor(private incidentService: IncidentService, private classificationService: ClassificationService, private resolutionService: ResolutionService,  private clientService: ClientService)  {}

  ngOnInit(): void {
    this.getIncidents();
    this.getClassifications();
    this.getResolutions();
    this.getClients();
  }
  // Получение списка клиентов
  getClients(): void {
    this.clientService.getClients().subscribe((data) => {
      this.clients = data;
    });
  }
  // Получение списка классификаций
  getClassifications(): void {
    this.classificationService.getClassifications().subscribe((data) => {
      this.classifications = data;
     // console.log('classifications:',this.classifications);
    });

  }
  // Получение списка резолюций
  getResolutions(): void {
    this.resolutionService.getResolutions().subscribe((data) => {
      this.resolutions=data;
     // console.log('resolutions:',this.resolutions);
    })
  }
  // Получение списка инцидентов
  getIncidents(): void {
    this.incidentService.getIncidents().subscribe((data) => {
      // Преобразуем clientId в имя клиента
      this.incidents = data.map((incident) => ({
        ...incident,
         clientName: this.getClientName(incident.client), // Заменяем id на имя клиента
      }));
    });
  }
  // Метод для получения имени клиента по id
  getClientName(clientId: number): string {
    const client = this.clients.find((c) => c.id === clientId);
    return client ? client.name : 'Неизвестный клиент';
  }
  // Добавление нового инцидента
  addIncident(): void {
    if (!this.isNewIncidentValid()) {
      console.error('Ошибка: все обязательные поля должны быть заполнены.');
      alert('Ошибка: все обязательные поля должны быть заполнены.');
      return;
    }

    this.incidentService.addIncident(this.newIncident).subscribe((incident) => {
      // Добавление нового элемента с получением имени клиента по его id
      this.incidents.push({
        ...incident,
        clientName: this.getClientName(incident.client)
      });

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
      this.newIncident = { id: 0,dateTime:new Date(), description: '', classification: '',clientName:'', client: 0, resolution:this.resolutionOptions[0], isComplete: false };
    });
  }

  //Проверка на то, что все поля нового элемента заполнены
  isNewIncidentValid(): boolean {
    return (
      this.newIncident.description.trim() !== '' &&
      this.newIncident.classification.trim() !== ''
    );
  }

  //Проверка на то, что все поля отредактированного элемента заполнены
  isEditedIncidentValid(): boolean {
    return (
      this.editedIncident.description.trim() !== '' &&
      this.editedIncident.classification.trim() !== ''&&

      ((this.editedIncident.isComplete==true && this.editedIncident.resolution != null) || !this.editedIncident.isComplete )
    );
  }

  // Начало редактирования инцидента
  startEditing(incident: any): void {
    this.editedIncident = { ...incident };  // Создаем копию инцидента для редактирования
    console.log(incident)
  }

  // Сохранение отредактированного инцидента
  saveIncident(): void {
    if (!this.isEditedIncidentValid()) {
      console.error('Ошибка: все обязательные поля должны быть заполнены.');
      alert('Ошибка: все обязательные поля должны быть заполнены.');
      return;
    }

    if (this.editedIncident  ) {
      this.incidentService.editIncident(this.editedIncident.id, this.editedIncident).subscribe(() => {
        const index = this.incidents.findIndex((i) => i.id === this.editedIncident.id);

        if (index !== -1 && JSON.stringify(this.editedIncident) !== JSON.stringify(this.incidents[index])) {  //проверка на то, что элемент существует + был изменен в ходе редактирования (если не изменен то сохранение отменяется)
          console.log('элемент изменен');
          this.incidents[index] = this.editedIncident;
          console.log('classifications:',this.classifications);
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

          console.log(this.resolutions);
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
                resolution: this.editedIncident.resolution
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

  cancelEditing(): void {
    this.editedIncident = null;
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

    //Проверка на существование элемента в таблице резолюций и возможное последующее его удаление оттуда
    const index = this.resolutions.findIndex((i) => i.id === incidentId);
    if (index !== -1) {
      this.resolutionService.deleteResolution(incidentId).subscribe(() => {
        this.resolutions = this.resolutions.filter(resolution => resolution.id !== incidentId);
      })
    }
  }
}
