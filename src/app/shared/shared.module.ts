import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { TestTaskComponent } from './components/test-task/test-task.component';
import { EventSourceService } from './services/event-source.service';

let MATERIAL_MODULES = [MatFormFieldModule, MatInputModule];
@NgModule({
  declarations: [TestTaskComponent],
  providers: [EventSourceService],
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  exports: [...MATERIAL_MODULES, ReactiveFormsModule, TestTaskComponent],
})
export class SharedModule {}
