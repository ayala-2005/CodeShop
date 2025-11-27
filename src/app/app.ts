import { Component, signal, ElementRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule, NgIf, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { CodeShopService } from './CodeShopService';
import { Customer } from './models/customer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIf, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('foodShope');
  protected activeLink = signal<string>('home');

  /** האם המשתמש מחובר */
  protected isLoggedIn = signal<boolean>(false);
  
  /** פרטי המשתמש המחובר */
  protected currentUser = signal<Customer | null>(null);

  /** מצבי UI */
  protected showAuthModal = signal<boolean>(false);
  protected showUserMenu = signal<boolean>(false);
  protected loginOrSignup = signal<'login' | 'signup'>('login');

  /** הודעות שגיאה */
  protected errorMessage = signal<string>('');
  protected showError = signal<boolean>(false);

  /** קלטי טופס */
  protected email = '';
  protected phone = '';
  protected name = '';
  protected birthDate = '';

  private elementRef = inject(ElementRef);
  protected router = inject(Router);
  private codeShopService = inject(CodeShopService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          this.currentUser.set(user);
          this.isLoggedIn.set(true);
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
    }

    this.updateActiveLinkFromRoute();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.updateActiveLinkFromRoute());
  }

  updateActiveLinkFromRoute() {
    const currentRoute = this.router.url;
    if (currentRoute.includes('home-page')) this.activeLink.set('home');
    else if (currentRoute.includes('menu')) this.activeLink.set('products');
    else if (currentRoute.includes('about')) this.activeLink.set('about');
  }

  openUserArea() {
    this.showUserMenu.update(v => !v);
  }

  openAuthForm(type: 'login' | 'signup') {
    this.loginOrSignup.set(type);
    this.showAuthModal.set(true);
    this.showUserMenu.set(false);
    this.clearForm();
    this.clearError();
  }

  clearForm() {
    this.email = '';
    this.phone = '';
    this.name = '';
    this.birthDate = '';
  }

  clearError() {
    this.showError.set(false);
    this.errorMessage.set('');
  }

  showErrorMessage(message: string) {
    this.errorMessage.set(message);
    this.showError.set(true);
  }

  /** התחברות אמיתית דרך API */
  loginUser() {
    this.clearError();

    // בדיקת שדות ריקים
    if (!this.email || !this.phone) {
      this.showErrorMessage('אנא מלא/י את כל השדות');
      return;
    }

    // בדיקת פורמט אימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showErrorMessage('כתובת אימייל לא תקינה');
      return;
    }

    this.codeShopService.login(this.email, this.phone).subscribe({
      next: (user: Customer) => {
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
        this.showAuthModal.set(false);
        
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        this.clearForm();
        this.clearError();
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.error?.code === 'USER_NOT_FOUND') {
          this.showErrorMessage('משתמש לא קיים במערכת');
        } else if (err.error?.code === 'WRONG_PHONE') {
          this.showErrorMessage('הטלפון שגוי');
        } else {
          this.showErrorMessage('המייל או הטלפון שגויים');
        }
      }
    });
  }

  /** הרשמה דרך API */
  registerUser() {
    this.clearError();

    // בדיקת שדות חובה
    if (!this.email || !this.phone || !this.name) {
      this.showErrorMessage('אנא מלא/י את כל השדות החובה (אימייל, שם, טלפון)');
      return;
    }

    // בדיקת פורמט אימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showErrorMessage('כתובת אימייל לא תקינה');
      return;
    }

    // בדיקת אורך שם
    if (this.name.length < 2) {
      this.showErrorMessage('השם חייב להכיל לפחות 2 תווים');
      return;
    }

    // בדיקת טלפון
    const phoneRegex = /^0\d{1,2}-?\d{7}$/;
    if (!phoneRegex.test(this.phone)) {
      this.showErrorMessage('מספר טלפון לא תקין');
      return;
    }

    this.codeShopService.register(this.email, this.name, this.phone, this.birthDate).subscribe({
      next: (user: Customer) => {
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
        this.showAuthModal.set(false);
        
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        this.clearForm();
        this.clearError();
      },
      error: (err) => {
        console.error('Register error:', err);
        if (err.status === 400) {
          this.showErrorMessage('המשתמש כבר קיים במערכת');
        } else {
          this.showErrorMessage('ההרשמה נכשלה. אנא נסה/י שוב מאוחר יותר');
        }
      }
    });
  }

  logoutUser() {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.showUserMenu.set(false);
    this.clearForm();
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
  }

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

  closeAuthModal() {
    this.showAuthModal.set(false);
    this.clearError();
  }

  switchAuthForm(event: MouseEvent) {
    event.preventDefault();
    this.loginOrSignup.update(v => v === 'login' ? 'signup' : 'login');
    this.clearError();
  }
  scrollToFooter() {
    const footer = document.querySelector('.footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}