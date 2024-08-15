import { Component,OnInit } from '@angular/core';
import { canActivate } from 'src/app/auth.guard';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartItemNumbers: number = 0;
  isAuth = canActivate;
  ngOnInit(): void {
      
  }
}
