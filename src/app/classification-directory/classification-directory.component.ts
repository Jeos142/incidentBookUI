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
        console.error('Ошибка при загрузке классификаций:', error);  // Логирование ошибок
        alert(`Ошибка при добавлении классификации: ${error}`)
      }
    );
  }

  // Добавление новй классификации
  addClassification(): void {
    if (!this.isNewClassificationValid()) {
      console.error('Ошибка: все обязательные поля должны быть заполнены.');
      alert('Ошибка: все обязательные поля должны быть заполнены.');
      return;
    }
    this.classificationService.addClassification(this.newClassification).subscribe({
      next: (classification) => {
        this.classifications.push(classification);
        this.newClassification = { id: 0, classificationName: '' };  // Очистить форму
      },
        error: (err) => {
        console.error('Ошибка при добавлении классификации:',err);
          alert(`Ошибка при добавлении классификации: ${err}`)
      }
    });
  }
  //Проверка на то, что все поля отредактированного элемента заполнены
  isEditedClassificationValid(): boolean {
    return (
      this.editedClassification.classificationName.trim() !== ''
    );
  }
  //Проверка на то, что все поля нового элемента заполнены
  isNewClassificationValid(): boolean {
    return (
      this.newClassification.classificationName.trim() !== ''
    );
  }
  // Начало редактирования
  startEditing(classification: any): void {
    this.editedClassification = { ...classification };  // Создаем копию  для редактирования
  }

  // Сохранение отредактированного
  saveClassification(): void {
    if (!this.isEditedClassificationValid()) {
      console.error('Ошибка: все обязательные поля должны быть заполнены.');
      alert('Ошибка: все обязательные поля должны быть заполнены.');
      return;
    }
    if (this.editedClassification) {
      this.classificationService.editClassification(this.editedClassification.id, this.editedClassification).subscribe( {
        next: () => {
          const index = this.classifications.findIndex(c => c.id === this.editedClassification.id);
          if (index !== -1) {
            this.classifications[index] = this.editedClassification;  // Обновить данные в списке
          }
          this.editedClassification = null;  // Завершить редактирование
        },
          error: (err) => {
          console.error('Ошибка при редактировании классификации:',err);
            alert(`Ошибка при редактировании классификации: ${err}`)
        }
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
