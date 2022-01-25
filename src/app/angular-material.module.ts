import { NgModule } from "@angular/core";
import {
  MatInputModule, MatCardModule, MatButtonModule,
  MatToolbarModule, MatExpansionModule, MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule
} from '@angular/material';

// import the modules also export them
// otherwise they wont be visible in other modules
// infact we don't have to explicitly mark the modules as import, angular automatically does that for us
@NgModule({
  // imports: [
  //   MatInputModule,
  //   MatCardModule,
  //   MatButtonModule,
  //   MatToolbarModule,
  //   MatProgressSpinnerModule,
  //   MatExpansionModule,
  //   MatPaginatorModule,
  //   MatDialogModule,
  // ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDialogModule,
  ]
})
export class AngularMaterialModule { }
