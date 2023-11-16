import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICourse } from '../models/cource.interface';
import { APP_CONFIG } from '../common/app-config';
import { IResponse } from '../models/response.interface';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private _httpClient: HttpClient) { }

  getCourses():Observable<IResponse<ICourse[]>>  {
    return this._httpClient.get<IResponse<ICourse[]>>(APP_CONFIG.API_URL + 'courses');
  }

  createCourse(_course: ICourse):Observable<IResponse<ICourse>>  {
    return this._httpClient.post<IResponse<ICourse>>(APP_CONFIG.API_URL + 'courses/create', _course);
  }

  editCourse(_course: ICourse): Observable<IResponse<ICourse>> {
    return this._httpClient.post<IResponse<ICourse>>(APP_CONFIG.API_URL + 'courses/edit', _course);
  }

  removeCourse(_course_id: string):Observable<IResponse<ICourse>>  {
    return this._httpClient.delete<IResponse<ICourse>>(APP_CONFIG.API_URL + `courses/${_course_id}`);
  }

  removeCourses(_courses_ids: string[]): Observable<IResponse<ICourse[]>> { 
    return this._httpClient.post<IResponse<ICourse[]>>(APP_CONFIG.API_URL + `courses/remove-all/${_courses_ids}`, null);
  }

}
