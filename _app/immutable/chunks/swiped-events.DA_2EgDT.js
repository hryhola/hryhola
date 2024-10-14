/*!
 * swiped-events.js - v@version@
 * Pure JavaScript swipe events
 * https://github.com/john-doherty/swiped-events
 * @inspiration https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */(function(h,a){typeof h.CustomEvent!="function"&&(h.CustomEvent=function(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var n=a.createEvent("CustomEvent");return n.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),n},h.CustomEvent.prototype=h.Event.prototype),a.addEventListener("touchstart",g,!1),a.addEventListener("touchmove",y,!1),a.addEventListener("touchend",w,!1);var u=null,l=null,s=null,o=null,d=null,i=null,p=0;function w(t){if(i===t.target){var e=parseInt(v(i,"data-swipe-threshold","20"),10),n=v(i,"data-swipe-unit","px"),c=parseInt(v(i,"data-swipe-timeout","500"),10),b=Date.now()-d,r="",f=t.changedTouches||t.touches||[];if(n==="vh"&&(e=Math.round(e/100*a.documentElement.clientHeight)),n==="vw"&&(e=Math.round(e/100*a.documentElement.clientWidth)),Math.abs(s)>Math.abs(o)?Math.abs(s)>e&&b<c&&(s>0?r="swiped-left":r="swiped-right"):Math.abs(o)>e&&b<c&&(o>0?r="swiped-up":r="swiped-down"),r!==""){var E={dir:r.replace(/swiped-/,""),touchType:(f[0]||{}).touchType||"direct",fingers:p,xStart:parseInt(u,10),xEnd:parseInt((f[0]||{}).clientX||-1,10),yStart:parseInt(l,10),yEnd:parseInt((f[0]||{}).clientY||-1,10)};i.dispatchEvent(new CustomEvent("swiped",{bubbles:!0,cancelable:!0,detail:E})),i.dispatchEvent(new CustomEvent(r,{bubbles:!0,cancelable:!0,detail:E}))}u=null,l=null,d=null}}function g(t){t.target.getAttribute("data-swipe-ignore")!=="true"&&(i=t.target,d=Date.now(),u=t.touches[0].clientX,l=t.touches[0].clientY,s=0,o=0,p=t.touches.length)}function y(t){if(!(!u||!l)){var e=t.touches[0].clientX,n=t.touches[0].clientY;s=u-e,o=l-n}}function v(t,e,n){for(;t&&t!==a.documentElement;){var c=t.getAttribute(e);if(c)return c;t=t.parentNode}return n}})(window,document);