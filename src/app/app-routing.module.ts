import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeUploadComponent } from './code-upload/codeupload.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {
    path: '',
    component: CodeUploadComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
