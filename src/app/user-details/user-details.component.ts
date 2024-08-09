import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user.model';
import { NgProgress, NgProgressModule, NgProgressRef } from 'ngx-progressbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  standalone: true,
  imports: [NgProgressModule, CommonModule],
})
export class UserDetailsComponent implements OnInit {
  user!: User;
  progressRef!: NgProgressRef;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private progress: NgProgress
  ) {}

  ngOnInit() {
    this.progressRef = this.progress.ref('myProgress');

    this.route.params.subscribe((params) => {
      const userId = +params['id'];
      this.loadUserDetails(userId);
    });
  }

  loadUserDetails(userId: number) {
    this.progressRef.start();
    this.isLoading = true;
    this.userService.getUserById(userId).subscribe((user) => {
      this.user = user;
      this.progressRef.complete();
      this.isLoading = false;
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
