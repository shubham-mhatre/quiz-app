import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { MaterialModule } from '../material/material-module';
import { NewlineToBrPipe } from '../pipes/newline-to-br-pipe';



@NgModule({
  declarations: [
    Header,
    NewlineToBrPipe
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    Header,
    NewlineToBrPipe
  ]
})
export class SharedModule { }
