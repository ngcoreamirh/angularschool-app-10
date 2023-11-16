import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ICourse } from '../../models/cource.interface';
import { APP_CONFIG } from '../../common/app-config';
import { AlertMessageComponent } from '../shared/alert-message/alert-message.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { APP_FUNCTIONS } from 'src/app/common/app-functions';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.scss'],
  animations: [
    trigger('panelInOut', [
      transition('* => void', [
        animate(100, style({ transform: 'translateY(-30%)' }))
      ])
    ])
  ]
})
export class CourseManagementComponent implements OnInit {

  courseList: ICourse[] = [];
  course: ICourse = {} as ICourse;
  isEditMode: boolean = false;
  isLoadDataFail: boolean = false;
  isFormSubmited: boolean = false;
  AppConfig = APP_CONFIG;
  @ViewChild(AlertMessageComponent) AlertMessageComponent: AlertMessageComponent;

  selectedCourses: ICourse[] = [] as ICourse[];
  isOneSelected: boolean = false;
  isNotSelected: boolean = true;
  isManySelected: boolean = false;
  isAllSelected: boolean = false;
  isShowLoading: boolean;
  isShowBlur: boolean;

  constructor(private _courseService: CourseService) {  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.isShowLoading = true;
    this._courseService.getCourses().subscribe((_res) => {
      this.courseList = _res.data ? _res.data : [];
      this.isLoadDataFail = false;
      this.isShowLoading = false;
    }, () => {
      this.isLoadDataFail = true;
      this.isShowLoading = false;
    });
  }

  onAddCourse() {
    if (!APP_FUNCTIONS.isTextEmpty(this.course.title)) {
      this.isFormSubmited = true;
      this.isShowLoading = true;
      this._courseService.createCourse(this.course).subscribe((_res) => {
        this.AlertMessageComponent.showAlertMessage(_res.message, "green");
        this._clearForm();
        this.loadCourses();
      }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
        this.isShowLoading = false;
      }));
    }
    else {
      this.AlertMessageComponent.showAlertMessage(APP_CONFIG.CORRECT_DATA_ENTRY_MESSAGE, "red");
    }
  }

  onEditCourse() {
    if (!APP_FUNCTIONS.isTextEmpty(this.course.title)) {
      this.isFormSubmited = true;
      this.isShowLoading = true;
      this._courseService.editCourse(this.course).subscribe((_res) => {
        this.AlertMessageComponent.showAlertMessage(_res.message, "green");
        this._clearForm();
        this.loadCourses();
      }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
        this.isShowLoading = false;
      }));
    }
    else {
      this.AlertMessageComponent.showAlertMessage(APP_CONFIG.CORRECT_DATA_ENTRY_MESSAGE, "red");
    }
  }

  onRemoveCourse(_course_id: string) {
    this.isShowLoading = true;
    this._courseService.removeCourse(_course_id).subscribe((_res) => {
      this._clearForm();
      this.AlertMessageComponent.showAlertMessage(_res.message, "blue");
      this.loadCourses();
    }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
      this.isShowLoading = false;
    }));
  }

  onItemChange(_course: ICourse) {
    if (this.selectedCourses.some(selected_course => selected_course.ID == _course.ID)) {
      this.selectedCourses.splice(this.selectedCourses.findIndex(selected_course => selected_course.ID == _course.ID), 1);
      this.course = this.selectedCourses[0];
    } else {
      this.selectedCourses.push(_course);
      this.course = { ..._course };
    }

    if (this.selectedCourses.length == 0) {
      this._clearForm();
    }
    if (this.selectedCourses.length == 1) {
      this.isNotSelected = false;
      this.isOneSelected = true;
      this.isManySelected = false;
      this.isAllSelected = false;
    }
    if (this.selectedCourses.length > 1) {
      this.isNotSelected = false;
      this.isOneSelected = false;
      this.isManySelected = true;
      this.isAllSelected = false;
    }
    if (this.selectedCourses.length == this.courseList.length && this.courseList.length > 1) {
      this.isNotSelected = false;
      this.isOneSelected = false;
      this.isManySelected = false;
      this.isAllSelected = true;
    }
  }

  onSelectAllClick() {
    if (this.isAllSelected) {
      this._clearForm()
    } else {
      this.selectedCourses = [] as ICourse[];
      this.courseList.forEach(_student => {
        this.selectedCourses.push(_student);
      });
      this.isAllSelected = true;
      this.isNotSelected = false;
      this.isOneSelected = false;
      this.isManySelected = false;
    }
  }

  onRemoveAllClick() {
    this.isShowLoading = true;
    let selected_cources_ids: string[] = this.selectedCourses.map(selected_course => selected_course.ID);
    this._courseService.removeCourses(selected_cources_ids).subscribe((_res) => {
      this._clearForm();
      this.AlertMessageComponent.showAlertMessage(_res.message, "blue");
      this.loadCourses();
    }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
      this.isShowLoading = false;
    }));
  }

  isCourseSelected(_cource: ICourse): boolean {
    return this.selectedCourses.some(selected_course => selected_course.ID == _cource.ID);
  }

  onAlertMessageVisible(_isAlertMessageVisible: boolean) {
    this.isFormSubmited = _isAlertMessageVisible;
    if (_isAlertMessageVisible) {
      this.isShowBlur = true;
    } else {
      this.isShowBlur = false;
    }
  }

  // متد پاک کردن اینپوت ها که پس از افزودن نمره فراخوانی میشه
  private _clearForm() {
    this.course = {} as ICourse;
    this.selectedCourses = [] as ICourse[];
    this.isNotSelected = true;
    this.isOneSelected = false;
    this.isManySelected = false;
    this.isAllSelected = false;
  }

}