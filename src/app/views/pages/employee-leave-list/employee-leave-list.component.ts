import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective, ButtonDirective, DropdownComponent, DropdownDividerDirective, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective, FormCheckInputDirective, FormControlDirective, FormLabelDirective, FormSelectDirective, InputGroupComponent, InputGroupTextDirective, ThemeDirective, ContainerComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { cilArrowCircleLeft, cilArrowCircleRight } from '@coreui/icons';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-employee-leave-list',
  standalone: true,
  templateUrl: './employee-leave-list.component.html',
  styleUrl: './employee-leave-list.component.scss',
  imports: [HttpClientModule,RowComponent, ColComponent, TextColorDirective,ButtonDirective, IconDirective,CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective,InputGroupComponent, InputGroupTextDirective, FormControlDirective, FormLabelDirective, FormCheckInputDirective, ButtonDirective, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective,
    DropdownItemDirective, RouterLink, DropdownDividerDirective, FormSelectDirective,FormsModule, ReactiveFormsModule,ContainerComponent,CommonModule],
    providers:[ApiService]
  })
export class EmployeeLeaveListComponent {
  showempform: boolean = false;
  currentMonth: string = '';
  currentYear: number= 0;
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysInMonth: any[] = [];
  selectedLeave: string = 'None';
  icons = { cilArrowCircleLeft,cilArrowCircleRight};
  employeedetails:any=[]
  constructor( private api:ApiService) {}
  currentMonthAndYear:any
  currentDate: any; 
  showLeaveDialog: boolean = false; 
  selectedDay: any = null;
  users:any=[]
  ngOnInit(): void {
    this.currentDate = moment();
    this.getemployees()
  }

  getemployees(){
    this.api.getemployee().subscribe({
      next:(res:any)=>{
        this.users=res?.body
        // this.totalPages = Math.ceil(this.employees.length / this.pageSize); // Calculate total pages
        // this.updatePaginatedEmployees();
      } ,
      error: (err)=>{}
    })
    }

  // public users= [
  //   {
  //     id:1,
  //     name: 'Akshaya Jadhav',
  //     NAleaves: 2,
  //     appleave: 1,
  //     Totalleave:3,
  //     leavedata:[
  //       {
  //         date:'11-12-2024',leaveType:'Half day taken but not applied'
  //       },{
  //         date:'15-11-2024',leaveType:'Half day taken and applied'
  //       } 
  //     ]
  //   },
  //   {
  //     id:2,
  //     name: 'Trupti Patil',
  //     NAleaves: 1,
  //     appleave: 2,
  //     Totalleave:3,
  //     leavedata:[
  //       {
  //         date:'09-11-2024',leaveType:'Half day taken and applied'
  //       },{
  //         date:'13-11-2024',leaveType:'Full day taken but not applied'
  //       } 
  //     ]
  //   },
  // ]
  oneditinfo:any=[]
  openempinfo(idd: any) {
    this.daysInMonth=[]
    const user = this.users.find((user:any) => user.id === idd);
    this.oneditinfo.push(user)
    user.leaves.map((e:any)=>{
      // e.leaveDate=new Date(e.leaveDate);
      const [year, month, day] = e.leaveDate.split("-");
      e.leaveDate=`${day}-${month}-${year}`
    })
    console.log(user)
    this.showempform = true;
    const currentMonth = this.currentDate.month();
    const currentYear = this.currentDate.year();
    user?.leaves.forEach((leave: any) => {
      // const [day, month, year] = leave.leaveDate.split('-').map(Number);
      // const leaveDate = new Date(year, month - 1, day);
      const index = this.daysInMonth.findIndex((dayObj: any) => {
        const dayObjDate = new Date(currentYear, currentMonth, dayObj.date);
        return (
          dayObj.date !== null &&
          dayObjDate.getDate() === leave.leaveDate.getDate() &&
          dayObjDate.getMonth() ===leave.leaveDate.getMonth() &&
          dayObjDate.getFullYear() === leave.leaveDate.getFullYear()
        );
      });
      if (index !== -1) {
        this.daysInMonth[index].leaveType = leave.leaveType;
      } else {
        console.warn(`Date ${leave.leaveDate} not found in daysInMonth`);
      }
    });
    this.loadCalendar(idd);
    sessionStorage.setItem('id',idd)
  }
  
