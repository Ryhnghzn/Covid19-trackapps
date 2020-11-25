import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('pieChart') pieChart;

  is_admin: string;
  no_telp: string;
  items: any;
  today_date: any = new Date().toISOString();
  count_data1: number = 0;
  count_data2: number = 0;
  chart1: any;
  uid: string;

  constructor(public storage: Storage,
    public loadingCtrl: LoadingController,
    public router: Router, public firestore: AngularFirestore, public alertCtrl: AlertController) {


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
    this.getCountdata();
  }

  infoClick(){
    if(this.is_admin == "1"){
      alert("You are currently login as an Admin" + 
      " \n This apps is for test only" + 
      " \n App Created by : Muhammad Reyhan Ghozian")

    } else {
      alert("You are currently login as an User" + 
      " \n This apps is for test only" + 
      " \n Apps Created by : Muhammad Reyhan Ghozian")
    }
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

  testData(id) {
    // console.log(id)
    // var db = this.firestore.doc("posts/" + id).valueChanges().subscribe(data => {
    //   console.log(data)
    // })


    var test = this.firestore.collection("posts", ref => ref.where("name", "==", "re")).valueChanges().subscribe(data => {
      console.log(data)
      console.log(data.length)
    })

    //var db2 = db.get();

    // var query = db.where("name","==","rey")
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.items = null;


    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
      //this.getMobileMenu();
      this.getStorage();

    }, 1000);
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
      await this.firestore.collection("posts", ref => ref.limit(3))
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
      await this.firestore.collection("posts", ref => ref.where("uid", "==", this.uid).limit(3))
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

  getCountdata() {
    var count_data1 = this.firestore.collection("posts", ref => ref.where("location", "==", "jakarta")).valueChanges().subscribe(data => {
      console.log(data)
      console.log(data.length)
      this.count_data1 = data.length
    });

    var count_data2 = this.firestore.collection("posts", ref => ref.where("location", "==", "bekasi")).valueChanges().subscribe(data => {
      console.log(data)
      console.log(data.length)
      this.count_data2 = data.length
      this.generateChart();

    });

    var count_data2 = this.firestore.collection("posts", ref => ref.where("location", "==", "bekasi")).valueChanges().subscribe(data => {
      console.log(data)
      console.log(data.length)
      this.count_data2 = data.length
      this.generateChart();

    });
  }

  generateChart() {
    console.log("generate chart")
    let data = [this.count_data1, this.count_data2];
    console.log(data)
    let label = ['Jakarta', 'Bekasi'];
    this.chart1 = new Chart(this.pieChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: label,
        datasets: [{
          label: 'Covid 19 Cases',
          data: data,
          backgroundColor: ['#ddf3f5', '#faf0af', '#ccf6c8', '#e36387'], // array should have same number of elements as number of dataset
          borderColor: ['#6dd5ed', '#FDC830', '#38ef7d', '#c31432'],// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      }
    });
  }


  addDataClicked() {
    this.router.navigateByUrl('add-data')
  }
}
