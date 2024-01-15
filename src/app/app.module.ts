import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PetsStoreModule } from './store/pets-store.module';
import { TableModule } from './table/table.module';
import { NgxsModule } from '@ngxs/store';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    TableModule,
    PetsStoreModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxsModule.forRoot()
      ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
