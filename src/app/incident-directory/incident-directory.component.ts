import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../services/incident.service';  // Сервис для работы с инцидентами
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ClassificationService} from '../services/classification.service'; // Сервис для работы с классификациями
import  {ResolutionService} from '../services/resolution.service';// Сервис для работы с резолюциями
import {ClientService} from '../services/client.service';
import {LoaderService} from '../shared/loader/loader.service';
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
  newIncident = { id: 0,
    dateTime:new Date(),
    description: '',
    classificationId: 0,
    classification: '',
    clientId:0,
    clientName: '',
    resolutionId: 0,
    resolution:'',
    isComplete: false
  };  // Для добавления нового инцидента

  editedIncident: any = null;  // Для редактирования инцидента

  constructor(private incidentService: IncidentService, private classificationService: ClassificationService, private resolutionService: ResolutionService,  private clientService: ClientService, private loader: LoaderService)  {}

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
      // Преобразуем clientId в имя клиента
      console.log(data);
      this.incidents = data.map((incident) => ({
        ...incident,

        clientName: incident.client.name ,
        classification: incident.classification.classificationName,
        resolution: incident.resolution?.resolution,
      }));
    });

  }

  // Добавление нового инцидента
  addIncident(): void {
    if (!this.isNewIncidentValid()) {
      console.error('Ошибка: все обязательные поля должны быть заполнены.');
      alert('Ошибка: все обязательные поля должны быть заполнены.');
      return;
    }

    this.incidentService.addIncident(this.newIncident).subscribe((incident) => {
      // Добавление нового элемента с получением имени клиента, классификации и резолюции по id
      this.incidents.push({
        ...incident,
      });
      // Очистить форму
      this.newIncident = { id: 0,dateTime:new Date(), description: '', classificationId:0, classification: '',clientName:'', clientId: 0, resolutionId: 0,resolution:'', isComplete: false };
    });
  }

  //Проверка на то, что все поля нового элемента заполнены
  isNewIncidentValid(): boolean {
    return (
      this.newIncident.description.trim() !== '' &&
      this.newIncident.classificationId !== 0 &&
      this.newIncident.clientId !== 0 &&
      ((this.newIncident.resolutionId !== 0 && this.newIncident.isComplete) || !this.newIncident.isComplete)
    );
  }

  //Проверка на то, что все поля отредактированного элемента заполнены
  isEditedIncidentValid(): boolean {
    return (
      this.editedIncident.description.trim() !== '' &&
      this.editedIncident.classificationId!== 0 &&
      this.editedIncident.clientId !== 0 &&
      ((this.editedIncident.isComplete==true && this.editedIncident.resolutionId != 0) || !this.editedIncident.isComplete )
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


          this.incidents[index] = this.editedIncident;

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

  }
}
