import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HttpRequestsService } from '../httprequests.service';
import { CodeUploadPayload, NavigationRegistrationData, Response } from '../interfaces';

@Component({
  selector: 'app-codeupload',
  templateUrl: './codeupload.component.html',
  styleUrls: ['./codeupload.component.scss'],
  providers: [DatePipe]
})
export class CodeUploadComponent {
  dates = this.getDates(new Date(2022, 1, 1), new Date(2022, 3, 1));
  hours = Array.from(Array(24).keys())
  minutes = Array.from(Array(60).keys());
  reactiveForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    code: new FormControl('', [Validators.min(8), Validators.max(8), Validators.required]),
    purchaseTime: new FormGroup({
      date: new FormControl('', [Validators.required]),
      hour: new FormControl('', [Validators.required]),
      minute: new FormControl('', [Validators.required]),
    })
  })
  
  constructor(
    readonly datepipe: DatePipe,
    private httpRequestsService: HttpRequestsService,
    private router: Router
  ) { }

  getDates(startDate: Date, endDate: Date): Date[] {
    let dateArray: Date[] = [];
    let currentDate = startDate
    while(currentDate <= endDate) {
      dateArray.push(moment(currentDate).toDate())
      currentDate = moment(currentDate).add(1, 'days').toDate();
    }
    return dateArray;
  }

  isToday(date: Date): boolean {
    return this.datepipe.transform(date, 'yyyy.MM.dd') == this.datepipe.transform(new Date(), 'yyyy.MM.dd')
  }

  async codeUpload(): Promise<void | Response> {
    let form = this.reactiveForm.controls;
    let formattedPurchaseTime = form['purchaseTime'].value.date + " " + form['purchaseTime'].value.hour + ":" + form['purchaseTime'].value.minute;
    let payload: CodeUploadPayload = {email: form['email'].value, code: form['code'].value, purchase_time: formattedPurchaseTime};
    const options = {headers: {'Content-Type': 'application/json'}};

    let response = await this.httpRequestsService.codeUpload(payload, options)
    
    if(response.errors != undefined) {
      if(response.errors.find(error => error.code == "email:not_found")) {
        let navigationRegistrationData: NavigationRegistrationData = {email: form['email'].value, code: form['code'].value, purchase_time: formattedPurchaseTime}
        this.router.navigate(["/registration", navigationRegistrationData])
      }
      switch(response.errors[0].code) {
        case "code:required":
          alert("Adjon meg egy 8 karakterb??l ??ll?? k??dot!");
          break;
        case "purchase_time:invalid":
          alert("??rv??nytelen a megadott v??s??rl??si d??tum!");
          break;
        case "purchase_time:too_early":
          alert("A megadott v??s??rl??si d??tum t??l korai!");
          break;
        case "purchase_time:too_late":
          alert("A megadott v??s??rl??si d??tum t??l k??s??!");
          break;
        case "email:required":
          alert("Adja meg az email c??m??t!");
          break;
      }
    } else {
      alert("Sikeres k??dfelt??lt??s!");
      if(response.data?.won) {
        alert("A felt??lt??tt k??d NYERT!")
      } else {
        alert("A felt??lt??tt k??d NEM nyert!")
      }
    }

    return response;
  }
}
