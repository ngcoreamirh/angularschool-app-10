import { HttpErrorResponse } from "@angular/common/http";
import { AlertMessageComponent } from "../components/shared/alert-message/alert-message.component";
import { APP_CONFIG } from "./app-config";

export class APP_FUNCTIONS {
    public static handleError(_error: HttpErrorResponse, _AlertMessageComponent: AlertMessageComponent, _callBack?: () => void) {
        let message = _error.status == 0 ? APP_CONFIG.CONNECTION_FAILED_MESSAGE : _error.error.message;
        _AlertMessageComponent.showAlertMessage(message, "red");
        _callBack ? _callBack() : null;
    }

    public static isTextEmpty(_text: string): boolean {
        return _text === null || _text === undefined || _text.match(/^ *$/) !== null;
    }
}