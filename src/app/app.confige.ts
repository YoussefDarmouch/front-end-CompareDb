import { ApplicationConfig } from "@angular/core";
import { Provider } from "@angular/core";
import { provideRouter } from '@angular/router'
import {routes} from './app.routes'
import { withFetch } from "@angular/common/http";
import {provideHttpClient} from "@angular/common/http"



export const appconfige:ApplicationConfig= {
  providers:[provideRouter(routes),
    provideHttpClient(withFetch())

  ]
  
}
