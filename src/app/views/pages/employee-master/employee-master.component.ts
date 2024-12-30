import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective, ButtonDirective, DropdownComponent, DropdownDividerDirective, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective, FormCheckInputDirective, FormControlDirective, FormLabelDirective,
   FormSelectDirective, InputGroupComponent, InputGroupTextDirective, ThemeDirective, PageItemDirective, PageLinkDirective, PaginationComponent,
   FormFeedbackComponent,
   FormCheckLabelDirective,
   FormCheckComponent,
   ModalModule,
   ContainerComponent} from '@coreui/angular';
import { cilDelete } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { ApiService } from '../../services/api.service';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrl: './employee-master.component.scss',
  standalone: true,
  
  imports: [HttpClientModule,RowComponent, ColComponent, TextColorDirective,ButtonDirective, IconDirective,CardComponent, 
    CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, 
    AlignDirective,InputGroupComponent, InputGroupTextDirective, FormControlDirective, FormLabelDirective,  PaginationComponent,
    PageItemDirective,PageLinkDirective,FormCheckInputDirective, ButtonDirective, ThemeDirective, DropdownComponent,ModalModule,
    FormCheckComponent, FormCheckLabelDirective,DropdownToggleDirective, DropdownMenuDirective,DropdownItemDirective, RouterLink, 
    DropdownDividerDirective, FormSelectDirective,ReactiveFormsModule,CommonModule,FormFeedbackComponent,ContainerComponent
  ,FormsModule],
     providers:[ApiService]
})
export class EmployeeMasterComponent implements OnInit {
  showempform: boolean = false;
  employeeForm: FormGroup;
  submitted = false;
  formErrors: any;
  deleteid:any
  empname:any
  text: any;
  predicate = 'id';
  ascending = true;
  public visible = false;
  constructor(private fb: FormBuilder, private api:ApiService) {
    this.formErrors = this.api.errorMessages;
    this.employeeForm = this.fb.group({
      id:[''],
      empName: ['', Validators.required],
      mobileNumber: [
        '', 
        [
          Validators.required,         
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      empId: ['', [Validators.required, Validators.minLength(this.api.formRules.usernameMin)]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      birthDate: ['', Validators.required],
      joiningDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
   this.getemployees()
  }
  employees:any=[]
  paginatedEmployees: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  
  icons = {cilDelete};
  getemployees(){
  this.api.getemployee().subscribe({
    next:(res)=>{
      this.employees=res?.body
      this.totalPages = Math.ceil(this.employees.length / this.pageSize); // Calculate total pages
      this.updatePaginatedEmployees();
    } ,
    error: (err)=>{}
  })
  }

  editget(i:any){
    this.api.editget(i).subscribe({
      next:(res)=>{
        this.employeeForm.reset()
        this.showempform = true;
        this.employeeForm.controls['id'].setValue(res.body?.id);
        this.employeeForm.controls['empName'].setValue(res.body?.empName);
        this.employeeForm.controls['email'].setValue(res.body?.email);
        this.employeeForm.controls['mobileNumber'].setValue(res.body?.mobileNumber);
        this.employeeForm.controls['gender'].setValue(res.body?.gender);
          this.employeeForm.controls['designation'].setValue(res.body?.designation);
        this.employeeForm.controls['empId'].setValue(res.body?.empId);
        this.employeeForm.controls['birthDate'].setValue(res.body?.birthDate);
        this.employeeForm.controls['joiningDate'].setValue(res.body?.joiningDate);
      } ,
      error: (err)=>{}
    })
  }

  updatePaginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEmployees = this.employees.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedEmployees();
    }
  }

  addnewemp() {
    this.employeeForm.reset()
    this.showempform = true;
  }

  close() {
    this.showempform = false;
  }
  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      if (formData.id) {
        this.api.updateemp(formData.id, formData).subscribe({
          next: (res) => {
            this.getemployees();
            this.showempform=false;
          },
          error: (err) => {
            console.error('Error while updating:', err);
          }
        });
      } else {
        this.api.addnewemp(this.removeIdFromFormData(formData)).subscribe({
          next: (res) => {
            this.getemployees();
            this.showempform=false;
          },
          error: (err) => {
            console.error('Error while adding:', err);
          }
        });
      }
    } else {
      console.error('Form is invalid');
    }
  }
  removeIdFromFormData(formData: any): any {
    const { id, ...formDataWithoutId } = formData;
    return formDataWithoutId;
  }
  getdeleteid(i:any,empname:any){
    this.visible = true;
    this.deleteid=i
    this.empname=empname
  }

  closemodel(){
    this.visible =false;
  }
  deleteemp(){
    this.api.deleteemp(this.deleteid).subscribe({
      next:(res)=>{
        this.visible = false;
        this.getemployees();
        } ,
      error: (err)=>{}
    })
  }
  Search() {
    if (this.text !== "") {
      this.api.search(
          {
            page: 0,
            sort: this.sort(),
          },
          this.text
        )
        .subscribe((res) => {
          if (res) {
            console.log(res)
          }
        });
    }
  }

  private sort(): string[] {
    const result = [`${this.predicate},${this.ascending ? "asc" : "desc"}`];
    if (this.predicate !== "id") {
      result.push("id");
    }
    return result;
  }
}



