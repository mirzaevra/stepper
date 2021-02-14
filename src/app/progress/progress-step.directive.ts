import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {ProgressHelperService} from './progress-helper.service';

@Directive({
  selector: '[appProgressStepNext], [appProgressStepPrev]'
})
export class ProgressStepDirective implements OnInit {
  @Input('appProgressStepNext') next;
  @Input('appProgressStepPrev') prev;

  private methods = {
    prev: false,
    next: false,
  };

  @HostListener('click', ['$event']) private listen($event): void {
    this.progressHelperService.eventHelper.next(this.methods);
  }

  constructor(
    private progressHelperService: ProgressHelperService,
    private elementRef: ElementRef<HTMLButtonElement>
  ) {
  }

  public ngOnInit(): void {
    this.initMethods();
  }

  private initMethods(): void {
    if ('next' in this) {
      this.methods = {
        ...this.methods,
        next: true,
      };
    }

    if ('prev' in this) {
      this.methods = {
        ...this.methods,
        prev: true,
      };
    }
  }

}
