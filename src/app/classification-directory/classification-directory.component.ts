import { Component, OnInit } from '@angular/core';
import { ClassificationService } from '../services/classification.service'; // Сервис для работы с клиентами
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../services/incident.service';  // Сервис для работы с инцидентами
@Component({
  selector: 'app-classification-directory',
  templateUrl: './classification-directory.component.html',
  styleUrls: ['./classification-directory.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class ClassificationDirectoryComponent implements OnInit {
  classifications: any[] = [];
  incidents: any[] = [];
  newClassification = { id: 0, classificationName: '' };  // Для добавления нового клиента
  editedClassification: any = null;  // Для редактирования клиента

  constructor(private classificationService: ClassificationService,private incidentService: IncidentService) { }

  ngOnInit(): void {
    this.getClassifications();
    this.getIncidents();
  }
// Получение списка инцидентов
  getIncidents(): void {
    this.incidentService.getIncidents().subscribe((data) => {

      this.incidents = data;
    });
  }
  getClassifications(): void {
    this.classificationService.getClassifications().subscribe(
      (data) => {
        console.log('Classifications loaded:', data);  // Для дебага
        this.classifications = data;
      },
      (error) => {
        console.error('Error loading classifications:', error);  // Логирование ошибок
      }
    );
  }

  
  // Добавление нового клиента
  addClassification(): void {
    this.classificationService.addClassification(this.newClassification).subscribe((classification) => {
      this.classifications.push(classification);
      this.newClassification = { id: 0, classificationName: '' };  // Очистить форму
    });
  }
  //Проверка на то, что все поля отредактированного элемента заполнены
  isEditedClientValid(): boolean {
    return (
      this.editedClassification.classificationName.trim() !== ''
    );
  }
  // Начало редактирования
  startEditing(classification: any): void {
    this.editedClassification = { ...classification };  // Создаем копию  для редактирования
  }

  // Сохранение отредактированного
  saveClassification(): void {
    if (this.editedClassification) {
      if (!this.isEditedClientValid()) {
        console.error('Ошибка: все обязательные поля должны быть заполнены.');
        alert('Ошибка: все обязательные поля должны быть заполнены.');
        return;
      }
      this.classificationService.editClassification(this.editedClassification.id, this.editedClassification).subscribe(() => {
        const index = this.classifications.findIndex(c => c.id === this.editedClassification.id);
        if (index !== -1) {
          this.classifications[index] = this.editedClassification;  // Обновить данные в списке
        }
        const incidentIndex = this.incidents.findIndex((i) => i.id === this.editedClassification.id);
        if (incidentIndex !== -1){
          this.incidents[incidentIndex].classification=this.classifications[index].classificationName;
          this.incidentService
            .editIncident(this.editedClassification.id, this.incidents[incidentIndex])
            .subscribe((updatedIncident) => {
              this.incidents[incidentIndex] = updatedIncident; // Обновляем локальную классификацию
            });
        }


        this.editedClassification = null;  // Завершить редактирование
      });
    }
  }
  cancelEditing(): void {
    this.editedClassification = null;
  }
  // Удаление
  deleteClassification(classificationId: number): void {
    this.classificationService.deleteClassification(classificationId).subscribe(() => {
      this.classifications = this.classifications.filter(classification => classification.id !== classificationId);  // Удалить из списка
    });
  }
}
