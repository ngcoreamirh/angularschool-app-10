import { Component, ViewChild } from '@angular/core';
import { IStudent } from '../../models/student.interface';
import { StudentService } from '../../services/student.service';
import { APP_CONFIG } from '../../common/app-config';
import { AlertMessageComponent } from '../shared/alert-message/alert-message.component'
import { animate, style, transition, trigger } from '@angular/animations';
import { APP_FUNCTIONS } from 'src/app/common/app-functions';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss'],
  animations: [
    trigger('panelInOut', [
      transition('* => void', [
        animate(100, style({ transform: 'translateY(-30%)' }))
      ])
    ])
  ]
})
export class StudentManagementComponent {

  studentList: IStudent[] = [];
  student: IStudent = {} as IStudent;
  isLoadDataFail: boolean = false;
  isFormSubmited: boolean = false;
  isShowLoading: boolean;
  isShowBlur: boolean;
  AppConfig = APP_CONFIG;
  @ViewChild(AlertMessageComponent) AlertMessageComponent: AlertMessageComponent;

  selectedStudents: IStudent[] = [] as IStudent[];
  isOneSelected: boolean = false;
  isNotSelected: boolean = true;
  isManySelected: boolean = false;
  isAllSelected: boolean = false;

  constructor(private _studentService: StudentService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.isShowLoading = true;
    this._studentService.getStudents().subscribe(_res => {
      this.studentList = _res.data ? _res.data : [];
      this.isLoadDataFail = false;
      this.isShowLoading = false;
    }, () => {
      this.isLoadDataFail = true;
      this.isShowLoading = false;
    });
  }

  onAddStudent() {
    if (!APP_FUNCTIONS.isTextEmpty(this.student.name)) {
      this.isFormSubmited = true;
      this.isShowLoading = true;

      this._studentService.createStudent(this.student).subscribe((_res) => {
        this.AlertMessageComponent.showAlertMessage(_res.message, "green");
        this._clearForm();
        this.loadStudents();
      }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
        this.isShowLoading = false;
      }));
    }
    else {
      this.AlertMessageComponent.showAlertMessage(APP_CONFIG.CORRECT_DATA_ENTRY_MESSAGE, "red");
    }
  }

  onEditStudent() {
    if (!APP_FUNCTIONS.isTextEmpty(this.student.name)) {
      this.isFormSubmited = true;
      this.isShowLoading = true;

      this._studentService.editStudent(this.student).subscribe((_res) => {
        this.AlertMessageComponent.showAlertMessage(_res.message, "green");
        this._clearForm();
        this.loadStudents();
      }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
        this.isShowLoading = false;
      }));
    }
    else {
      this.AlertMessageComponent.showAlertMessage(APP_CONFIG.CORRECT_DATA_ENTRY_MESSAGE, "red");
    }
  }

  onRemoveStudent(_studentID: string) {
    this.isShowLoading = true;
    this._studentService.removeStudent(_studentID).subscribe((_res) => {
      this._clearForm();
      this.AlertMessageComponent.showAlertMessage(_res.message, "blue");
      this.loadStudents();
    }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
      this.isShowLoading = false;
    }));
  }

  onItemChange(_student: IStudent) {
    if (this.selectedStudents.some(selected_student => selected_student.ID == _student.ID)) {
      this.selectedStudents.splice(this.selectedStudents.findIndex(selected_student => selected_student.ID == _student.ID), 1);
      this.student = this.selectedStudents[0];
    } else {
      this.selectedStudents.push(_student);
      this.student = { ..._student };
    }

    if (this.selectedStudents.length == 0) {
      this._clearForm();
    }
    if (this.selectedStudents.length == 1) {
      this.isNotSelected = false;
      this.isOneSelected = true;
      this.isManySelected = false;
      this.isAllSelected = false;
    }
    if (this.selectedStudents.length > 1) {
      this.isNotSelected = false;
      this.isOneSelected = false;
      this.isManySelected = true;
      this.isAllSelected = false;
    }
    if (this.selectedStudents.length == this.studentList.length && this.studentList.length > 1) {
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
      this.selectedStudents = [] as IStudent[];
      this.studentList.forEach(_student => {
        this.selectedStudents.push(_student);
      });
      this.isAllSelected = true;
      this.isNotSelected = false;
      this.isOneSelected = false;
      this.isManySelected = false;
    }
  }

  onRemoveAllClick() {
    this.isShowLoading = true;
    let selected_student_ids: string[] = this.selectedStudents.map(selected_student => selected_student.ID);
    this._studentService.removeStudents(selected_student_ids).subscribe((_res) => {
      this._clearForm();
      this.AlertMessageComponent.showAlertMessage(_res.message, "blue");
      this.loadStudents();
    }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
      this.isShowLoading = false;
    }));
  }

  isStudentSelected(_student: IStudent): boolean {
    return this.selectedStudents.some(selected_student => selected_student.ID == _student.ID);
  }

  onAlertMessageVisible(_isAlertMessageVisible: boolean) {
    this.isFormSubmited = _isAlertMessageVisible;
    if (_isAlertMessageVisible) {
      this.isShowBlur = true;
    } else {
      this.isShowBlur = false;
    }
  }

  // متد پاک کردن اینپوت ها که پس از افزودن دانشجو فراخوانی میشه
  private _clearForm() {
    this.student = {} as IStudent;
    this.selectedStudents = [] as IStudent[];
    this.isNotSelected = true;
    this.isOneSelected = false;
    this.isManySelected = false;
    this.isAllSelected = false;
  }

}

