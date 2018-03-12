import { Injectable } from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import { error } from 'protractor';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()

export class HeroService {




  getHero(id: number): Observable<Hero>
  {
    // Todo: send the message _after_ fetching the heroes
    const url = '${this.heroesUrl}/${id}';
    
    // this.messageService.add('HeroService: fetched hero id=${id}');
    // return of(HEROES.find(hero => hero.id === id));
    return this.http.get<Hero>(url).pipe(tap(_ => this.log('fetched hero id=${id}')),
      catchError(this.handleError<Hero>('getHero id=${id}')));
  }
  

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
   // Todo: send the message _after_ fetching the heroes
   //this.messageService.add('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(heroes => this.log('fetched heroes')),
    catchError(this.handleError('getHeroes',[]))  
  );
  }

  private handleError<T> (operation = 'operation', result?: T)
  {
     return (error: any): Observable<T>=> {

      console.error(error);

      this.log('${operation} failed: ${error.message}');
      
      return of(result as T);
     }
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  private log(message: string)
  {
    this.messageService.add('HeroService:' + message);
  }

  private heroesUrl = 'api/heroes';

  

  updateHero (hero: Hero): Observable<any> {
    
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  };
  
    /** POST: add a new hero to the server */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  };

  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ?hero : hero.id;
    const url = '${this.heroesUrl}/${id}';
    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log('delete hero id=${id}')),catchError(this.handleError<Hero>('deleteHero'))
    )
  };


  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim())
    {
      // if not search term, return empty hero array.  
      return of([]);
    }

    return this.http.get<Hero[]>('api/heroes/?name=${term}').pipe(
      tap(_ => this.log('found heroes matching "${term}"')),catchError(this.handleError<Hero[]>('searchHeroes',[]))
    )
  }

   /** GET hero by id. Return `undefined` when id not found */
   getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

}
