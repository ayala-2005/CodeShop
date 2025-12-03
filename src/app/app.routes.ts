import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Menu } from './menu/menu';
import { NotFound } from './not-found/not-found';
import { ShoppingCart } from './shopping-cart/shopping-cart';
import { ProductDetails } from './product-details/product-details';
import { OrderComplete } from './order-complete/order-complete';
import { About } from './about/about';
import { MyPurchase } from './my-purchase/my-purchase'


export const routes: Routes = [
  { path: 'home-page', component: HomePage },
  { path: '', component: HomePage },
  { path: 'menu', component: Menu },
  { path: 'shopping-cart', component: ShoppingCart },
  { path: 'product-details', component: ProductDetails },
  { path: 'order-complete', component: OrderComplete },
  { path: 'about', component: About },
  { path: 'MyPurchas', component: MyPurchase },
  { path: '**', component: NotFound }
];

