import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Church } from '../models/church.model';

@Injectable({
  providedIn: 'root'
})
export class ChurchService {
  private churches: Church[] = [];
  private churchesSubject = new BehaviorSubject<Church[]>([]);
  private readonly STORAGE_KEY = 'churches';

  constructor() {
    this.loadChurches();
    this.addSampleData();
  }

  private loadChurches(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.churches = JSON.parse(stored);
      // Migração de dados: garantir campos padrão
      this.churches = this.churches.map(c => ({
        approved: true,
        featured: false,
        schedules: [],
        ...c,
      }));
      this.churchesSubject.next(this.churches);
    }
  }

  private saveChurches(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.churches));
    this.churchesSubject.next(this.churches);
  }

  getChurches(): Observable<Church[]> {
    return this.churchesSubject.asObservable();
  }

  getChurchesList(): Church[] {
    return this.churches;
  }

  addChurch(church: Church): void {
    church.id = this.generateId();
    church.createdAt = new Date();
    church.updatedAt = new Date();
    if (church.approved === undefined) church.approved = false; // novos cadastros aguardam aprovação
    if (church.featured === undefined) church.featured = false;
    if (!church.schedules) church.schedules = [];
    this.churches.push(church);
    this.saveChurches();
  }

  updateChurch(church: Church): void {
    const index = this.churches.findIndex(c => c.id === church.id);
    if (index !== -1) {
      church.updatedAt = new Date();
      this.churches[index] = church;
      this.saveChurches();
    }
  }

  deleteChurch(id: string): void {
    this.churches = this.churches.filter(c => c.id !== id);
    this.saveChurches();
  }

  getChurchById(id: string): Church | undefined {
    return this.churches.find(c => c.id === id);
  }

  getApprovedChurches(): Church[] {
    return this.churches.filter(c => c.approved);
  }

  getFeaturedChurches(): Church[] {
    return this.churches.filter(c => c.approved && c.featured);
  }

  searchChurches(query: string, filters?: {
    city?: string;
    state?: string;
    denomination?: string;
    day?: string; // filtro por dia da semana
    onlyApproved?: boolean;
  }): Church[] {
    let filtered = filters?.onlyApproved ? this.getApprovedChurches() : this.churches;

    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(church =>
        church.name.toLowerCase().includes(searchTerm) ||
        church.denomination.toLowerCase().includes(searchTerm) ||
        church.city.toLowerCase().includes(searchTerm) ||
        church.state.toLowerCase().includes(searchTerm) ||
        church.address.toLowerCase().includes(searchTerm)
      );
    }

    if (filters) {
      if (filters.city) {
        filtered = filtered.filter(church => 
          church.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters.state) {
        filtered = filtered.filter(church => 
          church.state.toLowerCase().includes(filters.state!.toLowerCase())
        );
      }
      if (filters.denomination) {
        filtered = filtered.filter(church => 
          church.denomination.toLowerCase().includes(filters.denomination!.toLowerCase())
        );
      }
      if (filters.day) {
        const day = filters.day.toLowerCase();
        filtered = filtered.filter(church => (church.schedules || []).some(s => s.day.toLowerCase().includes(day)));
      }
    }

    return filtered;
  }

  getChurchesByDistance(userLat: number, userLng: number, radius: number = 50): Church[] {
    return this.churches.filter(church => {
      const distance = this.calculateDistance(
        userLat, userLng,
        church.coordinates.lat, church.coordinates.lng
      );
      return distance <= radius;
    }).sort((a, b) => {
      const distanceA = this.calculateDistance(
        userLat, userLng,
        a.coordinates.lat, a.coordinates.lng
      );
      const distanceB = this.calculateDistance(
        userLat, userLng,
        b.coordinates.lat, b.coordinates.lng
      );
      return distanceA - distanceB;
    });
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

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getDenominations(): string[] {
    const denominations = this.churches.map(c => c.denomination);
    return [...new Set(denominations)].sort();
  }

  getCities(): string[] {
    const cities = this.churches.map(c => c.city);
    return [...new Set(cities)].sort();
  }

  getStates(): string[] {
    const states = this.churches.map(c => c.state);
    return [...new Set(states)].sort();
  }

  private addSampleData(): void {
    // Só adiciona dados de exemplo se não houver igrejas cadastradas
    if (this.churches.length === 0) {
      const sampleChurches: Church[] = [
        {
          name: 'Igreja Batista Central',
          denomination: 'Batista',
          address: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          coordinates: { lat: -23.5505, lng: -46.6333 },
          approved: true,
          featured: true,
          schedules: [
            { day: 'Domingo', times: ['09:00', '18:00'] },
            { day: 'Quarta', times: ['19:30'] }
          ],
          responsible: 'João Silva',
          phone: '(11) 99999-9999',
          email: 'joao@igreja.com',
          whatsapp: '(11) 99999-9999'
        },
        {
          name: 'Igreja Presbiteriana do Brasil',
          denomination: 'Presbiteriana',
          address: 'Av. Paulista, 1000',
          city: 'São Paulo',
          state: 'SP',
          coordinates: { lat: -23.5631, lng: -46.6544 },
          approved: true,
          featured: false,
          schedules: [
            { day: 'Domingo', times: ['10:00', '19:00'] }
          ],
          responsible: 'Maria Santos',
          phone: '(11) 88888-8888',
          email: 'maria@igreja.com',
          whatsapp: '(11) 88888-8888'
        },
        {
          name: 'Igreja Metodista Wesley',
          denomination: 'Metodista',
          address: 'Rua Augusta, 500',
          city: 'Rio de Janeiro',
          state: 'RJ',
          coordinates: { lat: -22.9068, lng: -43.1729 },
          approved: true,
          featured: false,
          schedules: [
            { day: 'Domingo', times: ['09:30'] },
            { day: 'Quinta', times: ['19:30'] }
          ],
          responsible: 'Pedro Costa',
          phone: '(21) 77777-7777',
          email: 'pedro@igreja.com',
          whatsapp: '(21) 77777-7777'
        },
        {
          name: 'Igreja Luterana da Paz',
          denomination: 'Luterana',
          address: 'Rua da Paz, 200',
          city: 'Porto Alegre',
          state: 'RS',
          coordinates: { lat: -30.0346, lng: -51.2177 },
          approved: true,
          featured: false,
          schedules: [
            { day: 'Domingo', times: ['09:00'] }
          ],
          responsible: 'Ana Oliveira',
          phone: '(51) 66666-6666',
          email: 'ana@igreja.com',
          whatsapp: '(51) 66666-6666'
        },
        {
          name: 'Igreja Anglicana São João',
          denomination: 'Anglicana',
          address: 'Av. Beira Mar, 300',
          city: 'Salvador',
          state: 'BA',
          coordinates: { lat: -12.9714, lng: -38.5011 },
          approved: true,
          featured: true,
          schedules: [
            { day: 'Domingo', times: ['08:30', '18:30'] },
            { day: 'Quarta', times: ['19:00'] }
          ],
          responsible: 'Carlos Lima',
          phone: '(71) 55555-5555',
          email: 'carlos@igreja.com',
          whatsapp: '(71) 55555-5555'
        }
      ];

      sampleChurches.forEach(church => {
        this.addChurch(church);
      });
    }
  }

  // Admin helpers
  approveChurch(id: string): void {
    const church = this.getChurchById(id);
    if (church) {
      church.approved = true;
      church.updatedAt = new Date();
      this.saveChurches();
    }
  }

  toggleFeatured(id: string, value?: boolean): void {
    const church = this.getChurchById(id);
    if (church) {
      church.featured = value !== undefined ? value : !church.featured;
      church.updatedAt = new Date();
      this.saveChurches();
    }
  }
}
