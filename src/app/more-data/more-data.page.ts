import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-more-data',
  templateUrl: './more-data.page.html',
  styleUrls: ['./more-data.page.scss'],
})
export class MoreDataPage implements OnInit {
  is_admin: string;
  no_telp: string;
  items: any;
  count_data1: number = 0;
  count_data2: number = 0;
  uid: string;
  constructor(public storage: Storage,
    public loadingCtrl: LoadingController,
    public router: Router, public firestore: AngularFirestore, public alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getStorage();
  }

  getStorage() {

    this.storage.get('no_telp').then((val) => {
      console.log('no_telp' + val)
      this.no_telp = val
    });

    this.storage.get('uid').then((val) => {
      console.log('uid' + val)
      this.uid = val
    });

    this.storage.get('is_admin').then((val) => {
      console.log('is_admin ' + val)
      this.is_admin = val
      if (this.is_admin == "1") {
        this.getData();
      } else {
        this.getDataUser();
      }
    });
  }
  detailClicked(id) {
    console.log("id " + id)
    let data = {
      id: id
    };
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(data)
      }
    };
    this.router.navigate(['details-data'], navigationExtras);
  }


  async deleteClicked(id) {



    let alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Delete this data?',
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
            this.deleteData(id);
          }
        }
      ]
    });

    alert.present();
  }

  async deleteData(id) {
    console.log(id)
    let loading = await this.loadingCtrl.create({
      message: 'Deleting data...',
      spinner: 'dots'
    });
    loading.present();
    await this.firestore.doc("posts/" + id).delete();
    loading.dismiss();

  }

  async getData() {
    console.log("get all data")
    try {
      await this.firestore.collection("posts", ref => ref.limit(5))
        .snapshotChanges()
        .subscribe(data => {
          this.items = data.map(e => {
            console.log(this.items)
            return {
              id: e.payload.doc.id,
              name: e.payload.doc.data()["name"],
              age: e.payload.doc.data()["age"],
              image: e.payload.doc.data()["image"],
              location : e.payload.doc.data()["location"]

            };
          });
        });

    } catch (e) {
      console.log(e)
    }


  }


  async getDataUser() {
    console.log("get user data")
    try {
      await this.firestore.collection("posts", ref => ref.where("uid", "==", this.uid).limit(5))
        .snapshotChanges()
        .subscribe(data => {
          this.items = data.map(e => {
            console.log(this.items)
            return {
              id: e.payload.doc.id,
              name: e.payload.doc.data()["name"],
              age: e.payload.doc.data()["age"],
              image: e.payload.doc.data()["image"],
              location : e.payload.doc.data()["location"]

            };
          });
        });

    } catch (e) {
      console.log(e)
    }


  }




}
