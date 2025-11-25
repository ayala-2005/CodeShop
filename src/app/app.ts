import { Component, signal, ElementRef, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('foodShope');
  protected activeLink = signal<string>('home');
  
  private elementRef = inject(ElementRef);
  private router = inject(Router);

  ngOnInit() {
    // Set initial active link based on current route
    this.updateActiveLinkFromRoute();

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveLinkFromRoute();
      });
  }

  updateActiveLinkFromRoute() {
    const currentRoute = this.router.url;
    if (currentRoute.includes('home-page')) {
      this.activeLink.set('home');
    } else if (currentRoute.includes('products')) {
      this.activeLink.set('products');
    } else if (currentRoute.includes('about')) {
      this.activeLink.set('about');
    }
  }

  setActive(link: string, event: MouseEvent) {
    this.activeLink.set(link);
    
    // Move the light element
    const target = event.currentTarget as HTMLElement;
    const light = this.elementRef.nativeElement.querySelector('.nav__light');
    
    if (light && target) {
      const navLinks = this.elementRef.nativeElement.querySelector('.nav__links');
      const targetRect = target.getBoundingClientRect();
      const navRect = navLinks.getBoundingClientRect();
      
      // Calculate position from the right for RTL
      const positionFromRight = navRect.right - targetRect.right;
      const centerOffset = (targetRect.width - light.offsetWidth) / 2;
      
      light.style.right = `${positionFromRight + centerOffset}px`;
      light.style.left = 'auto';
    }
  }
}