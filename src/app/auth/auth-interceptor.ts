// this interceptor is provided by angular httpclient
// this just works like a middleware thing

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

// Note: don't use providedIn like other service
// http expects it to set little differently
// see app.module file
// we can multiple interceptors
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    // clone the request before send it back
    // because it's of ref type

    const authRequest = req.clone({
      // authorization case doesn't matter
      headers: req.headers.set('Authorization', "Bearer " + authToken)
    });

    return next.handle(authRequest);
  }
}
