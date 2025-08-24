import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChurchService } from '../../services/church.service';
import { Church } from '../../models/church.model';

@Component({
  selector: 'app-church-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './church-form.component.html',
})
export class ChurchFormComponent {
  churchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private churchService: ChurchService,
    private router: Router
  ) {
    this.churchForm = this.fb.group({
      name: ['', Validators.required],
      denomination: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      neighborhood: [''],
      latitude: [null],
      longitude: [null],
      schedulesText: [''],
      responsible: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', Validators.required],
      photo: [null]
    });
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.churchForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.churchForm.valid) {
      const formData = this.churchForm.value;

      const church: Church = {
        name: formData.name,
        denomination: formData.denomination,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        neighborhood: formData.neighborhood,
        coordinates: {
          lat: formData.latitude || 0,
          lng: formData.longitude || 0
        },
        schedules: this.parseSchedules(formData.schedulesText),
        responsible: formData.responsible,
        phone: formData.phone,
        email: formData.email,
        whatsapp: formData.whatsapp,
        approved: false
      };

      this.churchService.addChurch(church);
      this.router.navigate(['/']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Guardar base64 no form para salvar junto
        this.churchForm.patchValue({ photo: base64 });
      };
      reader.readAsDataURL(file);
    }
  }

  private parseSchedules(raw: string | null | undefined) {
    if (!raw) return [];
    // Formato esperado: "Domingo 09:00, 18:00; Quarta 19:30"
    return raw.split(';').map(part => part.trim()).filter(Boolean).map(part => {
      const [dayPart, timesPart] = part.split(/\s+/, 2);
      const day = dayPart || '';
      const times = timesPart ? timesPart.split(',').map(t => t.trim()).filter(Boolean) : [];
      return { day, times };
    });
  }
}
