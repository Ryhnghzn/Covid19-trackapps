import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-win-services',
  templateUrl: './win-services.component.html',
  styleUrls: ['./win-services.component.scss'],
})
export class WinServicesComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  get windowRef(){
    return window;
} 

}
