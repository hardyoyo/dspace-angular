import { APP_BASE_HREF, CommonModule, DOCUMENT } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_ID, NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { MetaReducer, StoreModule, USER_PROVIDED_META_REDUCERS } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { DYNAMIC_MATCHER_PROVIDERS } from '@ng-dynamic-forms/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appEffects } from './app.effects';
import { appMetaReducers, debugMetaReducers } from './app.metareducers';
import { appReducers, AppState, storeModuleConfig } from './app.reducer';
import { ClientCookieService } from './core/services/client-cookie.service';
import { NavbarModule } from './navbar/navbar.module';
import { DSpaceRouterStateSerializer } from './shared/ngrx/dspace-router-state-serializer';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { LocaleInterceptor } from './core/locale/locale.interceptor';
import { XsrfInterceptor } from './core/xsrf/xsrf.interceptor';
import { LogInterceptor } from './core/log/log.interceptor';
import { EagerThemesModule } from '../themes/eager-themes.module';
import { APP_CONFIG, AppConfig } from '../config/app-config.interface';
import { StoreDevModules } from '../config/store/devtools';
import { RootModule } from './root.module';
import { models, provideCore } from './core/provide-core';
import { ThemedRootComponent } from './root/themed-root.component';
import { NgxMaskModule } from 'ngx-mask';
import { ListableModule } from './core/shared/listable.module';
import { BROWSE_BY_DECORATOR_MAP } from './browse-by/browse-by-switcher/browse-by-decorator';
import { AUTH_METHOD_FOR_DECORATOR_MAP } from './shared/log-in/methods/log-in.methods-decorator';
import { STARTS_WITH_DECORATOR_MAP } from './shared/starts-with/starts-with-decorator';
import {
  ADVANCED_WORKFLOW_TASK_OPTION_DECORATOR_MAP,
  WORKFLOW_TASK_OPTION_DECORATOR_MAP
} from './shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import {
  METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP
} from './shared/metadata-representation/metadata-representation.decorator';

export function getConfig() {
  return environment;
}

const getBaseHref = (document: Document, appConfig: AppConfig): string => {
  const baseTag = document.querySelector('head > base');
  baseTag.setAttribute('href', `${appConfig.ui.nameSpace}${appConfig.ui.nameSpace.endsWith('/') ? '' : '/'}`);
  return baseTag.getAttribute('href');
};

export function getMetaReducers(appConfig: AppConfig): MetaReducer<AppState>[] {
  return appConfig.debug ? [...appMetaReducers, ...debugMetaReducers] : appMetaReducers;
}

const IMPORTS = [
  CommonModule,
  NavbarModule,
  HttpClientModule,
  AppRoutingModule,
  ScrollToModule.forRoot(),
  NgbModule,
  TranslateModule.forRoot(),
  EffectsModule.forRoot(appEffects),
  StoreModule.forRoot(appReducers, storeModuleConfig),
  StoreRouterConnectingModule.forRoot(),
  StoreDevModules,
  EagerThemesModule,
  RootModule,
  ListableModule.withEntryComponents()
];

const PROVIDERS = [
  {
    provide: APP_BASE_HREF,
    useFactory: getBaseHref,
    deps: [DOCUMENT, APP_CONFIG]
  },
  {
    provide: USER_PROVIDED_META_REDUCERS,
    useFactory: getMetaReducers,
    deps: [APP_CONFIG]
  },
  {
    provide: RouterStateSerializer,
    useClass: DSpaceRouterStateSerializer
  },
  ClientCookieService,
  // register AuthInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  // register LocaleInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LocaleInterceptor,
    multi: true
  },
  // register XsrfInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: XsrfInterceptor,
    multi: true
  },
  // register LogInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LogInterceptor,
    multi: true
  },
  // register the dynamic matcher used by form. MUST be provided by the app module
  ...DYNAMIC_MATCHER_PROVIDERS,
];


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ...IMPORTS,
    NgxMaskModule.forRoot(),
    ThemedRootComponent
  ],
  providers: [
    ...PROVIDERS,
    {provide: APP_ID, useValue: 'dspace-angular'},
    provideCore(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  /* Use models object so all decorators are actually called */
  modelList = models;
  workflowTasks = WORKFLOW_TASK_OPTION_DECORATOR_MAP;
  advancedWorfklowTasks = ADVANCED_WORKFLOW_TASK_OPTION_DECORATOR_MAP;
  metadataRepresentations = METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP;
  startsWithDecoratorMap = STARTS_WITH_DECORATOR_MAP;
  browseByDecoratorMap = BROWSE_BY_DECORATOR_MAP;
  authMethodForDecoratorMap = AUTH_METHOD_FOR_DECORATOR_MAP;
}
