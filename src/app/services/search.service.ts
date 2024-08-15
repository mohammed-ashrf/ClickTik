import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'https://dummyjson.com/products/search?q=';
  private searchQuery = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuery.asObservable();

  constructor(private http: HttpClient){}

  setSearchQuery(query: string): void {
    this.searchQuery.next(query);
  }

  searchProducts(query: string, page: number, pageSize: number, sortBy: string = 'title', sortOrder: 'asc' | 'desc' = 'asc'): Observable<any> {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString())
      .set('select', 'title,price,discountPercentage,description,brand,category,stock,rating,thumbnail,reviews');
    return this.http.get(`${this.apiUrl}${query}&sortBy=${sortBy}&order=${sortOrder}`, { params }).pipe(
      catchError(error => {
        console.error('Error during getting user:', error);
        return  error;
      })
    );
  }
}
