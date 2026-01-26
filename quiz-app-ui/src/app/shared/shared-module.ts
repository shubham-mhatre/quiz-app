import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { MaterialModule } from '../material/material-module';



@NgModule({
  declarations: [
    Header
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    Header
  ]
})
export class SharedModule { }
