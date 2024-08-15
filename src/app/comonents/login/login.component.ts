import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { LoginRequest } from 'src/app/services/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
      if (this.loginService.isAuthenticated()) {
        console.log('isauthenticated');
        this.router.navigate(['/home']);
      }
  }
  onLogin() {
    if(this.loginForm) {
      const {username, password} = this.loginForm.value;
      const requestData: LoginRequest = {
        username: username,
        password: password,
        expiresInMins: 60
      }
      this.loginService.login(requestData).subscribe({
        next: response => {
          window.localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
        },
        error: error => {
          window.alert(`Login failed ${error}`);
        }
      })
    }
  }
}
