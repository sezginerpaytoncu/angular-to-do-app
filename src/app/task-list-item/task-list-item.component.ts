import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from 'sezgin/lib/services/task';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.css'],
})
export class TaskListItemComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() task: Task = {
    createdAt: 0,
    description: '',
    completed: false,
    updatedAt: 0,
    media: '',
    id: '',
  };

  @Output() updateEvent = new EventEmitter<Task>();
  @Output() deleteEvent = new EventEmitter<Task>();

  updateTaskStatus(task: Task) {
    this.updateEvent.emit(task);
  }

  deleteTask(task: Task) {
    this.deleteEvent.emit(task);
  }
}
