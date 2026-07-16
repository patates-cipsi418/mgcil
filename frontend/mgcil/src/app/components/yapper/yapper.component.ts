import { Component, OnInit } from '@angular/core';
import { SoundButtonComponent } from "./sound-button/sound-button.component";
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SOUNDS, SoundButton } from './sounds.data';

@Component({
  selector: 'app-yapper',
  standalone: true,
  imports: [FormsModule, SoundButtonComponent],
  templateUrl: './yapper.component.html',
  styleUrl: './yapper.component.scss'
})
export class YapperComponent implements OnInit {
  allButtons: SoundButton[] = [];
  currentButtons: SoundButton[] | null = null;
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject();
  currentSound?: HTMLAudioElement;

  constructor() {
    this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
    )
    .subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit() {
    // Sons embarqués dans le front (plus de dépendance au backend)
    this.allButtons = SOUNDS;
    this.currentButtons = this.allButtons;
  }

  playSound(index: number) {
    const button = this.currentButtons?.[index];
    if (!button) {
      return;
    }

    // Stop all the sounds
    this.currentSound?.pause();

    // Start new sound (mp3 embarqués dans le front, servis depuis public/sounds)
    this.currentSound = new Audio(`sounds/${button.sound}.mp3`);

    this.currentSound.play();
  }

  stopSound() {
    this.currentSound?.pause();
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  performSearch(searchTerm: string) {
    if (searchTerm.length == 0) {
      this.currentButtons = this.allButtons;
      return;
    }

    this.currentButtons = this.allButtons.filter((button: SoundButton) => {
      return button.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
}
