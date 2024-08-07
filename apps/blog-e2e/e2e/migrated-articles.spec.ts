import { expect, test } from '@playwright/test';

const slugs = [
  {
    slug: 'switchall-rxjs-reference',
  },
  {
    slug: 'mergemap-rxjs-reference',
  },
  {
    slug: 'exhaustmap-rxjs-reference',
  },
  {
    slug: 'filter-rxjs-reference',
  },
  {
    slug: 'combinelatest-rxjs-reference',
  },
  {
    slug: 'rxjs-tutorials',
  },
  {
    slug: 'angular-tutorials',
  },
  {
    slug: 'the-simple-way-to-reload-data-using-rxjs',
  },
  {
    slug: 'how-to-exclude-stylesheets-from-the-bundle-and-lazy-load-them-in-angular-angular-tutorials',
  },
  {
    slug: 'angular-applications-seo-improvement-with-social-media-customization-angular-tutorials',
  },
  {
    slug: 'share-rxjs-reference',
  },
  {
    slug: 'of-rxjs-reference',
  },
  {
    slug: 'concatmap-rxjs-reference',
  },
  {
    slug: 'retrywhen-rxjs-reference',
  },
  {
    slug: 'publish-rxjs-reference',
  },
  {
    slug: 'race-rxjs-reference',
  },
  {
    slug: 'take-rxjs-reference',
  },
  {
    slug: 'tap-rxjs-reference',
  },
  {
    slug: 'switchmap-rxjs-reference',
  },
  {
    slug: 'map-rxjs-reference',
  },
  {
    slug: 'sampletime-rxjs-reference',
  },
  {
    slug: 'withlatestfrom-rxjs-reference',
  },
  {
    slug: 'takewhile-rxjs-reference',
  },
  {
    slug: 'delay-rxjs-reference',
  },
  {
    slug: 'delaywhen-rxjs-reference',
  },
  {
    slug: 'buffer-rxjs-reference',
  },
  {
    slug: 'zip-rxjs-reference',
  },
  {
    slug: 'distinctuntilchanged-rxjs-reference',
  },
  {
    slug: 'publishbehavior-rxjs-reference',
  },
  {
    slug: 'debounce-rxjs-reference',
  },
  {
    slug: 'merge-rxjs-reference',
  },
  {
    slug: 'exhaust-rxjs-reference',
  },
  {
    slug: 'catcherror-rxjs-reference',
  },
  {
    slug: 'audittime-rxjs-reference',
  },
  {
    slug: 'buffertime-rxjs-reference',
  },
  {
    slug: 'publishreplay-rxjs-reference',
  },
  {
    slug: 'throttletime-rxjs-reference',
  },
  {
    slug: 'bufferwhen-rxjs-reference',
  },
  {
    slug: 'concatall-rxjs-reference',
  },
  {
    slug: 'forkjoin-rxjs-reference',
  },
  {
    slug: 'from-rxjs-reference',
  },
  {
    slug: 'retry-rxjs-reference',
  },
  {
    slug: 'mergeall-rxjs-reference',
  },
  {
    slug: 'debouncetime-rxjs-reference',
  },
  {
    slug: 'takeuntil-rxjs-reference',
  },
  {
    slug: 'behaviorsubject-rxjs-reference',
  },
  {
    slug: 'replaysubject-rxjs-reference',
  },
  {
    slug: 'operators-rxjs-reference',
  },
  {
    slug: 'asyncsubject-rxjs-reference',
  },
  {
    slug: 'concat-rxjs-reference',
  },
  {
    slug: 'multicast-rxjs-reference',
  },
  {
    slug: 'rxjs-reference',
  },
  {
    slug: 'subjects-rxjs-reference',
  },
  {
    slug: 'debugging-techniques-profiling',
  },
  {
    slug: 'change-detection-big-picture-overview',
  },
  {
    slug: 'change-detection-big-picture-unidirectional-data-flow',
  },
  {
    slug: 'debugging-techniques-chrome-devtools',
  },
  {
    slug: 'change-detection-big-picture-rendering-cycle',
  },
  {
    slug: 'running-change-detection-preventing-autorun',
  },
  {
    slug: 'optimization-techniques-reusing-views',
  },
  {
    slug: 'running-change-detection-autorun-with-zones',
  },
  {
    slug: 'running-change-detection-manual-control',
  },
  {
    slug: 'expression-changed-error-debugging-algorithm',
  },
  {
    slug: 'running-change-detection-detached-views',
  },
  {
    slug: 'debugging-techniques-angular-devtools',
  },
  {
    slug: 'debugging-techniques-debug-element',
  },
  {
    slug: 'debugging-techniques-global-utils',
  },
  {
    slug: 'expression-changed-error-overview',
  },
  {
    slug: 'change-detection-big-picture-operations',
  },
  {
    slug: 'expression-changed-error-causes-and-workarounds',
  },
  {
    slug: 'running-change-detection-components-tree',
  },
  {
    slug: 'optimization-techniques-onpush-strategy',
  },
  {
    slug: 'how-to-implement-automatic-token-insertion-in-requests-using-http-interceptor-angular-tutorials',
  },
  {
    slug: 'bundle-size-improvements-from-deferred-views-in-angular',
  },
  {
    slug: 'strongly-typed-reactive-forms-in-angular',
  },
  {
    slug: 'deferred-components-vs-dynamic-components-in-angular',
  },
  {
    slug: 'diving-into-the-new-angular-control-flow-internals',
  },
  {
    slug: 'full-stack-apps-with-angular-and-nestjs-in-an-nx-monorepo',
  },
  {
    slug: 'angular-analog-and-vite',
  },
  {
    slug: 'the-who-what-when-where-why-and-how-of-image-optimization-in-angular',
  },
  {
    slug: 'useful-chrome-devtools-techniques-when-debugging-change-detection-in-angular',
  },
  {
    slug: 'how-to-use-a-weather-api-to-build-a-dynamic-weather-app',
  },
  {
    slug: 'required-inputs-in-angular-v16',
  },
  {
    slug: 'router-data-as-components-inputs-in-angular-v16',
  },
  {
    slug: 'takeuntildestroy-in-angular-v16',
  },
  {
    slug: 'deep-dive-into-the-onpush-change-detection-strategy-in-angular',
  },
  {
    slug: 'deep-dive-into-the-infamous-expressionchangedafterithasbeencheckederror-in-angular',
  },
  {
    slug: 'from-zone-js-to-zoneless-angular-and-back-how-it-all-works',
  },
  {
    slug: 'change-detection-and-component-trees-in-angular-applications',
  },
  {
    slug: 'improve-page-performance-and-lcp-with-ngoptimizedimage',
  },
  {
    slug: 'rendering-cycle-in-angular-applications-browser-angular-and-zone-js-interaction',
  },
  {
    slug: 'rendering-cycle',
  },
  {
    slug: 'overview-of-angulars-change-detection-operations-in-ivy',
  },
  {
    slug: 'component-initialization-without-ngoninit-with-async-pipes-for-observables-and-ngonchanges',
  },
  {
    slug: 'an-introduction-to-blockchain',
  },
  {
    slug: 'external-configurations-in-angular',
  },
  {
    slug: 'exploring-how-virtual-dom-is-implemented-in-react',
  },
  {
    slug: 'ukraine-and-in-depths-founder-need-your-help',
  },
  {
    slug: 'why-component-identifiers-must-be-capitalized-in-react',
  },
  {
    slug: '101-javascript-critical-rendering-path',
  },
  {
    slug: 'webpack-an-in-depth-introduction-to-splitchunksplugin',
  },
  {
    slug: 'overview-of-oop-patterns-implementation-in-javascript',
  },
  {
    slug: 'complete-guide-angular-lifecycle-hooks',
  },
  {
    slug: 'attaching-new-behaviors-through-decorators-in-javascript',
  },
  {
    slug: 'state-machines-in-javascript-with-xstate',
  },
  {
    slug: 'an-overview-of-state-management-solutions-for-react-and-nextjs',
  },
  {
    slug: 'the-controllers-of-component-concept-in-angular-part-ii',
  },
  {
    slug: 'demistifying-webpacks-import-function-using-dynamic-arguments',
  },
  {
    slug: 'the-micro-frontend-chaos-and-how-to-solve-it',
  },
  {
    slug: 'how-to-deploy-a-run-time-micro-frontend-application-using-aws',
  },
  {
    slug: 'exploring-the-difference-between-disabling-a-form-control-through-reactive-forms-api-and-html-attributes',
  },
  {
    slug: 'an-in-depth-perspective-on-webpacks-bundling-process',
  },
  {
    slug: 'telegraph-with-rxjs-the-power-of-reactive-systems',
  },
  {
    slug: 'typesafe-code-with-immer-and-where-it-can-help-in-ngrx',
  },
  {
    slug: 'tracking-user-interaction-area',
  },
  {
    slug: 'designing-angular-architecture-container-presentation-pattern',
  },
  {
    slug: 'taking-micro-frontends-to-the-next-level',
  },
  {
    slug: 'how-oop-is-mistreated-in-angular',
  },
  {
    slug: 'angular-self-saving-dropdowns-yet-another-directive',
  },
  {
    slug: 'leveraging-dependency-injection-to-reduce-duplicated-code-in-angular',
  },
  {
    slug: 'craft-a-complete-gitlab-pipeline-for-angular-part-2',
  },
  {
    slug: 'techniques-to-style-component-host-element-in-angular',
  },
  {
    slug: 'faster-perceived-response-time-with-angular-material-to-tackle-need-for-speed',
  },
  {
    slug: 'how-to-use-controlvalueaccessor-to-enhance-date-input-with-automatic-conversion-and-validation',
  },
  {
    slug: 'how-taiga-ui-cdk-can-help-you-simplify-your-working-with-angular-our-5-best-practices',
  },
  {
    slug: 'adding-a-layer-of-more-explicit-typings-on-top-of-3rd-party-library-interfaces',
  },
  {
    slug: 'bindon-lesser-known-angular-template-features',
  },
  {
    slug: 'angular-forms-reactive-design-patterns-catalog',
  },
  {
    slug: 'a-journey-into-ngrx-selectors',
  },
  {
    slug: 'how-to-split-http-interceptors-between-multiple-backends',
  },
  {
    slug: 'different-ways-to-run-schematics-from-another-schematics',
  },
  {
    slug: 'how-pure-and-impure-pipes-work-in-angular-ivy',
  },
  {
    slug: 'how-to-use-ts-decorators-to-add-caching-logic-to-api-calls',
  },
  {
    slug: 'global-objects-in-angular',
  },
  {
    slug: 'ngrx-best-practices',
  },
  {
    slug: 'how-we-make-our-base-components-more-flexible-controllers-concept-in-angular',
  },
  {
    slug: 'add-support-for-reduced-motion-in-angular-animations',
  },
  {
    slug: 'learn-advanced-angular-features-build-the-material-tree',
  },
  {
    slug: 'progressively-migrates-from-a-traditional-server-side-website-to-angular',
  },
  {
    slug: 'ngrx-bad-practices',
  },
  {
    slug: 'handling-realtime-data-storage-in-angular-using-firebase-cloud-firestore',
  },
  {
    slug: 'learn-angular-component-design-patterns-creating-a-drawer-component',
  },
  {
    slug: 'running-event-listeners-outside-of-the-ngzone',
  },
  {
    slug: 'extend-angular-schematics-to-customize-your-development-process',
  },
  {
    slug: 'angular-universal-real-app-problems',
  },
  {
    slug: 'view-state-selector-angular-design-pattern',
  },
  {
    slug: 'rxjs-why-memory-leaks-occur-when-using-a-subject',
  },
  {
    slug: 'building-a-type-agnostic-cache-using-generics-in-typescript',
  },
  {
    slug: 'making-hostbinding-work-with-observables',
  },
  {
    slug: 'implementing-reusable-and-reactive-forms-in-angular',
  },
  {
    slug: 'how-to-refactor-an-angular-codebase',
  },
  {
    slug: 'rxjs-custom-operators',
  },
  {
    slug: 'headless-angular-components',
  },
  {
    slug: 'building-web-desktop-and-mobile-apps-from-a-single-codebase-using-angular',
  },
  {
    slug: 'subtle-difference-between-map-and-pluck-rxjs-operators-that-you-should-know',
  },
  {
    slug: 'rxjs-in-angular-part-iii',
  },
  {
    slug: 'angular-and-solid-principles',
  },
  {
    slug: 'demystifying-taiga-ui-root-component-portals-pattern-in-angular',
  },
  {
    slug: 'taiga-ui-is-a-new-angular-ui-kit-that-you-should-try',
  },
  {
    slug: 'throwerror-is-not-throw-error',
  },
  {
    slug: 'simple-angular-context-help-component-or-how-global-event-listener-can-affect-your-performance',
  },
  {
    slug: 'how-to-manage-component-state-in-angular-using-ngrx-component-store',
  },
  {
    slug: 'bulletproof-angular-angular-strict-mode-explained',
  },
  {
    slug: 'building-a-react-static-site-generator-with-partial-hydration-in',
  },
  {
    slug: 'building-a-react-static-site-generator-in-20-lines-of-code-4-dependencies-and-no-transpilers',
  },
  {
    slug: 'better-action-hygiene-with-events-in-ngrx',
  },
  {
    slug: 'ngtemplateoutlet-the-secret-to-customisation',
  },
  {
    slug: 'declarative-reactive-data-and-action-streams-in-angular',
  },
  {
    slug: 'create-a-directive-for-free-dragging-in-angular',
  },
  {
    slug: 'rendering-dynamic-components-by-selector-name-in-ivy',
  },
  {
    slug: 'craft-a-complete-gitlab-pipeline-for-angular-part-1',
  },
  {
    slug: 'angular-11-towards-the-type-safety',
  },
  {
    slug: 'make-your-mark-with-indepthdev',
  },
  {
    slug: 'theming-angular-app-its-libraries',
  },
  {
    slug: 'visual-regression-testing-with-cypress-and-angular',
  },
  {
    slug: 'angular-lazy-load-common-styles-specific-to-a-feature-module',
  },
  {
    slug: 'responsive-angular-components',
  },
  {
    slug: 'localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end',
  },
  {
    slug: 'immutability-importance-in-angular-applications',
  },
  {
    slug: 'angular-router-revealing-some-interesting-facts-and-features',
  },
  {
    slug: 'how-to-stop-being-afraid-and-create-your-own-angular-cli-builder',
  },
  {
    slug: 'bring-reactivity-to-your-angular-templates-with-the-letdirective-part-2',
  },
  {
    slug: 'understanding-ngrx-component-store-selector-debouncing',
  },
  {
    slug: 'observer-apis-in-javascript-part-ii',
  },
  {
    slug: 'announcing-stryker-4-0-mutation-switching',
  },
  {
    slug: 'bring-reactivity-to-your-angular-templates-with-the-letdirective-part-1',
  },
  {
    slug: 'migrate-from-css-to-scss-stylesheets-for-an-existing-angular-project',
  },
  {
    slug: 'the-journey-to-isomorphic-rendering-performance',
  },
  {
    slug: 'new-possibilities-with-angulars-push-pipe-part-2',
  },
  {
    slug: 'useful-techniques-for-debugging-code-using-chrome-devtools',
  },
  {
    slug: 'compliant-components-declarative-approach-in-angular',
  },
  {
    slug: 'demystifying-angular-router-what-is-routerscroller-and-why-is-it-useful',
  },
  {
    slug: 'implementing-angular-schematics-using-angular-tailwind-css-example',
  },
  {
    slug: 'taking-react-animations-to-the-next-level-with-react-spring',
  },
  {
    slug: 'the-state-of-rxjs-rxjs-7-and-beyond',
  },
  {
    slug: 'customization-with-ng2-charts-an-easy-way-to-visualize-data',
  },
  {
    slug: 'speed-up-your-angular-schematics-development-with-useful-helper-functions',
  },
  {
    slug: 'observer-apis-in-javascript-part-i',
  },
  {
    slug: 'how-to-do-dom-manipulation-properly-in-angular',
  },
  {
    slug: 'angular-schematics-from-0-to-publishing-your-own-library-iv',
  },
  {
    slug: 'angular-schematics-from-0-to-publishing-your-own-library-ii',
  },
  {
    slug: 'angular-schematics-from-0-to-publishing-your-own-library-i',
  },
  {
    slug: 'angular-schematics-from-0-to-publishing-your-own-library-iii',
  },
  {
    slug: 'custom-theme-for-angular-material-components-series-part-3-apply-theme',
  },
  {
    slug: 'write-better-automated-tests-with-cypress-in-angular',
  },
  {
    slug: 'firebase-ngxs-the-perfect-couple',
  },
  {
    slug: 'build-your-angular-app-once-deploy-anywhere',
  },
  {
    slug: 'angular-forms-why-is-ngmodelchange-late-when-updating-ngmodel-value',
  },
  {
    slug: 'a-note-on-vite-a-very-fast-dev-build-tool-ii',
  },
  {
    slug: 'ngrx-use-effects-and-router-store-to-isolate-route-related-side-effects',
  },
  {
    slug: 'custom-theme-for-angular-material-components-series-part-2-understand-theme',
  },
  {
    slug: 'how-i-got-rid-of-state-observables-in-angular',
  },
  {
    slug: 'the-updateon-option-in-angular-forms',
  },
  {
    slug: 'the-best-way-to-implement-custom-validators',
  },
  {
    slug: 'my-journey-into-tech',
  },
  {
    slug: 'a-note-on-vite-a-very-fast-dev-build-tool-i',
  },
  {
    slug: 'custom-theme-for-angular-material-components-series-part-1-create-a-theme',
  },
  {
    slug: 'make-ngrx-hold-business-logic-dumb-components-smart-store',
  },
  {
    slug: 'new-possibilities-with-angulars-push-pipe-part-1',
  },
  {
    slug: 'angular-cdk-coercion-the-missing-api-reference',
  },
  {
    slug: 'rxjs-in-angular-part-ii',
  },
  {
    slug: 'agnostic-components-in-angular',
  },
  {
    slug: 'angular-10-towards-the-better-future-for-angular',
  },
  {
    slug: 'effective-rxjs-marble-testing',
  },
  {
    slug: 'the-10-best-angular-tips-selected-by-the-community',
  },
  {
    slug: 'creating-elegant-reactive-forms-with-rxwebvalidators',
  },
  {
    slug: 'how-to-migrate-wordpress-to-scully',
  },
  {
    slug: 'make-the-most-of-angular-di-private-providers-concept',
  },
  {
    slug: 'angular-css-modules',
  },
  {
    slug: '5-tips-to-boost-your-angular-skills',
  },
  {
    slug: 'in-depth-guide-into-animations-in-angular',
  },
  {
    slug: 'building-a-reusable-menu-component',
  },
  {
    slug: 'double-question-marks-typescript-3-7-nullish-coalescing',
  },
  {
    slug: 'using-angular-in-the-right-way-template-syntax',
  },
  {
    slug: 'improved-error-logging-by-the-angular-aot-compiler',
  },
  {
    slug: 'convert-into-strongly-typed-angular-forms-in-a-minute',
  },
  {
    slug: 'rxjs-the-unexpected',
  },
  {
    slug: 'solidjs-reactivity-to-rendering',
  },
  {
    slug: 'heres-what-you-should-know-when-creating-flexible-and-reusable-components-in-angular',
  },
  {
    slug: 'rxjs-heads-up-topromise-is-being-deprecated',
  },
  {
    slug: 'building-a-custom-stepper-using-angular-cdk',
  },
  {
    slug: 'exploring-the-state-of-reactivity-patterns-in-2020',
  },
  {
    slug: 'setting-up-efficient-workflows-with-eslint-prettier-and-typescript',
  },
  {
    slug: 'reduce-your-bundle-size-through-this-component-styling-technique',
  },
  {
    slug: 'angular-the-unexpected',
  },
  {
    slug: 'implementing-shared-logic-for-crud-ui-components-in-angular',
  },
  {
    slug: 'a-gentle-introduction-into-tree-shaking-in-angular-ivy',
  },
  {
    slug: 'complete-beginner-guide-to-publishing-an-angular-library-to-npm',
  },
  {
    slug: 'how-to-cancel-a-component-event-from-output-properties-in-angular',
  },
  {
    slug: 'modelling-asynchronous-flows-using-promises-and-a-use-case-for-deferred',
  },
  {
    slug: 'under-the-hood-of-type-systems-e-g-typescript',
  },
  {
    slug: 'code-sharing-made-easy-in-a-full-stack-app-with-nx-angular-and-nestjs',
  },
  {
    slug: 'create-your-angular-unit-test-spies-automagically',
  },
  {
    slug: 'angular-cli-flows-big-picture',
  },
  {
    slug: 'simplifying-web-components-usage-with-angular-elements',
  },
  {
    slug: 'building-and-consuming-angular-elements-as-web-components',
  },
  {
    slug: 'automate-angular-application-deployment-via-aws-codepipeline',
  },
  {
    slug: 'how-to-read-azure-dev-ops-logs-from-node-js-using-rest-api',
  },
  {
    slug: 'angular-forms-useful-tips',
  },
  {
    slug: 'create-a-taponce-custom-rxjs-operator',
  },
  {
    slug: 'understanding-the-magic-behind-ngrx-effects',
  },
  {
    slug: 'angular-with-ivy-build-performance-review',
  },
  {
    slug: 'switch-themes-like-a-fox-based-on-ambient-light-in-your-angular-apps',
  },
  {
    slug: 'lets-implement-a-theme-switch-like-the-angular-material-site',
  },
  {
    slug: 'implement-google-sign-inoauth-in-your-angular-app-in-under-15-minutes',
  },
  {
    slug: 'easier-angular-ivy-debugging-with-a-chrome-extension',
  },
  {
    slug: 'how-to-automate-npm-package-publishing-with-azure-devops',
  },
  {
    slug: 'under-the-hood-of-web-bundlers-e-g-webpack',
  },
  {
    slug: 'understanding-the-magic-behind-storemodule-of-ngrx-ngrx-store',
  },
  {
    slug: 'what-makes-a-good-angular-library',
  },
  {
    slug: 'angular-forms-story-strong-types',
  },
  {
    slug: 'rxjs-for-await-what',
  },
  {
    slug: 'lazy-loading-angular-components-from-non-angular-applications',
  },
  {
    slug: 'create-your-standalone-angular-library-in-10-minutes',
  },
  {
    slug: 'stop-using-shared-material-module',
  },
  {
    slug: 'angular-bad-practices-revisited',
  },
  {
    slug: 'how-to-use-the-environment-for-specific-http-services',
  },
  {
    slug: 'how-to-debug-a-child-process-in-node-and-gatsby-js-with-chrome',
  },
  {
    slug: 'adding-ngrx-to-your-existing-applications',
  },
  {
    slug: 'inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react',
  },
  {
    slug: 'this-is-how-angular-cli-webpack-delivers-your-css-styles-to-the-client',
  },
  {
    slug: 'a-deep-dive-into-injectable-and-providedin-in-ivy',
  },
  {
    slug: 'webpack-5-module-federation-a-game-changer-in-javascript-architecture',
  },
  {
    slug: 'angular-keeping-it-fat-dumb-and-happy',
  },
  {
    slug: 'angular-the-viewmodel-of-a-component-as-an-observable',
  },
  {
    slug: 'declarative-internet-shopping-with-payment-request-api-and-angular',
  },
  {
    slug: 'lazy-loading-angular-modules-with-ivy',
  },
  {
    slug: 'becoming-a-git-pro-part-1-internal-git-architecture',
  },
  {
    slug: 'shell-library-patterns-with-nx-and-monorepo-architectures',
  },
  {
    slug: 'this-will-make-you-more-efficient-at-debugging-webpack-unspecified-build-errors',
  },
  {
    slug: 'rxjs-in-angular-part-i',
  },
  {
    slug: 'here-is-why-appendchild-moves-a-dom-node-between-parents',
  },
  {
    slug: 'dijkstra-was-right-recursion-should-not-be-difficult',
  },
  {
    slug: 'supercharge-event-management-in-your-angular-application',
  },
  {
    slug: 'gentle-introduction-into-compilers-part-1-lexical-analysis-and-scanner',
  },
  {
    slug: 'how-not-to-trick-typescript-compiler-and-not-be-tricked-by-it',
  },
  {
    slug: 'angular-a11y-11-tips-on-how-to-make-your-apps-more-accessible',
  },
  {
    slug: 'how-to-avoid-angular-injectable-instances-duplication',
  },
  {
    slug: 'exploring-the-httpclientmodule-in-angular',
  },
  {
    slug: 'a-thorough-exploration-of-angular-forms',
  },
  {
    slug: 'angular-and-internet-explorer',
  },
  {
    slug: 'a-detailed-look-at-angulars-root-and-any-provider-scopes',
  },
  {
    slug: 'getting-inside-angulars-elementschemaregistry-mechanism',
  },
  {
    slug: 'angular-web-components-a-complete-guide',
  },
  {
    slug: 'scully-the-first-static-site-generator-for-angular',
  },
  {
    slug: 'top-15-angular-indepth-articles-of-2019',
  },
  {
    slug: 'rx-js-operators-part-ii',
  },
  {
    slug: 'writing-custom-virtual-scroll-strategy-in-angular-apps',
  },
  {
    slug: 'exploring-angular-dom-manipulation-techniques-using-viewcontainerref',
  },
  {
    slug: 'here-is-what-you-need-to-know-about-dynamic-components-in-angular',
  },
  {
    slug: 'exciting-times-ahead-be-ready-for-angular-9',
  },
  {
    slug: 'creating-a-sketchpad-with-angular-and-p5js',
  },
  {
    slug: 'why-do-we-have-dependency-injection-in-web-development',
  },
  {
    slug: 'angular-tools-you-should-be-aware-of',
  },
  {
    slug: 'inside-ag-grid-techniques-to-make-the-fastest-javascript-datagrid-in-the-world',
  },
  {
    slug: 'overriding-angular-schematics',
  },
  {
    slug: 'whats-new-after-angular-8',
  },
  {
    slug: 'angular-show-loading-indicator-when-obs-async-is-not-yet-resolved',
  },
  {
    slug: 'implementing-multi-language-angular-applications-rendered-on-a-server-ssr',
  },
  {
    slug: 'how-in-depth-knowledge-of-change-detection-in-angular-helped-me-improve-applications-performance',
  },
  {
    slug: 'asynchronous-modules-and-components-in-angular-ivy',
  },
  {
    slug: 'angular-cli-builders',
  },
  {
    slug: 'optimizing-events-handling-in-angular',
  },
  {
    slug: 'building-an-api-with-firebase',
  },
  {
    slug: 'finding-fine-grained-reactive-programming',
  },
  {
    slug: 'mastering-rxjs-operators-and-functions-that-can-bite-you-when-you-dont-expect',
  },
  {
    slug: 'angular-platforms-in-depth-part-3-rendering-angular-applications-in-terminal',
  },
  {
    slug: 'angular-platforms-in-depth-part-2-application-bootstrap-process',
  },
  {
    slug: 'type-checking-templates-in-angular-viewengine-and-ivy',
  },
  {
    slug: 'type-checking-templates-in-angular-view-engine-and-ivy',
  },
  {
    slug: 'angular-platforms-in-depth-part-1-what-are-angular-platforms',
  },
  {
    slug: 'beware-angular-can-steal-your-time',
  },
  {
    slug: 'optimize-angular-bundle-size-in-4-steps',
  },
  {
    slug: 'designing-scalable-angular-applications',
  },
  {
    slug: 'how-cypress-makes-testing-fun',
  },
  {
    slug: 'rxjs-recipes-forkjoin-with-the-progress-of-completion-for-bulk-network-requests-in-angular',
  },
  {
    slug: 'having-fun-with-angular-and-typescript-transformers',
  },
  {
    slug: 'brace-yourself-angular-8-is-coming',
  },
  {
    slug: 'code-splitting-in-angular-or-how-to-share-components-between-lazy-modules',
  },
  {
    slug: 'angular-ivy-change-detection-execution-are-you-prepared',
  },
  {
    slug: 'why-building-with-a-jamstack-is-awesome',
  },
  {
    slug: 'doing-a11y-easily-with-angular-cdk-keyboard-navigable-lists',
  },
  {
    slug: 'why-firebase-cloud-functions-are-awesome',
  },
  {
    slug: 'rxjs-repeat-operator-beginner-necromancer-guide',
  },
  {
    slug: 'fastest-way-to-cache-for-lazy-developers-angular-with-rxjs',
  },
  {
    slug: 'npm-peer-dependencies',
  },
  {
    slug: 'making-an-angular-project-mono-repo-with-ngrx-state-management-and-lazy-loading',
  },
  {
    slug: 'how-to-start-flying-with-angular-and-ngrx',
  },
  {
    slug: 'ngrx-how-and-where-to-handle-loading-and-error-states-of-ajax-calls',
  },
  {
    slug: 'angular-unit-testing-viewchild',
  },
  {
    slug: 'how-to-debounce-an-input-while-skipping-the-first-entry',
  },
  {
    slug: 'building-an-extensible-dynamic-pluggable-enterprise-application-with-angular',
  },
  {
    slug: 'i-changed-my-implementation-of-an-extremely-deeply-nested-angular-reactive-form-and-you-wont-believe-what-happened',
  },
  {
    slug: 'tooltip-with-angular-cdk',
  },
  {
    slug: 'developments-in-web-components-im-excited-about-in-2019',
  },
  {
    slug: 'throttling-notifications-from-multiple-users-with-rxjs',
  },
  {
    slug: 'understanding-enumerations',
  },
  {
    slug: 'how-the-angularfire-library-makes-firebase-feel-like-magic',
  },
  {
    slug: 'why-react-suspense-will-be-a-game-changer',
  },
  {
    slug: 'angular-di-getting-to-know-the-ivy-nodeinjector',
  },
  {
    slug: 'do-you-know-how-angular-transforms-your-code',
  },
  {
    slug: 'rxjs-applying-asyncscheduler-as-an-argument-vs-with-observeon-operator',
  },
  {
    slug: 'angular-cli-camelcase-or-kebab-case',
  },
  {
    slug: 'reading-the-rxjs-6-sources-map-and-pipe',
  },
  {
    slug: 'angular-nested-reactive-forms-using-controlvalueaccessorscvas',
  },
  {
    slug: 'rxjs-in-angular-when-to-subscribe-rarely',
  },
  {
    slug: 'connecting-the-dots-where-hard-work-and-dreams-can-lead-you',
  },
  {
    slug: 'angular-workspace-no-application-for-you',
  },
  {
    slug: 'the-angular-devops-series-deploying-to-firebase-with-circleci',
  },
  {
    slug: 'improved-navigation-in-angular-7-with-switchmap',
  },
  {
    slug: 'in-depth-explanation-of-state-and-props-update-in-react',
  },
  {
    slug: 'new-in-angular-7-1-router-updates',
  },
  {
    slug: 'a-gentle-introduction-into-change-detection-in-angular',
  },
  {
    slug: 'building-interactive-lists-with-the-new-angular-7-drag-and-drop-tool',
  },
  {
    slug: 'how-to-reuse-common-layouts-in-angular-using-router',
  },
  {
    slug: 'the-difference-between-ngdocheck-and-asyncpipe-in-onpush-components',
  },
  {
    slug: 'angular-router-series-pillar-3-lazy-loading-aot-and-preloading',
  },
  {
    slug: 'how-to-read-the-rxjs-6-sources-part-1-understanding-of-and-subscriptions',
  },
  {
    slug: 'angular-router-series-pillar-2-understanding-the-routers-navigation-cycle',
  },
  {
    slug: 'what-every-front-end-developer-should-know-about-change-detection-in-angular-and-react',
  },
  {
    slug: 'the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-to-walk-the-components-tree',
  },
  {
    slug: 'exploring-drag-and-drop-with-the-new-angular-material-cdk',
  },
  {
    slug: 'angular-flex-layout-flexbox-and-grid-layout-for-angular-component',
  },
  {
    slug: 'build-your-own-observable-part-4-map-filter-take-and-all-that-jazz',
  },
  {
    slug: 'angular-router-series-secondary-outlets-primer',
  },
  {
    slug: 'the-three-pillars-of-the-angular-router-router-states-and-url-matching',
  },
  {
    slug: 'a-comparison-between-angular-and-react-and-their-core-languages',
  },
  {
    slug: 'the-three-pillars-of-angular-routing-angular-router-series-introduction',
  },
  {
    slug: 'the-angular-library-series-publishing',
  },
  {
    slug: 'practical-application-of-reverse-engineering-guidelines-and-principles',
  },
  {
    slug: 'level-up-your-reverse-engineering-skills',
  },
  {
    slug: 'angular-testing-with-headless-chrome',
  },
  {
    slug: 'building-your-own-observable-part-3-the-observer-pattern-and-creational-methods',
  },
  {
    slug: 'build-your-own-observable-part-2-containers-and-intuition',
  },
  {
    slug: 'becoming-an-angular-environmentalist',
  },
  {
    slug: 'build-your-own-observable-part-1-arrays',
  },
  {
    slug: 'the-angular-library-series-building-and-packaging',
  },
  {
    slug: 'a-curious-case-of-the-host-decorator-and-element-injectors-in-angular',
  },
  {
    slug: 'power-of-rxjs-when-using-exponential-backoff',
  },
  {
    slug: 'creating-a-library-in-angular-6-using-angular-cli-and-ng-packagr',
  },
  {
    slug: 'ivy-engine-in-angular-first-in-depth-look-at-compilation-runtime-and-change-detection',
  },
  {
    slug: 'working-with-dom-in-angular-unexpected-consequences-and-optimization-techniques',
  },
  {
    slug: 'gestures-in-an-angular-application',
  },
  {
    slug: 'deploy-an-angular-application-to-iis',
  },
  {
    slug: 'what-you-always-wanted-to-know-about-angular-dependency-injection-tree',
  },
  {
    slug: 'catch-angular-template-errors-like-a-pro-or-how-i-create-angular-demo',
  },
  {
    slug: 'dynamically-loading-components-with-angular-cli',
  },
  {
    slug: 'insiders-guide-into-interceptors-and-httpclient-mechanics-in-angular',
  },
  {
    slug: 'he-who-thinks-change-detection-is-depth-first-and-he-who-thinks-its-breadth-first-are-both-usually-right',
  },
  {
    slug: 'learn-to-combine-rxjs-sequences-with-super-intuitive-interactive-diagrams',
  },
  {
    slug: 'here-is-what-you-need-to-know-about-javascripts-number-type',
  },
  {
    slug: 'do-you-really-know-what-unidirectional-data-flow-means-in-angular',
  },
  {
    slug: 'do-you-still-think-that-ngzone-zone-js-is-required-for-change-detection-in-angular',
  },
  {
    slug: 'these-5-articles-will-make-you-an-angular-change-detection-expert',
  },
  {
    slug: 'the-essential-difference-between-constructor-and-ngoninit-in-angular',
  },
  {
    slug: 'i-reverse-engineered-zones-zone-js-and-here-is-what-ive-found',
  },
  {
    slug: 'never-again-be-confused-when-implementing-controlvalueaccessor-in-angular-forms',
  },
  {
    slug: 'the-essential-difference-between-pure-and-impure-pipes-in-angular-and-why-that-matters',
  },
  {
    slug: 'the-new-angular-httpclient-api',
  },
  {
    slug: 'if-you-think-ngdocheck-means-your-component-is-being-checked-read-this-article',
  },
  {
    slug: 'avoiding-common-confusions-with-modules-in-angular',
  },
  {
    slug: 'what-is-forwardref-in-angular-and-why-we-need-it',
  },
  {
    slug: 'how-to-manually-bootstrap-an-angular-application',
  },
  {
    slug: 'a-deep-deep-deep-deep-deep-dive-into-the-angular-compiler',
  },
  {
    slug: 'everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error',
  },
  {
    slug: 'the-mechanics-of-property-bindings-update-in-angular',
  },
  {
    slug: 'here-is-why-you-will-not-find-components-inside-angular',
  },
  {
    slug: 'the-mechanics-of-dom-updates-in-angular',
  },
  {
    slug: 'here-is-how-to-get-viewcontainerref-before-viewchild-query-is-evaluated',
  },
  {
    slug: 'implementing-custom-component-decorator-in-angular',
  },
  {
    slug: 'everything-you-need-to-know-about-debugging-angular-applications',
  },
  {
    slug: 'hooking-into-the-angular-bootstrap-process',
  },
  {
    slug: 'es6-iterators-and-generators-by-example',
  },
  {
    slug: 'angulars-digest-is-reborn-in-the-newer-version-of-angular',
  },
  {
    slug: 'everything-you-need-to-know-about-change-detection-in-angular',
  },
  {
    slug: 'configuring-typescript-compiler',
  },
  {
    slug: 'how-to-round-binary-numbers',
  },
  {
    slug: 'the-mechanics-behind-exponent-bias-in-floating-point',
  },
  {
    slug: 'the-simple-math-behind-decimal-binary-conversion-algorithms',
  },
];
const wrongSlugs = [
  { slug: 'change-detection-big-picture-rendering-cycle' },
  { slug: 'running-change-detection-manual-control' },
  { slug: 'expression-changed-error-debugging-algorithm' },
  { slug: 'rendering-cycle' },
  { slug: 'craft-a-complete-gitlab-pipeline-for-angular-part-2' },
  { slug: 'new-possibilities-with-angulars-push-pipe-part-2' },
  { slug: 'angular-cli-flows-big-picture' },
  { slug: 'a-deep-dive-into-injectable-and-providedin-in-ivy' },
  { slug: 'getting-inside-angulars-elementschemaregistry-mechanism' },
  { slug: 'top-15-angular-indepth-articles-of-2019' },
  { slug: 'do-you-know-how-angular-transforms-your-code' },
  { slug: 'the-angular-library-series-building-and-packaging' },
];
test.describe('migrated articles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  wrongSlugs.forEach(({ slug }) => {
    test(`should proper display ${slug}`, async ({ page }) => {
      await page.goto(`/en/${slug}`);

      const title = await page.locator('#article-title');

      await expect(title).toBeVisible();
      await expect(page).toHaveURL(`/en/${slug}`);
    });
  });
});
