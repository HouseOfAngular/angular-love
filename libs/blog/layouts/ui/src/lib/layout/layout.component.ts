import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'angular-love-layout',
  standalone: true,
  imports: [RouterModule, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
