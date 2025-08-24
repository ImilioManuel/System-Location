import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChurchService } from '../../services/church.service';
import { Church } from '../../models/church.model';

@Component({
  selector: 'app-church-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Buscar Igrejas</h1>
        <p class="text-gray-600">Encontre igrejas por nome, denominação, localização ou proximidade.</p>
      </div>

      <!-- Barra de pesquisa -->
      <div class="mb-6">
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Buscar por nome, denominação, cidade..."
            class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Filtros avançados -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
          <select [(ngModel)]="selectedCity" (change)="onSearch()" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Todas as cidades</option>
            @for (city of cities; track city) {
              <option [value]="city">{{ city }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select [(ngModel)]="selectedState" (change)="onSearch()" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Todos os estados</option>
            @for (state of states; track state) {
              <option [value]="state">{{ state }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Denominação</label>
          <select [(ngModel)]="selectedDenomination" (change)="onSearch()" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Todas as denominações</option>
            @for (denomination of denominations; track denomination) {
              <option [value]="denomination">{{ denomination }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
          <select [(ngModel)]="sortBy" (change)="onSearch()" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="name">Nome</option>
            <option value="distance">Distância</option>
            <option value="denomination">Denominação</option>
            <option value="city">Cidade</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Dia</label>
          <select [(ngModel)]="selectedDay" (change)="onSearch()" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Todos</option>
            @for (d of days; track d) { <option [value]="d">{{ d }}</option> }
          </select>
        </div>
      </div>

      <!-- Opção de busca por proximidade -->
      <div class="mb-6 bg-blue-50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Buscar por proximidade</h3>
            <p class="text-sm text-gray-600">Encontre igrejas próximas à sua localização atual</p>
          </div>
          <button
            (click)="searchByProximity()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Buscar Próximas
          </button>
        </div>
      </div>

      <!-- Resultados -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">
            Resultados ({{ filteredChurches.length }})
          </h2>
          @if (userLocation) {
            <div class="text-sm text-gray-500">
              Sua localização: {{ userLocation.lat.toFixed(4) }}, {{ userLocation.lng.toFixed(4) }}
            </div>
          }
        </div>

        @if (filteredChurches.length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (church of filteredChurches; track church.id) {
              <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-semibold text-gray-900">{{ church.name }}</h3>
                  @if (userLocation && church.coordinates.lat !== 0) {
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {{ getDistance(church) | number:'1.1-1' }} km
                    </span>
                  }
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ church.denomination }}</p>
                <p class="text-sm text-gray-500 mb-2">{{ church.city }}, {{ church.state }}</p>
                <p class="text-xs text-gray-400 mb-3">{{ church.address }}</p>
                
                <div class="space-y-1 text-xs text-gray-600">
                  <div><strong>Responsável:</strong> {{ church.responsible }}</div>
                  <div><strong>Telefone:</strong> {{ church.phone }}</div>
                  <div><strong>E-mail:</strong> {{ church.email }}</div>
                  <div><strong>WhatsApp:</strong> {{ church.whatsapp }}</div>
                </div>

                <div class="mt-3 flex space-x-2">
                  <button
                    (click)="openMap(church)"
                    class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                  >
                    Ver no Mapa
                  </button>
                  <button
                    (click)="copyContact(church)"
                    class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Copiar Contato
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-8">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p class="text-gray-500">Nenhuma igreja encontrada com os critérios de busca.</p>
          </div>
        }
      </div>

      <!-- Estatísticas -->
      @if (filteredChurches.length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ filteredChurches.length }}</div>
            <div class="text-sm text-gray-600">Total encontrado</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ uniqueDenominations }}</div>
            <div class="text-sm text-gray-600">Denominações</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ uniqueCities }}</div>
            <div class="text-sm text-gray-600">Cidades</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">{{ uniqueStates }}</div>
            <div class="text-sm text-gray-600">Estados</div>
          </div>
        </div>
      }
    </div>
  `
})
export class ChurchSearchComponent implements OnInit {
  churches: Church[] = [];
  filteredChurches: Church[] = [];
  cities: string[] = [];
  states: string[] = [];
  denominations: string[] = [];
  
  searchQuery = '';
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

  private loadChurches(): void {
    this.churches = this.churchService.getChurchesList();
    this.cities = this.churchService.getCities();
    this.states = this.churchService.getStates();
    this.denominations = this.churchService.getDenominations();
    this.filteredChurches = this.churches;
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  }

  onSearch(): void {
    let filtered = this.churchService.searchChurches(this.searchQuery, {
      city: this.selectedCity,
      state: this.selectedState,
      denomination: this.selectedDenomination,
      day: this.selectedDay,
      onlyApproved: true
    });

    // Ordenação
    switch (this.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'denomination':
        filtered.sort((a, b) => a.denomination.localeCompare(b.denomination));
        break;
      case 'city':
        filtered.sort((a, b) => a.city.localeCompare(b.city));
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
  }

  searchByProximity(): void {
    if (this.userLocation) {
      this.filteredChurches = this.churchService.getChurchesByDistance(
        this.userLocation.lat,
        this.userLocation.lng,
        50 // 50km de raio
      );
    } else {
      this.getUserLocation();
      setTimeout(() => {
        if (this.userLocation) {
          this.searchByProximity();
        }
      }, 1000);
    }
  }

  getDistance(church: Church): number {
    if (!this.userLocation || church.coordinates.lat === 0) {
      return 0;
    }
    return this.calculateDistance(
      this.userLocation.lat, this.userLocation.lng,
      church.coordinates.lat, church.coordinates.lng
    );
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

  openMap(church: Church): void {
    const url = `https://www.google.com/maps?q=${church.coordinates.lat},${church.coordinates.lng}`;
    window.open(url, '_blank');
  }

  copyContact(church: Church): void {
    const contactInfo = `Igreja: ${church.name}\nDenominação: ${church.denomination}\nEndereço: ${church.address}, ${church.city} - ${church.state}\nResponsável: ${church.responsible}\nTelefone: ${church.phone}\nE-mail: ${church.email}\nWhatsApp: ${church.whatsapp}`;
    
    navigator.clipboard.writeText(contactInfo).then(() => {
      alert('Informações de contato copiadas!');
    }).catch(() => {
      // Fallback para navegadores que não suportam clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = contactInfo;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Informações de contato copiadas!');
    });
  }

  get uniqueDenominations(): number {
    return new Set(this.filteredChurches.map(c => c.denomination)).size;
  }

  get uniqueCities(): number {
    return new Set(this.filteredChurches.map(c => c.city)).size;
  }

  get uniqueStates(): number {
    return new Set(this.filteredChurches.map(c => c.state)).size;
  }
}

