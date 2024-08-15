import { Component,OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { ProductsService } from 'src/app/services/products.service';
import { LoginService } from 'src/app/services/login.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartItems: number = 0;
  searchQuery: string = '';
  isAuth: boolean = false;
  private authSubscription: Subscription = new Subscription();

  constructor(private searchService: SearchService, private productsService: ProductsService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.authSubscription.add(
      this.loginService.getAuthStatus().subscribe(isAuthenticated => {
        this.isAuth = isAuthenticated;
      })
    );
    this.productsService.numberOfProducts$.subscribe(
      (cartItems) => {
        this.cartItems = cartItems;
      }
    );
  }
  onSearch(): void {
    this.searchService.setSearchQuery(this.searchQuery);
  }

  isAuthenticated(): void {
    this.loginService.isAuthenticated().subscribe(
      isAuthenticated => {
        this.isAuth = isAuthenticated;
        console.log('Authenticated:', this.isAuth);
      },
      error => {
        console.error('Error checking authentication:', error);
        this.isAuth = false; // Handle error scenario
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
