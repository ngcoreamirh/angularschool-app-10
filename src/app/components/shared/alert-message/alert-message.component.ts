import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnDestroy {

  alertMessage: string = "";
  alertmessageColor: string = "";
  private _intervalForAlertMessage: any;
  @Output() isVisible = new EventEmitter<boolean>;

  constructor() { }

  showAlertMessage(_message: string, _messageColor: string) {
    this.alertmessageColor = _messageColor;
    window.scrollTo(0, 0);
    this.alertMessage = _message;
    this.isVisible.emit(true);

    let width = 0;
    this._intervalForAlertMessage = setInterval(() => {
      if (width >= 100) {
        clearInterval(this._intervalForAlertMessage);
        this._clearAlertMessage();
        this.isVisible.emit(false);
      } else {
        let progress = document.getElementById("progress");
        progress ? progress.style.width = width++ + "%" : null;
      }
    }, 20)
  }

  private _clearAlertMessage() {
    this.alertMessage = "";
  }

  ngOnDestroy(): void {
    this._clearAlertMessage();
    this.isVisible.emit(false);
    clearInterval(this._intervalForAlertMessage);
  }

}
