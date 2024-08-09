import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  MultipleUsersResponse,
  SingleUserResponse,
  User,
} from './models/user.model';
import { withCache } from '@ngneat/cashew';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) {}

  getUsers(page: number): Observable<MultipleUsersResponse> {
    return this.http.get<MultipleUsersResponse>(`${this.apiUrl}?page=${page}`, {
      context: withCache(),
    });
  }

  getUserById(id: number): Observable<User> {
    return this.http
      .get<SingleUserResponse>(`${this.apiUrl}/${id}`, {
        context: withCache(),
      })
      .pipe(map((response) => response.data));
  }
}
