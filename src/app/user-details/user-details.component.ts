import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  user!: User;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const userId = +params['id'];
      this.loadUserDetails(userId);
    });
  }

  loadUserDetails(userId: number) {
    this.userService.getUserById(userId).subscribe((user) => {
      console.log('loadUserDetails', user);
      this.user = user;
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
