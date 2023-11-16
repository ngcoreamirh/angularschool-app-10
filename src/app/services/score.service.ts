import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IScore } from '../models/score.interface';
import { APP_CONFIG } from '../common/app-config'
import { IResponse } from '../models/response.interface';

@Injectable({
  providedIn: 'root'
})

export class ScoreService {

  constructor(private _httpClient: HttpClient) { }

  getScores(): Observable<IResponse<IScore[]>> {
    return this._httpClient.get<IResponse<IScore[]>>(APP_CONFIG.API_URL + 'scores');
  }

  createScore(_score: IScore): Observable<IResponse<IScore>> {
    return this._httpClient.post<IResponse<IScore>>(APP_CONFIG.API_URL + 'scores/create', _score);
  }

  editScore(_score: IScore): Observable<IResponse<IScore>> {
    return this._httpClient.post<IResponse<IScore>>(APP_CONFIG.API_URL + 'scores/edit', _score);
  }

  removeScore(_score_id: string): Observable<IResponse<IScore>> {
    return this._httpClient.delete<IResponse<IScore>>(APP_CONFIG.API_URL + `scores/${_score_id}`);
  }

  removeScores(_scores_ids: string[]): Observable<IResponse<IScore[]>> { 
    return this._httpClient.post<IResponse<IScore[]>>(APP_CONFIG.API_URL + `scores/remove-all/${_scores_ids}`, null);
  }

}