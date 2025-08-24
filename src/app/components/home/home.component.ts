import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChurchService } from '../../services/church.service';
import { Church } from '../../models/church.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  totalChurches = 0;
  totalDenominations = 0;
  totalCities = 0;
  recentChurches: Church[] = [];
  featured: Church[] = [];

  constructor(private churchService: ChurchService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    const churches = this.churchService.getApprovedChurches();
    this.totalChurches = churches.length;
    this.totalDenominations = this.churchService.getDenominations().length;
    this.totalCities = this.churchService.getCities().length;
    this.recentChurches = churches
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 6);
    this.featured = this.churchService.getFeaturedChurches();
  }
}
