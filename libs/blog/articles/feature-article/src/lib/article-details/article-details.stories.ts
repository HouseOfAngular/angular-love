import { provideTransloco, translocoConfig } from '@jsverse/transloco';
import { applicationConfig, Meta, StoryObj } from '@storybook/angular';

import { TranslocoHttpLoader } from '@angular-love/blog/i18n/data-access';
import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import { Article, SeoData } from '@angular-love/contracts/articles';
import { ConfigService } from '@angular-love/shared/config';

import { ArticleDetailsComponent } from './article-details.component';

const translocoConf = translocoConfig({
  availableLangs: ['pl', 'en'],
  defaultLang: 'pl',
});

const meta: Meta<ArticleDetailsComponent> = {
  component: ArticleDetailsComponent,
  title: 'Articles / details',
  decorators: [
    applicationConfig({
      providers: [
        ConfigService,
        AlLocalizeService,
        provideTransloco({
          config: translocoConf,
          loader: TranslocoHttpLoader,
        }),
      ],
    }),
  ],
};

const articleDetails: Article = {
  id: 0,
  slug: '',
  seo: {} as SeoData,
  otherTranslations: {} as any,
  lang: 'en',
  readingTime: '3',
  title: "Why Angular signals won't replace RxJs",
  difficulty: 'beginner',
  author: {
    slug: '',
    name: 'John Smith',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    avatarUrl: '/assets/storybook/author-image.jpg',
    position: '',
    github: '',
    linkedin: '',
    twitter: '',
    titles: ['gde', 'blogger'],
  },
  anchors: [],
  publishDate: new Date('2021-01-01').toISOString(),
  content:
    '<html><head></head><body><p><span>After the Angular team shared news about introducing signals in Angular 16, it was all the entire community could talk about.&nbsp;</span></p>\n<p><span>With everyone having that level of interest and fascination with this new feature, you might wonder if Angular is moving towards completely removing RxJs from the codebase. However, that is not the case.&nbsp;</span></p>\n<p><span>In this article, I will explain why RxJs won’t be replaced by signals and remain a library available to developers.&nbsp;</span></p>\n<p><strong>The impact of signals</strong></p>\n<p><a href="https://github.com/angular/angular/discussions/49685"><span>Angular signals are a new reactive primitive introduced to Angular in version 16</span></a><span>. Before, we were able to use signals occasionally. For example, in Solid.js. So this concept is well known by Angular developers. You can find more information about signals in </span><a href="https://testing.angular.love/en/2023/05/25/angular-signals-a-new-feature-in-angular-16/"><span>this article</span></a><span>.</span></p>\n<p><span>Signals will change our approach to writing code, change detection, and improve application performance. Considering the nature of signals and their synchronous data flow, they have some limitations which are perfectly filled by RxJs.</span></p>\n<p><strong>Signals vs RxJs</strong></p>\n<p><span>RxJs can be asynchronous. What does that mean? RxJs can do many operations in parallel, independently. The perfect example of a situation like that was presented at an </span><a href="https://www.youtube.com/watch?v=BV8FpuKlXM4&amp;t=4960s"><span>angular.love meetup by Maciej Wójcik&nbsp;</span></a></p>\n<p></p>\n<p><span>In this case, it is possible that the `data` variable doesn’t have any value when it is assigned to the `someValue` variable. That is because data is still being downloaded, and the subscription doesn’t run yet.</span></p>\n<p><span>On the other hand, signals are synchronous. That means that they run operations in a specific order. That works great when we use signals to store data or in the template.</span></p>\n<p><strong>Why RxJs is staying</strong></p>\n<p><span>Angular contains an API to convert signals to observable and observable to signal. This looks like a clear statement that we should use both approaches and use their different benefits.&nbsp;</span></p>\n<p><span>Here is an example of what&nbsp; the above-mentioned conversion looks like:</span></p>\n<pre class="lang:js"><code class="hljs">  step = <span class="hljs-title function_">signal</span>(<span class="hljs-string">\'create\'</span>);\n  step$ = <span class="hljs-title function_">toObservable</span>(<span class="hljs-variable language_">this</span>.<span class="hljs-property">step</span>);\n  <span class="hljs-title function_">ngOnInit</span>(<span class="hljs-params"></span>) {\n    <span class="hljs-variable language_">this</span>.<span class="hljs-property">step$</span>.<span class="hljs-title function_">subscribe</span>(<span class="hljs-function">(<span class="hljs-params">step</span>) =&gt;</span> {\n      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(step);\n    });\n  }\n\n\n  users$ = <span class="hljs-title function_">of</span>([{ <span class="hljs-attr">id</span>: <span class="hljs-number">1</span>, <span class="hljs-attr">name</span>: <span class="hljs-string">\'John Smith\'</span> }]);\n  users = <span class="hljs-title function_">toSignal</span>(<span class="hljs-variable language_">this</span>.<span class="hljs-property">users$</span>);\n</code></pre>\n<p><span>Most of us know the cases where signals are better than RxJs. But when is RxJs better than signals? Let’s take a look.</span></p>\n<p><span>First, RxJs is better equipped to handle events from different sources, which need to be mapped and filtered. Signals can also handle those events, but they become less readable and more complicated than with RxJs. A significant number of RxJs operators gives us a wide range of possibilities.</span></p>\n<p><span>A good and classic example where using RxJs is simpler than signals is listening for input change with debounceTime operator. Code written only using RxJs looks like that:&nbsp;</span></p>\n<pre class="lang:js"><code class="hljs"> <span class="hljs-variable language_">this</span>.<span class="hljs-property">control</span>.<span class="hljs-property">valueChanges</span>.<span class="hljs-title function_">pipe</span>(\n      <span class="hljs-title function_">debounceTime</span>(<span class="hljs-number">300</span>),\n    ).<span class="hljs-title function_">subscribe</span>(<span class="hljs-function"><span class="hljs-params">value</span> =&gt;</span> {\n      <span class="hljs-variable language_">this</span>.<span class="hljs-property">search</span>.<span class="hljs-title function_">emit</span>(value)\n    })\n</code></pre>\n<p><span>Whereas code using&nbsp; only signals can look like that:</span></p>\n<pre class="lang:js"><code class="hljs"><span class="hljs-meta">@Component</span>({\n<span class="hljs-attr">selector</span>: <span class="hljs-string">\'app-root\'</span>,\n<span class="hljs-attr">template</span>: <span class="hljs-string">`\n&lt;input [ngModel]="searchValue()" (ngModelChange)="searchValue.set($event)"&gt;\n`</span>,\n<span class="hljs-attr">styleUrls</span>: [<span class="hljs-string">\'./app.component.scss\'</span>]\n})\n<span class="hljs-keyword">export</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">AppComponent</span> {\nsearchValue = <span class="hljs-title function_">signal</span>(<span class="hljs-string">\'\'</span>);\ndebouncedSearchValue = <span class="hljs-title function_">signal</span>(<span class="hljs-variable language_">this</span>.<span class="hljs-title function_">searchValue</span>());\n\n\n<span class="hljs-title function_">constructor</span>(<span class="hljs-params"></span>) {\n<span class="hljs-keyword">let</span> <span class="hljs-attr">timeoutId</span>: <span class="hljs-title class_">ReturnType</span>&lt;<span class="hljs-keyword">typeof</span> <span class="hljs-built_in">setTimeout</span>&gt; | <span class="hljs-literal">undefined</span>;\n<span class="hljs-title function_">effect</span>(<span class="hljs-function">(<span class="hljs-params">onCleanup</span>) =&gt;</span> {\n<span class="hljs-keyword">const</span> search = <span class="hljs-variable language_">this</span>.<span class="hljs-title function_">searchValue</span>();\n\n\ntimeoutId = <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> {\n<span class="hljs-variable language_">this</span>.<span class="hljs-property">debouncedSearchValue</span>.<span class="hljs-title function_">set</span>(search);\n}, <span class="hljs-number">500</span>);\n\n\n<span class="hljs-title function_">onCleanup</span>(<span class="hljs-function">() =&gt;</span> {\n<span class="hljs-built_in">clearTimeout</span>(timeoutId);\n});\n});\n\n\n<span class="hljs-title function_">effect</span>(<span class="hljs-function">() =&gt;</span> {\n<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-variable language_">this</span>.<span class="hljs-title function_">debouncedSearchValue</span>());\n});\n}\n}\n\n</code></pre>\n<p><span>As we can see, code that uses RxJs is simpler and more readable for a developer. But we should remember that we are able to write this code with both approaches. Using signals and RxJs together gives us more benefits than using only one approach.</span></p>\n<p><span>Generally speaking, asynchronous events handling is really challenging to achieve when only using signals. Additionally, RxJs have existed for many years, are used in a significant number of projects, and with this are reliable and well-tested.&nbsp;</span></p>\n<p><span>Michael Hladky spoke </span><a href="https://twitter.com/Michael_Hladky/status/1675969382646706177"><span>on Twitter</span></a><span> about re-creating and adjusting all RxJs operators to be compatible with signals. He said this is not the most efficient approach.</span></p>\n<p></p>\n<p><span>Network requests are another case when RxJs come in handy. XHR requests are asynchronous. Observable allows us to handle, map, and handle events like success, error, and completion.&nbsp;</span></p>\n<p><span>With RxJs operators, we can re-run requests or cancel them, which is impossible with signals. Signals don’t have classic and well-known operators like catchError or switchMap, which are responsible for canceling requests at a specific moment the new one comes with new data.&nbsp;</span></p>\n<p><span>Additionally, one of the most significant Angular features is backward compatibility. Completely removing RxJs from the framework will force Angular developers to spend an enormous amount of time on refactoring, something quite challenging to carry out.&nbsp; In the case of many projects, a change like that will mean rewriting the entire project.&nbsp;</span></p>\n<p><strong>Summary</strong></p>\n<p><span>Signals are, without a doubt, a revolution when it comes to performance and the approach to creating applications in Angular. Still, RxJs is a powerful tool that helps us handle asynchronous events easily and comfortably.&nbsp;</span></p>\n<p><span>From what I’ve seen, I am convinced that signals will never fully replace RxJs. Signals are able to replace only the synchronous parts of RxJs. But it’s best to combine these two approaches when building Angular applications. That will be more beneficial to app performance and the developer experience.&nbsp;</span></p>\n</body></html>',
};

export default meta;
type Story = StoryObj<ArticleDetailsComponent>;

export const primary: Story = {
  args: {
    articleDetails,
  },
};
