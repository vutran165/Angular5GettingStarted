import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero';
import {HEROES} from '../mock-heroes';
import {HeroService} from "../hero.service";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})


export class HeroesComponent implements OnInit {

  // hero: Hero = {
  //   id: 1,
  //   name: 'Tony Vu'
  // };

  // heroes = HEROES;  
  heroes : Hero[];

  //using routerLink
  // selectedHero: Hero;

  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  // }

  //original
  // getHeroes(): void {
  //   this.heroes = this.heroService.getHeroes();
  // }

  //the function with Observable
  getHeroes(): void{
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

}
