import { Routes } from '@angular/router';

export const routes: Routes = [
   {
      path: 'employee_master',
      loadComponent: () => import('./employee-master/employee-master.component').then(m => m.EmployeeMasterComponent),
      data: {
        title: 'Employee details Page'
      }
    },
    {
      path: 'employeeleave',
      loadComponent: () => import('./employee-leave-list/employee-leave-list.component').then(m => m.EmployeeLeaveListComponent),
      data: {
        title: 'Employee Leave Management'
      }
    },

    {
      path: 'event_master',
      loadComponent: () => import('./event-master/event-master.component').then(m => m.EventMasterComponent),
      data: {
        title: 'Event Management'
      }
    },
  
    {
      path: 'bulk_shoot',
      loadComponent: () => import('./bulk-email-shoot/bulk-email-shoot.component').then(m => m.BulkEmailShootComponent),
      data: {
        title: 'Bulk Email Shoot'
      }
    },
  
  // {
  //   path: '404',
  //   loadComponent: () => import('./page404/page404.component').then(m => m.Page404Component),
  //   data: {
  //     title: 'Page 404'
  //   }
  // },
  // {
  //   path: '500',
  //   loadComponent: () => import('./page500/page500.component').then(m => m.Page500Component),
  //   data: {
  //     title: 'Page 500'
  //   }
  // },
  // {
  //   path: 'login',
  //   loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  //   data: {
  //     title: 'Login Page'
  //   }
  // },
  
  // {
  //   path: 'register',
  //   loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
  //   data: {
  //     title: 'Register Page'
  //   }
  // }
];
