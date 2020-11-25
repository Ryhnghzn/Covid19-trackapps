import { HTTP } from '@ionic-native/http/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model'
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-details-data',
  templateUrl: './details-data.page.html',
  styleUrls: ['./details-data.page.scss'],
})
export class DetailsDataPage implements OnInit {

  data: any;
  id: string;
  post = {} as Post;
  items: any = [];
  uid: string;
  image1: any;
  blob_image1: any;
  constructor(public router: Router,
    public camera: Camera,
    public http : HTTP,
    public navCtrl : NavController,
    public loadingCtrl: LoadingController,
    public toastController : ToastController,
    public alertCtrl : AlertController,
    public route: ActivatedRoute, public firestore: AngularFirestore) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params && params.data) {
        this.data = JSON.parse(params.data);
        this.id = this.data.id
        console.log("id : " + this.id)
      }
    });

  }

  ionViewDidEnter() {
    this.getData();
  }





  async getData() {
    console.log("Update Clicked")
    let loading = await this.loadingCtrl.create({
      message: 'Getting data...',
      spinner: 'dots'
    });
    loading.present();
    var test = this.firestore.doc("posts/" + this.id).valueChanges().subscribe(result => {
      console.log(result)
      this.items = result;
      if (this.items) {
        loading.dismiss();
        this.parseData();
      }
    });
  }

  async updateClicked(){
    console.log("update data")

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
        header: 'Confirm Update',
        message: 'Update this data?',
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
              this.updateData();
            }
          }
        ]
      });

      alert.present();

    }
  }

  async updateData(){
    console.log("update data")


    let loading = await this.loadingCtrl.create({
      message: 'Adding data..',
      spinner: 'dots'
    });
    loading.present();

    try {
      await this.firestore.doc("posts/" + this.id).update(this.post).then(result => {
        console.log("res " +result)
        loading.dismiss();
      
      });
      this.getAdmindata();
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

    this.navCtrl.back();


  }

  parseData() {
    console.log("parsing data...")
    if (this.items.image) {
      this.image1 = 'data:image/jpeg;base64,' + this.items.image
      this.post.image = this.items.image;

    }
    this.post.name = this.items.name;
    this.post.address = this.items.address;
    this.post.age = this.items.age;
    this.post.gender = this.items.gender;
    this.post.location = this.items.location;
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

  async getAdmindata() {
    const toast = await this.toastController.create({
      message: "Successfully updated data.",
      duration: 1000,
      color: "success"
    });
    var admin = this.firestore.collection("users", ref => ref.where("is_admin", "==", "1")).valueChanges().subscribe(data => {
      console.log(data)
      console.log(data.length)
      this.items = data;
      for (let item of this.items) {
  
        this.sendPushnotification(item.player_id)
      }
    })
    
    toast.present();
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
        "headings": { "en": "Updated a data." },
        "contents": { "en": this.post.name + " has been updated." },
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



}
