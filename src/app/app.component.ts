import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StorageService } from '@app/services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.seedIfNeeded();
  }
}