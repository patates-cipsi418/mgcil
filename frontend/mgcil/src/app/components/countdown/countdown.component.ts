import { Component } from '@angular/core';
import { AlertService } from '../../shared/services/alert.service';
import { text } from 'stream/consumers';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent {
  targetDate: Date = new Date('January 3, 2027 00:00:00');
  currentTime: Date = new Date();
  days: string = '';
  hours: string = '';
  minutes: string = '';
  seconds: string = '';

  constructor(
    private alertService: AlertService
  ) {
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 1000);
  }

  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.days = '0';
      this.hours = '0';
      this.minutes = '0';
      this.seconds = '0';
      return;
    }

    this.days = this.parseNumber(Math.floor(distance / (1000 * 60 * 60 * 24)));
    this.hours = this.parseNumber(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    this.minutes = this.parseNumber(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    this.seconds = this.parseNumber(Math.floor((distance % (1000 * 60)) / 1000));
  }
  
  parseNumber(value: number): string {
    if (value === 57) {
      return 'wah8-1';
    } else if (value === 55) {
      return 'wah6-1';
    } else {
      return value.toString().replace(/5/g, 'wah').replace(/7/g, 'wahwah');
    }
  }

  share() {
    const text = 'https://mgcil.xyz/countdown';
    if (navigator.clipboard) {
      // Modern Clipboard API
      navigator.clipboard.writeText(text).then(() => {
          this.alertService.addAlert('success', 'Link copied to clipboard!');
      }).catch(err => {
          this.alertService.addAlert('danger', 'Failed to copy link to clipboard!');
          console.error('Failed to copy!', err);
      });
    } else {
        // Fallback for older browsers
        this.fallbackCopyToClipboard(text);
    }
  }

  fallbackCopyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';  // Prevents scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textarea);
  }
}
