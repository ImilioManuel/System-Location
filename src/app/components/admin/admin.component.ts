import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChurchService } from '../../services/church.service';
import { Church } from '../../models/church.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Administração</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card p-4">
          <h2 class="text-lg font-semibold mb-3">Aprovar Cadastros</h2>
          @if (pending.length > 0) {
            <div class="space-y-3">
              @for (c of pending; track c.id) {
                <div class="border rounded p-3 flex items-start justify-between">
                  <div>
                    <div class="font-medium">{{ c.name }}</div>
                    <div class="text-sm text-gray-600">{{ c.denomination }} • {{ c.city }}, {{ c.state }}</div>
                  </div>
                  <div class="space-x-2">
                    <button class="btn-primary" (click)="approve(c)">Aprovar</button>
                    <button class="px-3 py-2 border rounded" (click)="remove(c)">Remover</button>
                  </div>
                </div>
              }
            </div>
          } @else { <div class="text-sm text-gray-500">Nenhum cadastro pendente</div> }
        </div>

        <div class="card p-4">
          <h2 class="text-lg font-semibold mb-3">Destaques</h2>
          <div class="space-y-3">
            @for (c of approved; track c.id) {
              <div class="border rounded p-3 flex items-start justify-between">
                <div>
                  <div class="font-medium">{{ c.name }}</div>
                  <div class="text-sm text-gray-600">{{ c.denomination }} • {{ c.city }}, {{ c.state }}</div>
                </div>
                <div class="space-x-2">
                  <button class="px-3 py-2 border rounded" [class.bg-yellow-100]="c.featured" (click)="toggleFeatured(c)">
                    {{ c.featured ? 'Destacado' : 'Destacar' }}
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  pending: Church[] = [];
  approved: Church[] = [];

  constructor(private churchService: ChurchService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    const all = this.churchService.getChurchesList();
    this.pending = all.filter(c => !c.approved);
    this.approved = all.filter(c => c.approved);
  }

  approve(c: Church): void {
    if (!c.id) return;
    this.churchService.approveChurch(c.id);
    this.refresh();
  }

  toggleFeatured(c: Church): void {
    if (!c.id) return;
    this.churchService.toggleFeatured(c.id);
    this.refresh();
  }

  remove(c: Church): void {
    if (!c.id) return;
    this.churchService.deleteChurch(c.id);
    this.refresh();
  }
}


