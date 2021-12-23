import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mat-select-unit-test-example';

  firstLst = ['Hej', 'Hi', 'Hola']
  secondLst = ['Hej då', 'Bye', 'Adios']

  demoForm = new FormGroup({
    select1: new FormControl(this.firstLst[0], Validators.maxLength(3)),
    select2: new FormControl(this.secondLst[0], Validators.maxLength(5)),
  });

  onSubmitForm(): void {

  }
}
