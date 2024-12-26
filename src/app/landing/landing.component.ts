import { Component } from '@angular/core';
import {NavComponent} from "../components/nav/nav.component";

@Component({
  selector: 'app-landing',
  standalone: true,
    imports: [
        NavComponent
    ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
