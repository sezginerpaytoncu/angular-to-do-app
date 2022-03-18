import { Component, OnInit } from '@angular/core';
import { TaskService } from 'sezgin';
import { Task } from 'sezgin/lib/services/task';
// ?? import { TaskFormComponent } from 'sezgin/lib/components/task-form/task-form.component';
import { TaskFormComponent } from 'sezgin';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  isNewTaskFormEnabled:boolean = false;
  

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.getTasks();
  }

  toggleForm(){
    this.isNewTaskFormEnabled = !this.isNewTaskFormEnabled;
  }

  getTasks(): void {
    // this.taskService.getTasks().subscribe((tasks: any) => (this.tasks = tasks));
    // works but canceled, too long
    this.taskService.getTasks().subscribe((tasks: any) => {
      
      this.tasks = tasks.map((task: any) => {
        if(task.media.length<20)
          task.media="http://localhost:4200/favicon.ico";
        return task;
      }
      )
    });
  }

  updateTaskStatus(task: Task): void {
    this.taskService.updateTaskStatus(task).subscribe(task => {
      for(let item of this.tasks){
        if(item.id === task.id){
          item.completed = task.completed;
          break;
        }
      }
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task).subscribe(task => {
      for(let item of this.tasks){
        if(item.id === task.id){
          // splice kullan
          delete this.tasks[this.tasks.indexOf(item)];
          break;
        }
      }
    });
  }

}
