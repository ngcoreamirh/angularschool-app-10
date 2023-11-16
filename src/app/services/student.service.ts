import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStudent } from '../models/student.interface';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../common/app-config';
import { IResponse } from '../models/response.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private _httpClient: HttpClient) { }

  getStudents(): Observable<IResponse<IStudent[]>> {
    return this._httpClient.get<IResponse<IStudent[]>>(APP_CONFIG.API_URL + 'students');
  }

  createStudent(_student: IStudent): Observable<IResponse<IStudent>> {
    return this._httpClient.post<IResponse<IStudent>>(APP_CONFIG.API_URL + 'students/create', _student);
  }

  editStudent(_student: IStudent): Observable<IResponse<IStudent>> {
    return this._httpClient.post<IResponse<IStudent>>(APP_CONFIG.API_URL + 'students/edit', _student);
  }

  removeStudent(_student_id: string): Observable<IResponse<IStudent>> {
    return this._httpClient.delete<IResponse<IStudent>>(APP_CONFIG.API_URL + `students/${_student_id}`);
  }

  removeStudents(_students_ids: string[]): Observable<IResponse<IStudent[]>> { 
    return this._httpClient.post<IResponse<IStudent[]>>(APP_CONFIG.API_URL + `students/remove-all/${_students_ids}`, null);
  }

}
