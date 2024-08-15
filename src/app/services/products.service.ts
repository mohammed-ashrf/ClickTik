import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://dummyjson.com/products';
  constructor(private http: HttpClient) { }

  getProducts(page: number, pageSize: number): Observable<any> {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString())
      .set('select', 'title,price,discountPercentage,description,brand,category,stock,rating,thumbnail,reviews'); 
    return this.http.get(this.apiUrl, { params });
  };

  getCategoryList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/category-list`);
  }

  getProductsByCategory(page: number, pageSize: number, category: string): Observable<any> {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString())
      .set('select', 'title,price,discountPercentage,description,brand,category,stock,rating,thumbnail,reviews'); 
    return this.http.get(`${this.apiUrl}/category/${category}`, { params });
  }
}
