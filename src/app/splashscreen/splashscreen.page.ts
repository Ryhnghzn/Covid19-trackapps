import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {
  splash = true;
  isHidden: boolean = false;
  user_id : number;
  constructor(public navCtrl : NavController) { }

  ngOnInit() {
    setTimeout(() => {
      this.splash = false;
    //this.router.navigate(['login'])
     //  this.router.navigateByUrl('/login')
    
     this.navCtrl.navigateRoot('/login')

      console.log('Splash Ended')
    }
      , 2000);
  }

}
