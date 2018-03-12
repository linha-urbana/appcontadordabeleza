
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SplashPage } from '../pages/splash/splash';
// import { SigninPage } from '../pages/signin/signin';
// import { SignupPage } from '../pages/signup/signup';
// import { ResetPasswordPage } from '../pages/reset-password/reset-password';
// import { CategoryPage } from '../pages/category/category';
// import { ListDocumentsPage } from '../pages/list-documents/list-documents';
// import { NewsPage } from './../pages/news/news';
// import { ContactPage } from '../pages/contact/contact';
// import { ProfilePage } from '../pages/profile/profile';
// import { TermsPage } from '../pages/terms/terms';
// import { EditProfilePage } from '../pages/edit-profile/edit-profile';

import { ProfilePageModule } from './../pages/profile/profile.module';
import { CategoryPageModule } from './../pages/category/category.module';
import { ContactPageModule } from '../pages/contact/contact.module';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { ListDocumentsPageModule } from '../pages/list-documents/list-documents.module';
import { NewsPageModule } from '../pages/news/news.module';
import { ResetPasswordPageModule } from '../pages/reset-password/reset-password.module';
import { SigninPageModule } from '../pages/signin/signin.module';
import { SignupPageModule } from '../pages/signup/signup.module';
import { TermsPageModule } from '../pages/terms/terms.module';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UsuarioServiceProvider } from '../providers/usuario-service/usuario-service';
import { DocumentoServiceProvider } from '../providers/documento-service/documento-service';
import { AppServiceProvider } from '../providers/app-service/app-service';
import { InputMaskProvider } from '../providers/input-mask/input-mask';
import { WebServiceProvider } from '../providers/web-service/web-service';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Push } from '@ionic-native/push';
import { MessagePushPageModule } from '../pages/message-push/message-push.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SplashPage,
    // SigninPage,
    // SignupPage,
    // ResetPasswordPage,
    // CategoryPage,
    // ListDocumentsPage,
    // ContactPage,
    // NewsPage,
    // ProfilePage,
    // TermsPage,
    // EditProfilePage,
    InputMaskProvider
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp),

    CategoryPageModule,
    ContactPageModule,
    EditProfilePageModule,
    ListDocumentsPageModule,
    NewsPageModule,
    ProfilePageModule,
    ResetPasswordPageModule,
    SigninPageModule,
    SignupPageModule,
    TermsPageModule,
    MessagePushPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SplashPage,
    // SigninPage,
    // SignupPage,
    // ResetPasswordPage,
    // CategoryPage,
    // ListDocumentsPage,
    // ContactPage,
    // NewsPage,
    // ProfilePage,
    // TermsPage,
    // EditProfilePage
  ],
  providers: [
    HttpClientModule,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    UsuarioServiceProvider,
    DocumentoServiceProvider,
    SocialSharing,
    AppServiceProvider,
    WebServiceProvider,
    Push
  ]
})
export class AppModule {}
