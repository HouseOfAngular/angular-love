import { translate, translateObject } from '@jsverse/transloco';

import { RoadmapLayer } from '@angular-love/blog/roadmap/ui-roadmap';

export function getTitleLayer(): RoadmapLayer {
  return {
    parentNode: {
      id: 'angular-love',
      title: translate('roadmapPage.introductionNode.title'),
      nodeType: 'angular-love',
      description: translate('roadmapPage.introductionNode.description'),
      additionalDescription: {
        introduction: translate(
          'roadmapPage.introductionNode.additionalDescription.introduction',
        ),
        toPrepareList: Object.values(
          translateObject(
            'roadmapPage.introductionNode.additionalDescription.toPrepareList',
          ) ?? {},
        ),
        ending: translate(
          'roadmapPage.introductionNode.additionalDescription.ending',
        ),
      },
      creators: [
        { name: 'Miłosz Rutkowski', slug: 'milosz-rutkowski' },
        { name: 'Damian Brzeziński', slug: 'damian-brzezinski' },
        { name: 'Łukasz Myszkowski', slug: 'lukaszm' },
        { name: 'Dominik Kalinowski', slug: 'dominik-kalinowski' },
        { name: 'Dawid Gruszczyński', slug: 'dawid-gruszczynski' },
      ],
    },
    childNodes: [],
  };
}
