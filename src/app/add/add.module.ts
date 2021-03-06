import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoutingModule } from './add-routing.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { MentorComponent } from './mentor/mentor.component';

@NgModule({
  declarations: [AddProjectComponent, MentorComponent],
  imports: [
    CommonModule,
    AddRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentTextEditorModule,
    CovalentMarkdownModule
  ]
})
export class AddModule {}
