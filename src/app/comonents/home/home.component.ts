import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { SearchService } from 'src/app/services/search.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  products: any[] = [];
  currentPage: number = 1;
  pageSize: number = 9;
  totalItems: number = 0;
  categories: any[] = [];
  selectedCategory: string | null = null;
  pageNumbers: (number | string)[] = [];
  searchQuery: string | null = null;
  sortBy: string = 'title';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private productsService: ProductsService,private searchService: SearchService){}

  ngOnInit(): void {
    this.getCategoryList();
    this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
      this.selectedCategory = null;
      this.searchProduct(this.searchQuery);
    });
    this.loadProducts();
    this.productsService.setnumberOfCartProducts(Number(window.localStorage.getItem('cartProducts')));
  }

  loadProducts(): void {
    if (this.searchQuery){
      this.selectedCategory = null;
      this.searchProduct(this.searchQuery);
    } else if (this.selectedCategory) {
      this.productsService.getProductsByCategory(this.currentPage, this.pageSize, this.selectedCategory).subscribe(data => {
        this.products = data.products;
        this.totalItems = data.total;
        this.updatePageNumbers();
      });
    } else {
      this.productsService.getProducts(this.currentPage, this.pageSize).subscribe(data => {
        this.products = data.products;
        this.totalItems = data.total;
        this.updatePageNumbers();
      });
    }
  }

  searchProduct(query: string, sortBy: string = 'title', sortOrder: 'asc' | 'desc' = 'asc') {
    this.searchService.searchProducts(query, this.currentPage, this.pageSize, sortBy, sortOrder).subscribe(
      (data) => {
        this.products = data.products;
        this.totalItems = data.total;
        this.updatePageNumbers();
      }
    );
  }
  onPageChange(page:number | string): void {
    if(typeof page === 'number') {
      if (page < 1 || page > Math.ceil(this.totalItems / this.pageSize)) {
        return;
      }
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getCategoryList() {
    this.productsService.getCategoryList().subscribe(
      (categories)=> {
        this.categories = categories;
      }
    )
  }

  getProductsByCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.searchQuery = null;
    this.loadProducts();
  }

  viewAllProducts(): void {
    this.selectedCategory = null; // Reset category filter
    this.currentPage = 1; // Reset to the first page
    this.loadProducts();
  }

  updatePageNumbers(): void {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pageNumbers = [];
    // Always show the first page
    this.pageNumbers.push(1);
    // Add ellipses if necessary
    if (this.currentPage > 4) {
      this.pageNumbers.push('...');
    }
    // Add pages around the current page
    for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.currentPage + 1, totalPages - 2); i++) {
      this.pageNumbers.push(i);
    }
    // Add ellipses if necessary
    if (this.currentPage < totalPages - 3) {
      this.pageNumbers.push('...');
    }
    if (totalPages > 4) {
      this.pageNumbers.push(totalPages - 1);
    }
    // Always show the last page
    if (totalPages > 1) {
      this.pageNumbers.push(totalPages);
    }
  }

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
  
    const sortBy = selectedValue;
    const sortOrder = 'asc'
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;

    if (this.searchQuery) {
      this.searchProduct(this.searchQuery, this.sortBy, this.sortOrder);
    } else {
      this.loadProducts();
    }
  }

  addTOCart() {
    let cartProducts = window.localStorage.getItem('cartProducts');
    let cartCount = 0;
    if (cartProducts) {
        cartCount = Number(cartProducts);
        cartCount += 1;
    } else {
        cartCount = 1;
    }
    window.localStorage.setItem('cartProducts', cartCount.toString());
    this.productsService.setnumberOfCartProducts(cartCount);
  }
}
