import { HTTP } from '@ionic-native/http/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { WinServicesComponent } from './../win-services/win-services.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Users } from './../models/users.model'
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('recaptcha-container') barChart;

  no_telp: string;
  password: string;
  windowRef: any;
  login_as: string = "1";
  class_item_1: string = "item-default";
  class_item_2: string = "item-default";
  class_item_3: string = "item-default";
  dsb_button: boolean = true;
  id_user : string;
  player_id : string;
  users = {} as Users;

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;




  constructor(public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public firestore : AngularFirestore,
    public loadingCtrl : LoadingController,
    public oneSignal : OneSignal,
    public http : HTTP,
    public storage : Storage,
    public win: WinServicesComponent, public navCtrl: NavController,
    public toastController: ToastController) {
    this.windowRef = this.win.windowRef;
  }

  ngOnInit() {
    this.oneSignal.getIds().then((id) => {
      console.log(id);
      this.player_id = id.userId
      console.log("id : " + this.player_id)
    });

    //  this.initRechaptcha();
  }

  itemClick(id) {

    console.log("item  : " + id)
    if (id == 1) {
      this.class_item_1 = "item-clicked";
      this.class_item_2 = "item-default";
      this.class_item_3 = "item-default";
    }

    if (id == 2) {
      this.class_item_2 = "item-clicked";
      this.class_item_1 = "item-default";
      this.class_item_3 = "item-default";
    }

    if (id == 3) {
      this.class_item_3 = "item-clicked";
      this.class_item_2 = "item-default";
      this.class_item_1 = "item-default";
    }
  }
  async ionViewWillEnter() {
    this.recaptchaVerifier = await new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  async loginVerif() {
    if (this.no_telp == null) {
      const toast = await this.toastController.create({
        message: "Phone number cannot be blank.",
        duration: 2000,
        color: "success"
      });
      toast.present();
    } else {
      this.loginClicked();
    }
  }
  async loginClicked() {





    let phone_number = "+62" + this.no_telp
    console.log("login clicked")
    console.log("phone number : " + this.no_telp)
    try {
      await this.afAuth.signInWithPhoneNumber(phone_number, this.recaptchaVerifier).then(async (confirmationResult) => {

        let prompt = await this.alertCtrl.create({
          message: 'A confirmation code has been sent to ' + phone_number,
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
          buttons: [
            {
              text: 'Cancel',
              handler: data => { console.log('Cancel clicked'); }
            },
            {
              text: 'Send',
              handler: data => {
                confirmationResult.confirm(data.confirmationCode)
                  .then( (result)=> {
                    // User signed in successfully.
                    console.log(result.user);


                    if (result.user.getIdToken) {
                      this.id_user = result.user.uid
                      this.login();
                    }
                    // ...
                  }).catch( (error)=> {

                    this.gagal_login();

                  });
              }
            }
          ]
        });
        await prompt.present();
      });
    } catch (e) {
      console.log("af err" + e)

      const toast = await this.toastController.create({
        message: "This phone number is : " + e.message,
        duration: 2000,
        color: "danger"
      });

      toast.present();


    }
  }

  async login() {
    const toast_berhasil = await this.toastController.create({
      message: "Success login.",
      duration: 2000,
      color: "success"
    });

    const loading = await this.loadingCtrl.create({

    });
    this.storage.set("no_telp", this.no_telp)
    this.storage.set("is_admin", this.login_as)
    this.storage.set("uid", this.id_user)

    loading.present();

    await this.firestore.collection("users").add({
      "no_telp" :  "+62" + this.no_telp,
      "player_id" : this.player_id,
      "is_admin" : this.login_as,
      "uid" : this.id_user,
      "created_at" : new Date().toISOString()
    }).then(result=>{

  

      console.log(result)
      toast_berhasil.present();
      loading.dismiss();
      this.navCtrl.navigateRoot("home");
    });

  

  }

  async gagal_login(){
    
    const toast_gagal = await this.toastController.create({
      message: "Verification Code is incorrect.",
      duration: 2000,
      color: "danger"
    });

    toast_gagal.present();

  }

    

  

}
