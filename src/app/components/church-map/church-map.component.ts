import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChurchService } from '../../services/church.service';
import { Church } from '../../models/church.model';

declare var L: any;

@Component({
  selector: 'app-church-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Mapa de Igrejas</h1>
        <p class="text-gray-600">Visualize todas as igrejas cadastradas no mapa interativo.</p>
      </div>

      <!-- Filtros -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
          <select [(ngModel)]="selectedCity" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Todas as cidades</option>
            @for (city of cities; track city) {
              <option [value]="city">{{ city }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select [(ngModel)]="selectedState" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Todos os estados</option>
            @for (state of states; track state) {
              <option [value]="state">{{ state }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Denominação</label>
          <select [(ngModel)]="selectedDenomination" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Todas as denominações</option>
            @for (denomination of denominations; track denomination) {
              <option [value]="denomination">{{ denomination }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
          <select [(ngModel)]="sortBy" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="name">Nome</option>
            <option value="distance">Distância</option>
            <option value="denomination">Denominação</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Dia</label>
          <select [(ngModel)]="selectedDay" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Todos</option>
            @for (d of days; track d) { <option [value]="d">{{ d }}</option> }
          </select>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="text-2xl font-bold text-blue-600">{{ filteredChurches.length }}</div>
          <div class="text-blue-800">Igrejas no mapa</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <div class="text-2xl font-bold text-green-600">{{ uniqueDenominations }}</div>
          <div class="text-green-800">Denominações</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-4">
          <div class="text-2xl font-bold text-purple-600">{{ uniqueCities }}</div>
          <div class="text-purple-800">Cidades</div>
        </div>
      </div>

      <!-- Mapa -->
      <div id="map" class="w-full h-96 rounded-lg border border-gray-200"></div>

      <!-- Lista de igrejas -->
      <div class="mt-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Igrejas Encontradas</h2>
        @if (filteredChurches.length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (church of filteredChurches; track church.id) {
              <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" (click)="centerOnChurch(church)">
                <h3 class="font-semibold text-gray-900 mb-1">{{ church.name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ church.denomination }}</p>
                <p class="text-sm text-gray-500">{{ church.city }}, {{ church.state }}</p>
                <p class="text-xs text-gray-400 mt-2">{{ church.address }}</p>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-8">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-gray-500">Nenhuma igreja encontrada com os filtros aplicados.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ChurchMapComponent implements OnInit, OnDestroy, AfterViewInit {
  private map: any;
  private markers: any[] = [];
  private userMarker: any;
  
  churches: Church[] = [];
  filteredChurches: Church[] = [];
  cities: string[] = [];
  states: string[] = [];
  denominations: string[] = [];
  
  selectedCity = '';
  selectedState = '';
  selectedDenomination = '';
  selectedDay = '';
  sortBy = 'name';
  days: string[] = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  
  userLocation: { lat: number; lng: number } | null = null;

  constructor(private churchService: ChurchService) {}

  ngOnInit(): void {
    this.loadChurches();
    this.getUserLocation();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private loadChurches(): void {
    this.churches = this.churchService.getApprovedChurches();
    this.cities = this.churchService.getCities();
    this.states = this.churchService.getStates();
    this.denominations = this.churchService.getDenominations();
    this.applyFilters();
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.addUserMarker();
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  }

  private initMap(): void {
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        this.map = L.map('map').setView([-15.7801, -47.9292], 4); // Centro do Brasil

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.addMarkers();
      }
    }, 100);
  }

  private addMarkers(): void {
    this.clearMarkers();
    
    this.filteredChurches.forEach(church => {
      const marker = L.marker([church.coordinates.lat, church.coordinates.lng])
        .addTo(this.map)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${church.name}</h3>
            <p class="text-sm text-gray-600">${church.denomination}</p>
            <p class="text-sm text-gray-500">${church.address}</p>
            <p class="text-sm text-gray-500">${church.city}, ${church.state}</p>
            <div class="mt-2">
              <p class="text-xs"><strong>Responsável:</strong> ${church.responsible}</p>
              <p class="text-xs"><strong>Telefone:</strong> ${church.phone}</p>
              <p class="text-xs"><strong>E-mail:</strong> ${church.email}</p>
              <p class="text-xs"><strong>WhatsApp:</strong> ${church.whatsapp}</p>
            </div>
          </div>
        `);
      
      this.markers.push(marker);
    });

    this.fitMapToMarkers();
  }

  private addUserMarker(): void {
    if (this.userLocation && this.map) {
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }
      
      this.userMarker = L.marker([this.userLocation.lat, this.userLocation.lng], {
        icon: L.divIcon({
          className: 'user-marker',
          html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
          iconSize: [16, 16]
        })
      }).addTo(this.map);
    }
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  private fitMapToMarkers(): void {
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  applyFilters(): void {
    let filtered = this.churches;

    if (this.selectedCity) {
      filtered = filtered.filter(church => 
        church.city.toLowerCase().includes(this.selectedCity.toLowerCase())
      );
    }

    if (this.selectedState) {
      filtered = filtered.filter(church => 
        church.state.toLowerCase().includes(this.selectedState.toLowerCase())
      );
    }

    if (this.selectedDenomination) {
      filtered = filtered.filter(church => 
        church.denomination.toLowerCase().includes(this.selectedDenomination.toLowerCase())
      );
    }

    if (this.selectedDay) {
      const day = this.selectedDay.toLowerCase();
      filtered = filtered.filter(church => (church.schedules || []).some(s => s.day.toLowerCase().includes(day)));
    }

    // Ordenação
    switch (this.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'denomination':
        filtered.sort((a, b) => a.denomination.localeCompare(b.denomination));
        break;
      case 'distance':
        if (this.userLocation) {
          filtered.sort((a, b) => {
            const distanceA = this.calculateDistance(
              this.userLocation!.lat, this.userLocation!.lng,
              a.coordinates.lat, a.coordinates.lng
            );
            const distanceB = this.calculateDistance(
              this.userLocation!.lat, this.userLocation!.lng,
              b.coordinates.lat, b.coordinates.lng
            );
            return distanceA - distanceB;
          });
        }
        break;
    }

    this.filteredChurches = filtered;
    this.addMarkers();
  }

  centerOnChurch(church: Church): void {
    if (this.map) {
      this.map.setView([church.coordinates.lat, church.coordinates.lng], 15);
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  get uniqueDenominations(): number {
    return new Set(this.filteredChurches.map(c => c.denomination)).size;
  }

  get uniqueCities(): number {
    return new Set(this.filteredChurches.map(c => c.city)).size;
  }
}
