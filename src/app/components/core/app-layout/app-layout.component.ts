import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {

  panelTitle: string;

  constructor(private _router: Router) {
    this._router.events.subscribe((_router: any) => {
      if(_router instanceof NavigationStart) {
        this._getPanelTitle(_router.url);
      }
    });
  }

  ngOnInit() {
    this._getPanelTitle(this._router.url);
  }

 private _getPanelTitle(_url: string) {
    switch (_url) {
      case '/score-management':
        this.panelTitle = 'مدیریت نمره';
        break;
      case '/course-management':
        this.panelTitle = 'مدیریت درس';
        break;
      case '/student-management':
        this.panelTitle = 'مدیریت دانشجو';
        break;
      default:
        this.panelTitle = '';
        break;
    }
  }

}
