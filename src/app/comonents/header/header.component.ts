import { Component,OnInit } from '@angular/core';
import { canActivate } from 'src/app/auth.guard';
import { SearchService } from 'src/app/services/search.service';
import { ProductsService } from 'src/app/services/products.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartItems: number = 0;
  searchQuery: string = '';
  isAuth = canActivate;

  constructor(private searchService: SearchService, private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.numberOfProducts$.subscribe(
      (cartItems) => {
        this.cartItems = cartItems;
      }
    );
  }
  onSearch(): void {
    this.searchService.setSearchQuery(this.searchQuery);
  }
}
