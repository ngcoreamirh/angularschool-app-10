import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ScoreManagementComponent } from './components/score-management/score-management.component';
import { HttpClientModule } from '@angular/common/http';
import { CourseManagementComponent } from './components/course-management/course-management.component';
import { StudentManagementComponent } from './components/student-management/student-management.component';
import { AppLayoutComponent } from './components/core/app-layout/app-layout.component';
import { AlertMessageComponent } from './components/shared/alert-message/alert-message.component';
import { TipsComponent } from './components/core/tips/tips.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { BackgroundBlurComponent } from './components/shared/background-blur/background-blur.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    ScoreManagementComponent,
    CourseManagementComponent,
    StudentManagementComponent,

    AlertMessageComponent,
    TipsComponent,
    LoadingComponent,
    BackgroundBlurComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule // required animations module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
