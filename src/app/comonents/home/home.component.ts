import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
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
  selectedCategory: string | null = 'smartphones';
  pageNumbers: (number | string)[] = [];

  constructor(private productsService: ProductsService){}

  ngOnInit(): void {
    this.getCategoryList();
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.selectedCategory) {
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
}
