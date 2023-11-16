import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreManagementComponent } from './components/score-management/score-management.component';
import { StudentManagementComponent } from './components/student-management/student-management.component';
import { CourseManagementComponent } from './components/course-management/course-management.component';
import { AppLayoutComponent } from './components/core/app-layout/app-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'score-management',
        pathMatch:"full"
      },
      {
        path: 'score-management',
        component: ScoreManagementComponent,
        pathMatch:"full"
      },
      {
        path: 'student-management',
        component: StudentManagementComponent,
        pathMatch:"full"
      },
      {
        path: 'course-management',
        component: CourseManagementComponent,
        pathMatch:"full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }