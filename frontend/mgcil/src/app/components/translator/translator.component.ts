import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// @ts-ignore
import { toWords } from 'number-to-words';
// @ts-ignore
import { NumberToLetter } from '@mandarvl/convertir-nombre-lettre';

@Component({
  selector: 'app-translator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translator.component.html',
  styleUrl: './translator.component.scss'
})
export class TranslatorComponent {
  inputNumber?: number;
  translatedNumber?: string;
  selectedLanguage: string = "en-GB";

  onSubmit() {
    this.translatedNumber = "";

    if (this.inputNumber) {
      this.translatedNumber = this.numberToWords(this.inputNumber);
    }
  }

  numberToWords(number: number) {
    if (this.selectedLanguage == "en-GB") {
      // English
      var words = toWords(number);
      words = words.replace(/fifty/g, "wahty");
      words = words.replace(/fifteen/g, "wahteen");
      words = words.replace(/five/g, "wah");
      words = words.replace(/seven/g, "wahwah");
    } else {
      // French
      var words = NumberToLetter(number);
      words = words.replace(/cinquante/g, "wahquante");
      words = words.replace(/cinq/g, "wah");
      words = words.replace(/quinze/g, "winze");
      words = words.replace(/sept/g, "wahwah");
    }

    return words;
  }

  onSpeech() {
    if (!this.translatedNumber || !('speechSynthesis' in window)) {
      return;
    }

    // Synthèse vocale native du navigateur (plus de dépendance au backend)
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(this.translatedNumber);
    utterance.lang = this.selectedLanguage;
    window.speechSynthesis.speak(utterance);
  }
}
