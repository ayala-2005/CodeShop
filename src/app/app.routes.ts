import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Menu } from './menu/menu';
import { NotFound } from './not-found/not-found';
import { ShoppingCart } from './shopping-cart/shopping-cart';

export const routes: Routes = [
  { path: 'home-page', component: HomePage },
  { path: '', component: HomePage },
  { path: 'menu', component: Menu },
  { path: 'shopping-cart', component: ShoppingCart },
  { path: '**', component: NotFound }
];

