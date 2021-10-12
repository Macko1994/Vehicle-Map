import {throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

export class ErrorHandler {

  errorHandler(error: HttpErrorResponse): any {
    return throwError(error.message || "server error.");
  }
}
