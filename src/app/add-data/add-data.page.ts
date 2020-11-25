import { HTTP } from '@ionic-native/http/ngx';
import { Post } from './../models/post.model';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
import { ToastController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.page.html',
  styleUrls: ['./add-data.page.scss'],
})
export class AddDataPage implements OnInit {


  post = {} as Post;
  uid: string;
  image1: any;
  blob_image1: any;
  items: any = [];

  constructor(public firestore: AngularFirestore,
    public navCtrl: NavController,
    public router: Router,
    public camera: Camera,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public http: HTTP) { }

  ngOnInit() {
    this.getStorage();

  }

  getStorage() {
    this.storage.get('uid').then((val) => {
      console.log('uid' + val)
      this.post.uid = val
      this.post.created_at = new Date().toISOString();
    });
  }

  async submitClicked() {
    console.log("submit data")

    if (!this.post.name) {
      const toast = await this.toastController.create({
        message: "Name cannot be blank.",
        duration: 1000,
        color: "danger"
      });
      toast.present();
    } else if (!this.post.age) {
      const toast = await this.toastController.create({
        message: "Age cannot be blank.",
        duration: 1000,
        color: "danger"
      });
      toast.present();
    } else if (!this.post.gender) {
      const toast = await this.toastController.create({
        message: "Gender cannot be blank.",
        duration: 1000,
        color: "danger"
      });
      toast.present();

    } else if (!this.post.location) {
      const toast = await this.toastController.create({
        message: "Location cannot be blank.",
        duration: 1000,
        color: "danger"
      });
      toast.present();

    } else {

      let alert = await this.alertCtrl.create({
        header: 'Confirm Add',
        message: 'Add this data?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ya',
            handler: () => {
              this.addData();
            }
          }
        ]
      });

      alert.present();

    }


  }

  async addData() {
    console.log("add data")


    let loading = await this.loadingCtrl.create({
      message: 'Adding data..',
      spinner: 'dots'
    });
    loading.present();

    try {
      await this.firestore.collection("posts").add(this.post).then(result => {
        console.log(result)
        loading.dismiss();
        if (result) {
          this.getAdmindata();

        }

      });
    } catch (e) {
      loading.dismiss();

      console.log(e)
      const toast = await this.toastController.create({
        message: "Something went wrong.",
        duration: 1000,
        color: "danger"
      });
      toast.present();
    }

  }

  async getAdmindata() {
    console.log("admin data")
    const toast = await this.toastController.create({
      message: "Successfully added data.",
      duration: 1000,
      color: "success"
    });
    var admin = this.firestore.collection("users", ref => ref.where("is_admin", "==", "1")).valueChanges().subscribe(data => {
      console.log(data.length)
      this.items = data;
      console.log(this.items)
      for (let item of this.items) {
  
        this.sendPushnotification(item.player_id)
      }
    })
   

    toast.present();
    this.navCtrl.back();

  }

  async sendPushnotification(player_id) {
    console.log("push notif : " + player_id)
    let loading = await this.loadingCtrl.create({
      spinner: 'dots'
    });
    this.http.setDataSerializer("utf8");

    try {
      loading.present();

      let type = 'application/json';
      // let headers = new Headers()
      let body = {
        "app_id": "ad66d82f-c0a0-46d8-b94a-95fb519d8da1",
        "headings": { "en": "New data added." },
        "contents": { "en": this.post.name + " has been added." },
        "include_player_ids": [player_id],
        "small_icon": "ic_notification_icon",
        "android_accent_color": "009291",
        "large_icon": "ic_notification_icon",
        "android_background_layout": "009291"
      };
      //console.log(JSON.stringify(body))
      let body2 = JSON.parse(JSON.stringify(body))
      console.log(body2)
      let headers = new Headers({
        'Content-Type': type, 'X-Requested-With': '*'
      })

      let url = 'https://onesignal.com/api/v1/notifications'
      this.http.post(url,
        JSON.stringify(body)
        , {
          "Authorization": "Basic NDc3MmM3MjctMjI4MC00Y2JmLTkwNzMtZjJjMDNhYzFmZWIy",
          "Content-Type": "application/json"
        })
        .then(res => {
          console.log(res)

          loading.dismiss();
          res.data = JSON.parse(res.data)
          // this.navCtrl.setRoot(MainMenuPage, {data:this.items})
          // res.data = res.data.member_name



        })
        .catch(err => {
          console.log(err)
          loading.dismiss();

        })


    } catch {

      loading.dismiss();
      alert('Periksa Koneksi Internet')

    }

  }

  test(){
    this.getAdmindata();
  }

  cameraClick() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log(imageData);
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.image1 = base64Image;
      this.blob_image1 = imageData;
      this.post.image = imageData;
    }, (err) => {
      // Handle error
      console.log(err);
    });


  }
}
