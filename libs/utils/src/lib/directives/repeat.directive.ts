import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: `[alRepeat]`,
  standalone: true,
})
export class RepeatDirective<T> {
  @Input('alRepeat') set amount(value: number) {
    this.viewContainerRef.clear();
    for (let i = 0; i < value; i++) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private readonly templateRef: TemplateRef<T>,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}
}
