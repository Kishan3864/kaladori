/**
 * Browser extensions (Bitdefender TrafficLight, Grammarly, LanguageTool,
 * ColorZilla...) write their own attributes into the page before React
 * hydrates it. React then reports "hydration mismatch" errors in the console
 * although nothing on the site is wrong.
 *
 * This inline script runs first thing in <head>: it strips those attributes
 * as they appear, so React finds exactly the HTML the server sent. It stops
 * itself shortly after the app has hydrated (see components/providers.tsx),
 * or after 12 seconds at the latest, so it never fights an extension for long.
 */
const EXTENSION_ATTRS = String.raw`^(bis_|__processed_|data-gr-|data-new-gr-|data-lt-|cz-shortcut|data-dashlane|data-lastpass)`;

export const extensionGuardScript = `(function(){try{
var B=new RegExp(${JSON.stringify(EXTENSION_ATTRS)});
function c(e){var a=e.attributes;if(!a)return;for(var i=a.length-1;i>=0;i--){if(B.test(a[i].name))e.removeAttribute(a[i].name);}}
function s(r){c(r);var l=r.getElementsByTagName("*");for(var i=0;i<l.length;i++)c(l[i]);}
var o=new MutationObserver(function(m){for(var i=0;i<m.length;i++){var x=m[i];if(x.type==="attributes"){if(B.test(x.attributeName))x.target.removeAttribute(x.attributeName);}else{for(var j=0;j<x.addedNodes.length;j++){var n=x.addedNodes[j];if(n.nodeType===1)s(n);}}}});
o.observe(document.documentElement,{subtree:true,childList:true,attributes:true});
var t=setTimeout(function(){o.disconnect();},12000);
window.__kdHydrated=function(){setTimeout(function(){clearTimeout(t);o.disconnect();},2500);};
}catch(e){}})();`;
