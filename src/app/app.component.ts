import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  
  signal_app_id: string = 'ad66d82f-c0a0-46d8-b94a-95fb519d8da1';
  firebase_id: string = '82880125770';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public oneSignal : OneSignal
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.loadOnesignal();

    });
  }

  loadOnesignal() {


    this.oneSignal.startInit(this.signal_app_id, this.firebase_id);

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
    });

    this.oneSignal.endInit();

    this.oneSignal.getIds().then((id) => {
      console.log(id);
      console.log("id : " + id.userId)
    });
  }

}
