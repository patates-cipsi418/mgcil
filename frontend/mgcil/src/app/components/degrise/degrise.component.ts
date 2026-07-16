import { Component, OnInit } from '@angular/core';
import { SoundButtonComponent } from "../yapper/sound-button/sound-button.component";
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SoundButton } from '../yapper/sounds.data';
import { DEGRISE_SOUNDS } from './degrise.data';

@Component({
  selector: 'app-degrise',
  standalone: true,
  imports: [FormsModule, SoundButtonComponent],
  templateUrl: './degrise.component.html',
  styleUrl: './degrise.component.scss'
})
export class DegriseComponent implements OnInit {
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
    this.allButtons = DEGRISE_SOUNDS;
    this.currentButtons = this.allButtons;
  }

  playSound(index: number) {
    const button = this.currentButtons?.[index];
    if (!button) {
      return;
    }

    // Stop all the sounds
    this.currentSound?.pause();

    // Start new sound (mp3 embarqués dans le front, servis depuis public/degrise)
    this.currentSound = new Audio(`degrise/${button.sound}.mp3`);

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
