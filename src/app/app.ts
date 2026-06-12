import { Component, signal } from '@angular/core';
import { MenuDisplay } from './components/menu-display/menu-display';
import { MenuData } from './models/menu.models';

@Component({
  selector: 'app-root',
  imports: [MenuDisplay],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  fileName = signal<string>('');
  isDragging = signal<boolean>(false);
  menuData = signal<MenuData | null>(null);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  clearMenu() {
    this.menuData.set(null);
    this.fileName.set('');
  }

  private handleFile(file: File) {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Please upload a valid JSON file.');
      return;
    }
    
    this.fileName.set(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        this.menuData.set(json as MenuData);
        console.log('Menu data loaded successfully:', json);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON file format.');
        this.menuData.set(null);
      }
    };
    reader.readAsText(file);
  }
}
