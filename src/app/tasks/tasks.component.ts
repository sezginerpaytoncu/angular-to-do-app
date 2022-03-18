import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TaskService } from 'sezgin';
import { Task } from 'sezgin/lib/services/task';
// ?? import { TaskFormComponent } from 'sezgin/lib/components/task-form/task-form.component';
import { map, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  isNewTaskFormEnabled: boolean = false;

  taskListState = new BehaviorSubject<Task[]>([]);
  taskList$ = this.taskListState.asObservable();

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().pipe(map(tasks =>
      [...tasks.map((task: Task) => ({ ...task, media: (task.media || '').length < 20 ? '/favicon.ico' : task.media }))]
    )).subscribe(res => this.taskListState.next(res))
  }

  toggleForm() {
    this.isNewTaskFormEnabled = !this.isNewTaskFormEnabled;
  }

  getTasks(): void {
    // this.taskService.getTasks().subscribe((tasks: any) => (this.tasks = tasks));
    // works but canceled, too long
    this.taskService.getTasks().subscribe((tasks: any) => {

      this.tasks = tasks.map((task: any) => {
        if (task.media.length < 20)
          task.media = "http://localhost:4200/favicon.ico";
        return task;
      }
      )
    });
  }

  updateTaskStatus(task: Task): void {
    this.taskService.updateTaskStatus(task).subscribe(task => {
      for (let item of this.tasks) {
        if (item.id === task.id) {
          item.completed = task.completed;
          break;
        }
      }
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task).subscribe(_task => {
      const oldList = this.taskListState.value;
      const newList = oldList.filter(oTask => oTask.id !== task.id);
      this.taskListState.next(newList);
    });
  }

}
