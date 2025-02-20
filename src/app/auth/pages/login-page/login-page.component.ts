import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  //constructor(private fb: FormBuilder){}
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    email: ['adrian@mail.com', [Validators.required, Validators.email]],
    password: ['Abc123', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    console.log(this.myForm.value);
    const { email, password } = this.myForm.value;

    this.authService.login(email, password).subscribe({
      next: (resp) => {
        console.log(`Todo bien... ${resp}`),
          this.router.navigateByUrl('dashboard');
      },
      error: (message) => {
        Swal.fire('Error', message, 'error');
      },
    });
  }
}
