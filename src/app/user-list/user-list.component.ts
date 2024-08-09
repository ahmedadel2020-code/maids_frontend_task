import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { NgProgress, NgProgressModule, NgProgressRef } from 'ngx-progressbar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [UserCardComponent, RouterOutlet, CommonModule, NgProgressModule],
})
export class UserListComponent implements OnInit {
  users$!: Observable<User[]>;
  searchResult: User | null = null;
  currentPage: number = 1;
  totalPages!: number;
  searchTerms = new Subject<string>();
  isSearching: boolean = false;
  searchSubscription: Subscription | null = null;
  progressRef!: NgProgressRef;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private router: Router,
    private progress: NgProgress
  ) {}

  ngOnInit() {
    this.progressRef = this.progress.ref('myProgress');
    this.loadUsers(this.currentPage);
    this.setupSearch();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadUsers(page: number) {
    this.progressRef.start();
    this.users$ = this.userService.getUsers(page).pipe(
      tap((response: MultipleUsersResponse) => {
        this.currentPage = response.page;
        this.totalPages = response.total_pages;
        this.progressRef.complete();
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
              this.progressRef.start();

              return this.userService.getUserById(id).pipe(
                tap({
                  complete: () => {
                    this.progressRef.complete();
                  },
                }),
                catchError((error) => {
                  this.progressRef.complete();
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
      });
  }

  navigateToUserDetails(userId: number) {
    this.router.navigate(['/user', userId]);
  }

  clearSearch(): void {
    this.isSearching = false;
    this.searchResult = null;
    this.searchTerms.next('');
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }
}
