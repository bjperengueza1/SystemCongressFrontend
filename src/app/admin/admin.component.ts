import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavComponent} from '../components/nav/nav.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NavComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
