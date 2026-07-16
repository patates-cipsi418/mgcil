import { Component, OnInit } from '@angular/core';
import { SoundButtonComponent } from "./sound-button/sound-button.component";
import { HttpService } from '../../shared/services/http.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../shared/services/alert.service';
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
  apiURL: string = environment.apiUrl;
  suggestion: string = '';
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject();
  currentSound?: HTMLAudioElement;

  constructor(
    private httpService: HttpService,
    private alertService: AlertService,
  ) {
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

    // Start new sound (audio hébergé sur jukehost)
    this.currentSound = new Audio(`https://audio.jukehost.co.uk/${button.endpoint}`);

    this.httpService.post(`${this.apiURL}/analytics/${button.sound}`, {}).subscribe();

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

    this.currentButtons = this.allButtons.filter((button: any) => {
      return button.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  onSubmit() {
    if (this.suggestion) {
      this.sendSuggestion(this.suggestion);
    }
    this.suggestion = '';
  }

  sendSuggestion(suggestion: string) {
    this.httpService.post(`${this.apiURL}/suggestions`, { suggestion }).subscribe({
      next: () => {
        this.alertService.addAlert('success', 'Suggestion sent successfully');
      },
      error: (error) => {
        console.error(error);
        this.alertService.addAlert('danger', 'Error sending suggestion womp womp');
      }
    });
  }
}
