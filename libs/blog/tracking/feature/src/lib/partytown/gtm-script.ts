import { PartyTownScriptFactory } from './partytown.service';

export const gtmScript =
  (id: string): PartyTownScriptFactory =>
  (gtmScript) => {
    gtmScript.setAttribute('type', 'text/plain');
    gtmScript.setAttribute('data-type', 'text/partytown');
    gtmScript.setAttribute('data-category', 'analytics');
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
