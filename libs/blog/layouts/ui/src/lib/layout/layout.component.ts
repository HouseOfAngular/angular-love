import {
  SearchService,
  SearchStore,
} from '@angular-love/blog/search/data-access';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'al-layout',
  standalone: true,
  imports: [RouterModule, FooterComponent, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SearchService, SearchStore],
  host: {
    class: 'min-h-screen grid grid-rows-[auto_1fr_auto]',
  },
})
export class LayoutComponent {}
