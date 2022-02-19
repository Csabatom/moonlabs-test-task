import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'
import * as moment from 'moment';

@Component({
  selector: 'app-codeupload',
  templateUrl: './codeupload.component.html',
  styleUrls: ['./codeupload.component.scss'],
  providers: [DatePipe]
})
export class CodeUploadComponent implements OnInit {
  dates = this.getDates(new Date(2022, 1, 1), new Date(2022, 3, 1));
  time = Array.from(Array(60).keys());
  
  constructor(readonly datepipe: DatePipe) { }

  ngOnInit(): void { }

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
    return this.datepipe.transform(date, 'yyyy.MM.dd') == this.datepipe.transform(new Date(), 'yyyy.MM.dd');
  }
}
