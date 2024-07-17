import { ScriptFactory } from '../scripts-loader';

export const initialConsentScript = (): ScriptFactory => (gtmScript) => {
  gtmScript.textContent = `
             window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){dataLayer.push(arguments);}
    
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });
        `;
  return gtmScript;
};

export const gtmScript =
  (id: string): ScriptFactory =>
  (gtmScript) => {
    gtmScript.textContent = `(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
  var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
  j.defer = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', '${id}');`;
    return gtmScript;
  };

export const consentUpdateScript =
  (
    category: 'analytics' | 'ads',
    consentType: 'ad_storage' | 'analytics_storage',
    status: 'granted' | 'denied',
  ): ScriptFactory =>
  (gtmScript) => {
    gtmScript.setAttribute('type', 'text/plain');
    gtmScript.setAttribute(
      'data-category',
      status === 'granted' ? category : `!${category}`,
    );
    gtmScript.textContent = `
    gtag('consent', 'update', {
        '${consentType}': '${status}'
    });
`;
    return gtmScript;
  };
