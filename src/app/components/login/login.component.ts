import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;
  submitted = false;
  showPassword = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/)
        ]
      ],
      rememberMe: [true]
    });

    // Se já estiver logado, redireciona
    if (this.auth.isLoggedIn()) {
      const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/';
      this.router.navigate([redirect]);
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  fillDemo(): void {
    this.form.patchValue({ email: 'admin@example.com', password: 'Admin123!' });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.form.invalid) return;
    const { email, password, rememberMe } = this.form.value;
    this.auth.login(email, password, rememberMe).subscribe(res => {
      if (res.success) {
        const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/';
        this.router.navigate([redirect]);
      } else {
        this.errorMessage = res.error || 'Não foi possível entrar.';
      }
    });
  }
}


