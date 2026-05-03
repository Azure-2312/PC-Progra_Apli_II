import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  readonly API_URL = 'http://localhost:5000'; // URL del backend Flask
  
  selectedFile: File | null = null;
  prediction: string = "";
  imageName: string = "";
  probs: any = null;

  constructor(private http: HttpClient) {}

  handleFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.prediction = "";
    this.imageName = "";
    this.probs = null;
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append("image", this.selectedFile);

    this.http.post<any>(`${this.API_URL}/api/clasificar`, formData)
      .subscribe({
        next: (data) => {
          this.prediction = data.prediction;
          this.imageName = data.image_name;
          this.probs = data.probs;
        },
        error: (err) => {
          alert("Error al clasificar la imagen");
          console.error(err);
        }
      });
  }

  get imageUrl(): string {
    return this.imageName ? `${this.API_URL}/static/uploads/${this.imageName}` : "";
  }

  get graphUrl(): string {
    return this.imageName 
      ? `${this.API_URL}/static/uploads/probabilidades.png?t=${new Date().getTime()}` 
      : "";
  }

  // Helper para iterar sobre el objeto de probabilidades en el HTML
  get objectEntries() {
    return this.probs ? Object.entries(this.probs) : [];
  }
}
