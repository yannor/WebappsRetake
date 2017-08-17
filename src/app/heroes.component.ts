import { Component, OnInit } from '@angular/core';
import { Hero } from './hero';
import { HeroService } from './hero.service';
import { Router } from '@angular/router';



@Component({
  selector: 'my-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})


export class HeroesComponent implements OnInit {

  heroes: Hero[];
  selectedHero: Hero;

  constructor(
    private heroService: HeroService,
    private router: Router) { }

    // replace getHeroes with getHeroesSlowly to see how it has some loading
  getHeroes(): void {
    this.heroService.getHeroes().then(heroes => this.heroes = heroes);
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
    
  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedHero.id]);
  }
    
    add(heroName: String): void
    {
        heroName = heroName.trim();
        if (!heroName) { return; }
        
        this.heroService.create(heroName)
            .then(hero => {
                this.heroes.push(hero);
                this.selectedHero = null;
        });
    }
    
    delete(hero: Hero): void {
        this.heroService
            .delete(hero.id)
            .then(() => {
                this.heroes = this.heroes.filter(h => h !== hero);
                if (this.selectedHero === hero) 
                { 
                    this.selectedHero = null; 
                }
            });
    }
}






