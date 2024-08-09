import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';

export const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'user/:id', component: UserDetailsComponent },
];
