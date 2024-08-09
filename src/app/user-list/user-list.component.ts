import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { UserService } from '../user.service';
import { MultipleUsersResponse, User } from '../models/user.model';
import { UserCardComponent } from '../user-card/user-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [UserCardComponent, RouterOutlet, CommonModule],
})
export class UserListComponent implements OnInit {
  users$!: Observable<User[]>;
  searchResult: User | null = null;
  currentPage: number = 1;
  totalPages!: number;
  private searchTerms = new Subject<string>();
  isSearching: boolean = false;
  private searchSubscription: Subscription | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadUsers(this.currentPage);
    this.setupSearch();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadUsers(page: number) {
    this.users$ = this.userService.getUsers(page).pipe(
      tap((response: MultipleUsersResponse) => {
        this.currentPage = response.page;
        this.totalPages = response.total_pages;
      }),
      map((response: MultipleUsersResponse) => response.data)
    );
  }

  prevPage() {
    this.currentPage--;
    this.loadUsers(this.currentPage);
  }

  nextPage() {
    this.currentPage++;
    this.loadUsers(this.currentPage);
  }

  search(event: Event): void {
    const target = event.target as HTMLInputElement;
    const term = target.value.trim();
    this.isSearching = !!term;
    this.searchTerms.next(term);
  }

  setupSearch(): void {
    this.searchSubscription = this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          if (term) {
            const id = parseInt(term, 10);
            if (!isNaN(id)) {
              console.log('Searching for user with ID:', id); // Debug log
              return this.userService.getUserById(id).pipe(
                tap((user) => console.log('User found:', user)), // Debug log
                catchError((error) => {
                  console.error('Error searching for user:', error); // Debug log
                  return of(null);
                })
              );
            }
          }
          return of(null);
        })
      )
      .subscribe((result) => {
        this.searchResult = result;
        console.log('Search result:', result); // Debug log
      });
  }

  navigateToUserDetails(userId: number) {
    this.router.navigate(['/user', userId]);
  }

  clearSearch(): void {
    this.isSearching = false;
    this.searchResult = null;
    this.searchTerms.next('');
  }
}