  getPreviousDate(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  }

  loadCalendar(selectedUserId?: number) {
    this.currentMonth = this.currentDate.format('MMMM');
    this.currentYear = this.currentDate.year();
  
    const firstDayOfMonth = this.currentDate.clone().startOf('month');
    const lastDayOfMonth = this.currentDate.clone().endOf('month');
  
    const startDayOfWeek = firstDayOfMonth.day();
    const numberOfDays = lastDayOfMonth.date();
  
    this.daysInMonth = [];
  
   for (let i = 0; i < startDayOfWeek; i++) {
      this.daysInMonth.push({
        date: null,
        leaveType: null,
      });
    }
        
    let monthLeaveData: any[] = [];
    if (selectedUserId !== undefined) {
      const selectedUser = this.users.find((user:any) => user.id === selectedUserId);
      if (selectedUser) {
        const selectedMonth = this.currentDate.month() + 1;
        const selectedYear = this.currentDate.year();
        monthLeaveData = selectedUser.leaves.filter((leave:any) => {
          const [day, month, year] = leave.leaveDate.split('-').map(Number);
          return month === selectedMonth && year === selectedYear;
        });
      }
    }
  
    for (let i = 1; i <= numberOfDays; i++) {
      const leaveForDay = monthLeaveData.find((leave:any) => {
        const [day, month, year] = leave.leaveDate.split('-').map(Number);
        return day === i;
      });
  
      this.daysInMonth.push({
        date: i,
        leaveType: leaveForDay ? leaveForDay.leaveType : null,
      });
    }
  
    const month = (this.currentDate.month() + 1).toString().padStart(2, '0');
    this.currentMonthAndYear = `${this.currentYear}-${month}`;
  }
  
onDateChange(event:any){
   const selectedDateValue = (event.target as HTMLInputElement).value;
  const [year, month] = selectedDateValue.split('-').map(Number);
  this.currentDate = moment({ year, month: month - 1, day: 1 });
  const id=Number(sessionStorage.getItem('id'))
  this.loadCalendar(id);
}
previousMonth() {
  this.currentDate = this.currentDate.subtract(1, 'months');
  const id=Number(sessionStorage.getItem('id'))
  this.loadCalendar(id);
}

nextMonth() {
  this.currentDate = this.currentDate.add(1, 'months'); // Move to the next month
  const id=Number(sessionStorage.getItem('id'))
  this.loadCalendar(id);
}

closeleaveupdate(){
  this.showempform=false;
  var mon=this.currentDate.month()
  const month = (mon + 1).toString().padStart(2, '0');
  this.currentMonthAndYear = `${this.currentYear}-${month}`;
}

  saveLeaveData() {
    const leaveData = this.daysInMonth
      .filter(day => day.leaveType)
      .map(day => ({ date: day.date, leaveType: day.leaveType }));
    this.sendLeaveDataToServer(leaveData);
  }

  sendLeaveDataToServer(leaveData: any[]) {
    console.log('Sending data to server...', leaveData);
  }

  openLeaveDialog(day: any) {
    this.selectedDay = day;
    this.selectedLeave = day.leaveType || 'None';
    this.showLeaveDialog = true;
  }
  
  closeLeaveDialog() {
    this.showLeaveDialog = false;
  }
  
  saveLeaveType() {
    if (this.selectedDay) {
      this.selectedDay.leaveType = this.selectedLeave;
    }
    console.log(this.selectedLeave)
    this.closeLeaveDialog();
  }
  
 getColor(leaveType: string): string {
  switch (leaveType) {
    case 'Half_day_taken_and_not_applied':
      return '#ffcccb';
    case 'Half_day_taken_and_applied':
      return '#add8e6';
    case 'Full_day_taken_and_not_applied':
      return '#fa6b69';
    case 'Full_day_taken_and_applied':
      return '#90ee90';
    default:
      return 'transparent';
  }
}
}