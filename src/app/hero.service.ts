import { Injectable } from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import { error } from 'protractor';

@Injectable()

export class HeroService {

  getHero(id: number): Observable<Hero>
  {
    // Todo: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched hero id=${id}');
    return of(HEROES.find(hero => hero.id === id));
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

  private heroesUrl = 'api/heroes'
}
