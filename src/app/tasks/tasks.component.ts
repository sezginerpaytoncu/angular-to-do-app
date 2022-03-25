import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TaskService } from 'sezgin';
import { Task } from 'sezgin/lib/services/task';
import { map, BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
  taskListState = new BehaviorSubject<Task[]>([]);
  taskList$ = this.taskListState.asObservable();

  isNewTaskFormEnabled: boolean = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.getTasks();
  }

  toggleForm() {
    this.isNewTaskFormEnabled = !this.isNewTaskFormEnabled;
  }

  getTasks(): void {
    this.taskService
      .getTasks()
      .subscribe((res) => this.taskListState.next(res));
  }

  updateTaskStatus(task: Task): void {
    this.taskService.updateTaskStatus(task).subscribe((task) => {
      const oldList = this.taskListState.value;
      const newList = oldList.map((_task) =>
        _task.id === task.id ? { ..._task, completed: task.completed } : _task
      );
      this.taskListState.next(newList);
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task).subscribe((_task) => {
      const oldList = this.taskListState.value;
      const newList = oldList.filter((oTask) => oTask.id !== task.id);
      this.taskListState.next(newList);
    });
  }
}
