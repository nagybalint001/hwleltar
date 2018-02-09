import { Injectable } from '@angular/core';
import { Item } from './item';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class ItemService {
  private itemsUrl = 'http://localhost:5000'

  constructor(
    private http: HttpClient) { }

  queryUrl(base:string, params):string{
    base += '?' + Object.keys(params).map(x => x+"="+params[x]).join('&');
    return base;
  }

  getItems(params) : Observable<Item[]> {
    return this.http.get<Item[]>(this.queryUrl(this.itemsUrl, params))
      .pipe(
        catchError(this.handleError('getItems', []))
      );
  }

  getItem(id: number): Observable<Item> {
    const url = `${this.itemsUrl}/${id}`;
    return this.http.get<Item>(url).pipe(
      catchError(this.handleError<Item>(`getItem id=${id}`))
    );
  }

  deleteItem(id: number): Observable<Item> {
    const url = `${this.itemsUrl}/${id}`;
    return this.http.delete<Item>(url).pipe(
      catchError(this.handleError<Item>(`deleteItem id=${id}`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
