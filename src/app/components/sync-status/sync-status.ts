import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sync-status',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./sync-status.scss'],
  templateUrl:'./sync-status.html',
})
export class SyncStatusComponent {
  @Input() syncing = false;
}
