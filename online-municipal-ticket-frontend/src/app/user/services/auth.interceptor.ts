import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    const token = sessionStorage.getItem('token') ?? '';
    request = request.clone({
        setHeaders: {
            token: token ? token : ''
        }
    });

    return next(request);
}