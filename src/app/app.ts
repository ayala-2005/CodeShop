import { Component, signal, ElementRef, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('foodShope');
  protected activeLink = signal<string>('home');

  /** האם המשתמש מחובר */
  protected isLoggedIn = signal<boolean>(false);

  /** מצבי UI */
  protected showAuthModal = signal<boolean>(false);       // טופס במרכז המסך
  protected showUserMenu = signal<boolean>(false);        // תפריט משתמש / אפשרות התחברות-הרשמה
  protected showLoginForm = signal<boolean>(false);       // מצביע אם צריך להציג טופס התחברות או הרשמה
  protected loginOrSignup = signal<'login' | 'signup'>('login');

  private elementRef = inject(ElementRef);
  protected router = inject(Router);

  ngOnInit() {
    this.updateActiveLinkFromRoute();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.updateActiveLinkFromRoute());
  }

  updateActiveLinkFromRoute() {
    const currentRoute = this.router.url;
    if (currentRoute.includes('home-page')) this.activeLink.set('home');
    else if (currentRoute.includes('menu')) this.activeLink.set('products');
    else if (currentRoute.includes('about')) this.activeLink.set('about');
  }

  /** לחיצה על אזור אישי */
  openUserArea() {
    if (this.isLoggedIn()) {
      this.showUserMenu.update(v => !v);  // משתמש מחובר → תפריט קטן
    } else {
      this.showUserMenu.update(v => !v);  // משתמש לא מחובר → תפריט התחברות/הרשמה קטן
    }
  }

  /** פתיחת טופס התחברות או הרשמה במרכז המסך */
  openAuthForm(type: 'login' | 'signup') {
    this.loginOrSignup.set(type);
    this.showAuthModal.set(true);
    this.showUserMenu.set(false);  // סוגר את התפריט הקטן
  }

  /** התחברות אמיתית */
  loginUser() {
    this.isLoggedIn.set(true);
    this.showAuthModal.set(false);
  }

  /** התנתקות */
  logoutUser() {
    this.isLoggedIn.set(false);
    this.showUserMenu.set(false);
  }

  /** UI של הניווט */
  setActive(link: string, event: MouseEvent) {
    this.activeLink.set(link);
    const target = event.currentTarget as HTMLElement;
    const light = this.elementRef.nativeElement.querySelector('.nav__light');
    if (light && target) {
      const navLinks = this.elementRef.nativeElement.querySelector('.nav__links');
      const targetRect = target.getBoundingClientRect();
      const navRect = navLinks.getBoundingClientRect();
      const positionFromRight = navRect.right - targetRect.right;
      const centerOffset = (targetRect.width - light.offsetWidth) / 2;
      light.style.right = `${positionFromRight + centerOffset}px`;
      light.style.left = 'auto';
    }
  }

  /** סגירת מודאל עם אנימציה */
closeAuthModal() {
  this.showAuthModal.set(false);
}

/** החלפת טופס בין התחברות להרשמה */
switchAuthForm(event: MouseEvent) {
  event.preventDefault();
  this.loginOrSignup.update(v => v === 'login' ? 'signup' : 'login');
}
}
