import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestsService } from '../httprequests.service';
import { CodeUploadPayload, NavigationRegistrationData, RegistrationPayload, Response } from '../interfaces';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  reactiveForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    name: new FormControl('', [Validators.min(2), Validators.required]),
    checkbox: new FormControl(false, [Validators.requiredTrue]),
  })
  navigationRegistrationData?: NavigationRegistrationData = {
    email: this.route.snapshot.paramMap.get('email')!,
    code: this.route.snapshot.paramMap.get('code')!,
    purchase_time: this.route.snapshot.paramMap.get('purchase_time')!,
  }

  constructor(
    private route: ActivatedRoute,
    private httpRequestsService: HttpRequestsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.reactiveForm.controls['email'].setValue(
      this.navigationRegistrationData?.email
    );
  }

  async registration(): Promise<void | Response> {
    let form = this.reactiveForm.controls;
    let payload: RegistrationPayload = {email: form['email'].value, name: form['name'].value};
    const options = {headers: {'Content-Type': 'application/json'}};

    let response = await this.httpRequestsService.registration(payload, options);
    
    if(response.data?.success) {
      alert("Sikeres regisztráció")
      if(this.navigationRegistrationData?.code) {
        let payload: CodeUploadPayload = {email: form['email'].value, code: this.navigationRegistrationData.code, purchase_time: this.navigationRegistrationData.purchase_time};
        let response = await this.httpRequestsService.codeUpload(payload, options)
        if(response.data?.success) {
          alert("Sikeres kódfeltöltés!")
          if(response.data?.won) {
            alert("A feltöltött kód NYERT!")
          } else {
            alert("A feltöltött kód NEM nyert!")
          }
          this.router.navigate(["/"])
        }
      }
    }
  }
}
