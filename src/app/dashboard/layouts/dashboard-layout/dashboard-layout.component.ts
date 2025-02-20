import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent implements OnInit {
  private authService = inject(AuthService);

  //public user = computed(() => this.authService.currentUser());
  public users: User[] = [];

  // get user() {
  //   const user = this.authService.currentUser()();
  //   console.log({ usuario: user });
  //   return this.authService.currentUser();
  // }

  get user() {
    return this.authService.getStorageUser();
  }

  constructor() {}

  ngOnInit(): void {
    this.authService.getUsers().subscribe((users) => (this.users = users));
    //this.authService.checkAuthStatus().subscribe((resp) => console.log(resp));
  }

  onLogout() {
    this.authService.logout();
  }
}
