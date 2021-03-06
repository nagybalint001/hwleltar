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

  updateItem(id: number, data: Item, succ: Function): Observable<any> {
    const url = `${this.itemsUrl}/${id}`;
    return this.http.put(url, data).pipe(
      tap(_ => succ()),
      catchError(this.handleError<Item>(`updateItem id=${id}`))
    );
  }

  createItem(data: Item, succ: Function): Observable<Item> {
    return this.http.post<Item>(this.itemsUrl, data).pipe(
      tap(_ => succ()),
      catchError(this.handleError<Item>('createItem'))
    );
  }

  getPages(params) : Observable<number> {
    return this.http.get<number>(this.queryUrl(this.itemsUrl + "/pages", params))
      .pipe(
        catchError(this.handleError<number>('getPages'))
      );
  }

  getManufacturers(params) : Observable<string[]> {
    return this.http.get<string[]>(this.queryUrl(this.itemsUrl + "/manufacturers", params))
      .pipe(
        catchError(this.handleError('getManufacturers', []))
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
