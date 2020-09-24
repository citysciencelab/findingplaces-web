import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-matrix-adjust',
  templateUrl: './matrix-adjust.component.html',
  styleUrls: ['./matrix-adjust.component.css']
})
export class MatrixAdjustComponent {
  @Input() m: number[][];
  @Output() update = new EventEmitter<number[][]>();

  constructor() { }

  updateMatrix(row: number, col: number, evt: Event) {
    // The short timeout increases the probability that the input value
    // is read AFTER the mousewheel event has taken effect
    setTimeout(() => {
      const input = <HTMLInputElement>evt.target;
      this.m[row][col] = parseFloat(input.value);
      this.update.emit(this.m);
    }, 50);
  }
}
