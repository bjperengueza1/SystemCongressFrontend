import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit, OnDestroy{

  loggedIn = false;
  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    // Suscribirse al estado del usuario
    this.userSubscription = this.authService.currentUser$.subscribe(
      (user) => {
        this.loggedIn = !!user; // Si hay un usuario, loggedIn será true
      }
    );
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async logout() {
    this.authService.logout();
    await this.router.navigate(['admin/login']);
  }


}
