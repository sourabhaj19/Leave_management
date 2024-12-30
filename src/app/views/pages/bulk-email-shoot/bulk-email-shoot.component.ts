import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent, AccordionItemComponent, TemplateIdDirective, AccordionButtonDirective, ButtonGroupComponent, FormCheckLabelDirective, ButtonDirective, FormCheckComponent, FormCheckInputDirective } from '@coreui/angular';

@Component({
  selector: 'app-bulk-email-shoot',
  standalone: true,
  imports: [AccordionComponent,
    AccordionItemComponent,
    TemplateIdDirective,
    ReactiveFormsModule,
    FormCheckComponent,
    FormCheckInputDirective,
    AccordionButtonDirective,
    ButtonGroupComponent, 
    FormCheckLabelDirective, 
    ButtonDirective,CommonModule],
  templateUrl: './bulk-email-shoot.component.html',
  styleUrl: './bulk-email-shoot.component.scss'
})
export class BulkEmailShootComponent {
bulkForm: FormGroup;
  constructor(private fb: FormBuilder){
    this.bulkForm = this.fb.group({
      id:[true],
      empName: [''],
      empid: [''],
      email: [''],
      message_body: [''],
    });
  }
data=[
  {
    id:1,
    empname:'Akshaya Jadhav',
    empid:'A125f4',
    leavedata:[
      {
        leavetype:'Earn leave',
        date:'15-11-2024'
      },
      {
        leavetype:'Medical Leave',
        date:'6-11-2024'
      }
    ],
  },
  {
    id:2,
    empname:'Trupti Patil',
    empid:'B13df45',
    leavedata:[
      {
        leavetype:'Earn leave',
        date:'01-11-2024'
      },
      {
        leavetype:'Medical Leave',
        date:'06-11-2024'
      }
    ],
  },
  {
    id:3,
    empname:'Sourabh Jadhav',
    empid:'C145fr5',
    leavedata:[
      {
        leavetype:'Earn leave',
        date:'15-11-2024'
      },
      {
        leavetype:'Medical Leave',
        date:'6-11-2024'
      }
    ],
  }
]
  items = [1, 2, 3, 4];
  onselect(id:any,event:any){
   console.log(id,event.target.checked,'evnrt')
  }

  selectall(){
    this.bulkForm.controls['id'].setValue('true')
  }
}
