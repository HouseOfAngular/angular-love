import { Directive, OnInit, output } from '@angular/core';

@Directive({
  selector: '[alInfiniteScrollTrigger]',
  standalone: true,
})
export class InfiniteScrollTriggerDirective implements OnInit {
  loaded = output<void>();

  ngOnInit(): void {
    this.loaded.emit();
  }
}
