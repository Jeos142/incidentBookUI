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

  // Добавление новй классификации
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



      this.classificationService.editClassification(this.editedClassification.id, this.editedClassification).subscribe(() => {
        const index = this.classifications.findIndex(c => c.id === this.editedClassification.id);
        if (index !== -1) {
          this.classifications[index] = this.editedClassification;  // Обновить данные в списке
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
