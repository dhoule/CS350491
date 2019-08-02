import { Component } from '@angular/core';

import { Feedback } from '../feedback';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent {

  model = new Feedback('','','','','','','',null,'');

  submitted = false;

  onSubmit() { this.submitted = true; }

  // // Reveal in html:
  // //   Name via form.controls = {{showFormControls(feedbackForm)}}
  // showFormControls(form: any) {
  //   return form && form.controls['name'] && form.controls['name'].value; 
  // }
}
