import { RefugeeGraphicDirective } from './refugee-graphic.directive';
import { ElementRef } from '@angular/core';

describe('RefugeeGraphicDirective', () => {
  it('should create an instance', () => {
    const el = new HTMLDivElement();
    const directive = new RefugeeGraphicDirective(new ElementRef(el));
    expect(directive).toBeTruthy();
  });
});
