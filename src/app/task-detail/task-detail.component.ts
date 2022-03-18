import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'sezgin';
import { Task } from 'sezgin/lib/services/task';
import { Location } from '@angular/common';

import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() task:any; // task: Task hata???? {Object is possibly null}

  isEditFormEnabled:boolean = false;
  isImageProper: boolean = true;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getTask();
  }

  getTask(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTask(id).subscribe((task) => (this.task = task));
  }

  // updateTask(): void {
  //   if (this.task) {
  //     this.taskService.updateTask(this.task).subscribe(() => this.location.back());
  //   }
  // }

  toggleForm(): void{
    this.isEditFormEnabled = !this.isEditFormEnabled;
  }




  updateTask(task: Task): void {
    this.taskService.updateTask(task).subscribe(task => {console.log(task)});
    console.log(`task-${task.id} updated!`);
    this.isEditFormEnabled = false;
  }




  onSubmit(f: NgForm) {
    f.value.taskDescription = f.value.taskDescription.trim();
    if(f.value.taskDescription.length===0){
      console.log('You can not submit empty data');
      return;
    }

    this.task.description = f.value.taskDescription;
    this.task.completed = false;
    this.task.updatedAt = Date.now();
    if(this.isImageProper===true)
      this.updateTask(this.task);
    else
      return;
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
        const max_size = 20000;

        if (fileInput.target.files[0].size > max_size) {
            // console.error('Maximum size allowed is ' + max_size / 1000 + 'kB');
            this.isImageProper = false;
            return;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const imgBase64Path = e.target.result;
                this.task.media = imgBase64Path;
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
        this.isImageProper = true;
        return;
    }else{
      this.isImageProper = true;
      return;
    }
  }









}
