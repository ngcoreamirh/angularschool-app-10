import { Component, OnInit, ViewChild } from '@angular/core';
import { ICourse } from 'src/app/models/cource.interface';
import { IScore } from 'src/app/models/score.interface';
import { ScoreService } from '../../services/score.service';
import { IStudent } from '../../models/student.interface';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';
import { APP_CONFIG } from '../../common/app-config';
import { AlertMessageComponent } from '../shared/alert-message/alert-message.component';
import { forkJoin } from 'rxjs';
import { APP_FUNCTIONS } from 'src/app/common/app-functions';

@Component({
  selector: 'app-score-management',
  templateUrl: './score-management.component.html',
  styleUrls: ['./score-management.component.scss']
})
export class ScoreManagementComponent implements OnInit {

  // چون میخواهیم نمره هارو به یه لیست اضافه کنیم یک آرایه از نوع اینترفیسی که ساختیم لازم داریم
  scoreList: IScore[] = []; // بهتره همینجا آرایه هارو مساوی خالی قرار بدیم که بعدا گیر نده بهمون
  courseList: ICourse[] = [];
  studentList: IStudent[] = [];
  score: IScore = {} as IScore;
  selectedStudent: IStudent = null;
  selectedCourse: ICourse = null;
  isLoadDataFail: boolean = false;
  // templateRefrence استفاده کردیم هم از روش twoWay برای بایندیگ، هم از روش 
  isFormSubmited: boolean = false;
  isShowLoading: boolean;
  isShowBlur: boolean;
  AppConfig = APP_CONFIG;
  @ViewChild(AlertMessageComponent) AlertMessageComponent: AlertMessageComponent;

  selectedScores: IScore[] = [] as IScore[];
  isOneSelected: boolean = false;
  isNotSelected: boolean = true;
  isManySelected: boolean = false;
  isAllSelected: boolean = false;

  constructor(private _scoreService: ScoreService, private _courseService: CourseService,
    private _studentService: StudentService) {

  }

  ngOnInit(): void {
    this.loadDatas();
  }

  loadDatas() {
    this.isShowLoading = true;
    let get_courses = this._courseService.getCourses();
    let get_students = this._studentService.getStudents();
    let get_scores = this._scoreService.getScores();

    forkJoin([get_courses, get_students, get_scores]).subscribe(([_courses, _students, _scores]) => {
      this.courseList = _courses.data ? _courses.data : [];
      this.studentList = _students?.data ? _students.data : [];
      this.scoreList = _scores?.data ? _scores.data : [];

      this.isShowLoading = false;
      this.isLoadDataFail = false;
    }, () => {
      this.isShowLoading = false;
      this.isLoadDataFail = true;
    });
  }

  onAddScore() {
    if (this._isFormDataValid()) {
      this.isFormSubmited = true;
      this.isShowLoading = true;
      // یه شی از نوع اینترفیسمون ساختیم تا با مقادیری که تو اینپوت ها وارد میکنیم پرش کنیم
      // و در نهایت به سرویسمون پاس بدیم
      let new_score: IScore = {
        student: {
          ID: this.selectedStudent.ID,
          name: this.selectedStudent.name
        },
        course: {
          ID: this.selectedCourse.ID,
          title: this.selectedCourse.title
        },
        scoreNumber: this.score.scoreNumber
      };

      this._scoreService.createScore(new_score).subscribe((_res) => {
        this.AlertMessageComponent.showAlertMessage(_res.message, "green");
        this._clearForm();
        this.loadDatas();
      }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
        this.isShowLoading = false;
      }));
    }
    else {
      this.AlertMessageComponent.showAlertMessage(APP_CONFIG.CORRECT_DATA_ENTRY_MESSAGE, "red");
    }
  }

  onEditScore() {
    if (this._isFormDataValid()) {
      this.isFormSubmited = true;
      this.isShowLoading = true;

      let score: IScore = {
        ID: this.score.ID,
        student: this.selectedStudent,
        course: this.selectedCourse,
        scoreNumber: this.score.scoreNumber
      }

      this._scoreService.editScore(score).subscribe((_res) => {
        this.AlertMessageComponent.showAlertMessage(_res.message, "green");
        this._clearForm();
        this.loadDatas();
      }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
        this.isShowLoading = false;
      }));
    }
    else {
      this.AlertMessageComponent.showAlertMessage(APP_CONFIG.CORRECT_DATA_ENTRY_MESSAGE, "red");
    }
  }

  onRemoveScore(_scoreID: string) {
    this.isShowLoading = true;
    this._scoreService.removeScore(_scoreID).subscribe((_res) => {
      this.AlertMessageComponent.showAlertMessage(_res.message, "blue");
      this._clearForm();
      this.loadDatas();
    }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
      this.isShowLoading = false;
    }));
  }

  onItemChange(_score: IScore) {
    if (this.selectedScores.some(selected_score => selected_score.ID == _score.ID)) {
      this.selectedScores.splice(this.selectedScores.findIndex(selected_score => selected_score.ID == _score.ID), 1);
      this.score = this.selectedScores[0];
    } else {
      this.selectedScores.push(_score);
      this.score = { ..._score };
      this.selectedStudent = this.studentList.find(student => student.ID == _score.student.ID);
      this.selectedCourse = this.courseList.find(course => course.ID == _score.course.ID);
    }

    if (this.selectedScores.length == 0) {
      this._clearForm();
    }
    if (this.selectedScores.length == 1) {
      this.isNotSelected = false;
      this.isOneSelected = true;
      this.isManySelected = false;
      this.isAllSelected = false;
    }
    if (this.selectedScores.length > 1) {
      this.isNotSelected = false;
      this.isOneSelected = false;
      this.isManySelected = true;
      this.isAllSelected = false;
    }
    if (this.selectedScores.length == this.courseList.length && this.courseList.length > 1) {
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
      this.selectedScores = [] as IScore[];
      this.scoreList.forEach(_score => {
        this.selectedScores.push(_score);
      });
      this.isAllSelected = true;
      this.isNotSelected = false;
      this.isOneSelected = false;
      this.isManySelected = false;
    }
  }

  onRemoveAllClick() {
    this.isShowLoading = true;
    let selected_scores_ids: string[] = this.selectedScores.map(selected_score => selected_score.ID);
    this._scoreService.removeScores(selected_scores_ids).subscribe((_res) => {
      this._clearForm();
      this.AlertMessageComponent.showAlertMessage(_res.message, "blue");
      this.loadDatas();
    }, _error => APP_FUNCTIONS.handleError(_error, this.AlertMessageComponent, () => {
      this.isShowLoading = false;
    }));
  }

  isScoreSelected(_score: IScore): boolean {
    return this.selectedScores.some(selected_score => selected_score.ID == _score.ID);
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
    this.score = {} as IScore;
    this.selectedScores = [] as IScore[];
    this.selectedStudent = null;
    this.selectedCourse = null;

    this.isNotSelected = true;
    this.isOneSelected = false;
    this.isManySelected = false;
    this.isAllSelected = false;
  }

  private _isFormDataValid = () => {
    if (this.selectedStudent && this.selectedCourse && this.score.scoreNumber >= 0 && this.score.scoreNumber <= 20 &&
      !APP_FUNCTIONS.isTextEmpty(this.score.scoreNumber ? this.score.scoreNumber.toString() : '')) {
      return true
    } else {
      return false
    }
  }

}