import { Component } from '@angular/core';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss']
})
export class TipsComponent {

  constructor() { }

  openModal() {
    document.getElementById('modal-container').style.display = "block";
    document.getElementById('modal').style.display = "block";
  }

  closeModal() {
    document.getElementById('modal-container').style.display = "none";
    document.getElementById('modal').style.display = "none";
  }

}
