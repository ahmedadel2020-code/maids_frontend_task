import { Component, Input } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  standalone: true,
})
export class UserCardComponent {
  @Input() user!: User;
}
