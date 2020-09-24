import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appRefugeeGraphic]'
})
export class RefugeeGraphicDirective implements OnChanges {
  @Input() bestehend: number;
  @Input() geplant: number;
  @Input() vorgeschlagen: number;
  @Input() heutevorgeschlagen: number;
  @Input() unterzubringen: number;
  @Input() maxheight = 45;
  @Input() align = 'left';

  constructor(private el: ElementRef<HTMLElement>) {
    el.nativeElement.classList.add('refugeegraphic');
  }

  ngOnChanges() {
    if (this.bestehend || this.geplant) {
      this.appendImages(this.bestehend, 'f_bestand.svg');
      this.appendImages(this.geplant, 'f_inplanung.svg');
    } else if (this.vorgeschlagen || this.heutevorgeschlagen) {
      this.appendImages(this.vorgeschlagen, 'f_inpruefung.svg');
      this.appendImages(this.heutevorgeschlagen, 'f_heutevorgeschlagen.svg');
    } else if (this.unterzubringen) {
      this.appendImages(this.unterzubringen, 'f_unterzubringen.svg');
    }
  }

  private appendImages(count: number, icon: string) {
    const elem = this.el.nativeElement;

    for (let j = 0; j < elem.childNodes.length; j++) {
      elem.childNodes[j].remove();
    }

    const img = [];
    let i = 0;

    // Add one icon per 1,000
    for (i = 0; i <= count / 1000 - 1; i++) {
      img[i] = document.createElement('img');
      img[i].src = 'assets/images/' + icon;
      img[i].height = this.maxheight;
      img[i].width = img[i].height / 2;
    }

    // Add a variably sized icon for the remainder
    img[i] = document.createElement('img');
    img[i].src = 'assets/images/' + icon;

    const remainder = count % 1000;
    if (remainder === 0) {
      img[i].height = 0;
    } else if (remainder <= 500) {
      img[i].height = 0.7 * this.maxheight;
    } else {
      img[i].height = this.maxheight;
    }
    img[i].width = img[i].height / 2;

    // Append everything to DOM
    for (const imageElement of img.filter(image => image.height > 0)) {
      if (this.align === 'left') {
        elem.appendChild(imageElement);
      } else if (this.align === 'right') {
        elem.insertBefore(imageElement, elem.childNodes[0]);
      }
      imageElement.style['vertical-align'] = 'baseline';
    }
  }

}
