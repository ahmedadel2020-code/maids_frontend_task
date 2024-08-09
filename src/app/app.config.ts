import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([withHttpCacheInterceptor()])),
    provideHttpCache(),
  ],
};
