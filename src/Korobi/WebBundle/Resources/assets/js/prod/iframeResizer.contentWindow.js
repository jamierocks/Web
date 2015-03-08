/*! iFrame Resizer (iframeSizer.contentWindow.min.js) - v2.8.0 - 2015-01-19
 *  Desc: Include this file in any page being loaded into an iframe
 *        to force the iframe to resize to the content size.
 *  Requires: iframeResizer.min.js on host page.
 *  Copyright: (c) 2015 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */

!function(){"use strict";function a(a,b,c){"addEventListener"in window?a.addEventListener(b,c,!1):"attachEvent"in window&&a.attachEvent("on"+b,c)}function b(a){return ab+"["+cb+"] "+a}function c(a){_&&"object"==typeof window.console&&console.log(b(a))}function d(a){"object"==typeof window.console&&console.warn(b(a))}function e(){c("Initialising iFrame"),f(),i(),h("background",M),h("padding",P),o(),m(),j(),q(),n(),Z=p(),E("init","Init message from host page")}function f(){function a(a){return"true"===a?!0:!1}var b=Y.substr(bb).split(":");cb=b[0],N=void 0!==b[1]?Number(b[1]):N,Q=void 0!==b[2]?a(b[2]):Q,_=void 0!==b[3]?a(b[3]):_,$=void 0!==b[4]?Number(b[4]):$,db=void 0!==b[5]?a(b[5]):db,K=void 0!==b[6]?a(b[6]):K,O=b[7],W=void 0!==b[8]?b[8]:W,M=b[9],P=b[10],hb=void 0!==b[11]?Number(b[11]):hb}function g(a,b){return-1!==b.indexOf("-")&&(d("Negative CSS value ignored for "+a),b=""),b}function h(a,b){void 0!==b&&""!==b&&"null"!==b&&(document.body.style[a]=b,c("Body "+a+' set to "'+b+'"'))}function i(){void 0===O&&(O=N+"px"),g("margin",O),h("margin",O)}function j(){document.documentElement.style.height="",document.body.style.height="",c('HTML & body height set to "auto"')}function k(b){function d(c){a(window,c,function(){E(b.eventName,b.eventType)})}b.eventNames&&Array.prototype.map?(b.eventName=b.eventNames[0],b.eventNames.map(d)):d(b.eventName),c("Added event listener: "+b.eventType)}function l(){k({eventType:"Animation Start",eventNames:["animationstart","webkitAnimationStart"]}),k({eventType:"Animation Iteration",eventNames:["animationiteration","webkitAnimationIteration"]}),k({eventType:"Animation End",eventNames:["animationend","webkitAnimationEnd"]}),k({eventType:"Device Orientation Change",eventName:"deviceorientation"}),k({eventType:"Transition End",eventNames:["transitionend","webkitTransitionEnd","MSTransitionEnd","oTransitionEnd","otransitionend"]}),k({eventType:"Window Clicked",eventName:"click"}),k({eventType:"Window Resized",eventName:"resize"})}function m(){V!==W&&(W in lb||(d(W+" is not a valid option for heightCalculationMethod."),W="bodyScroll"),c('Height calculation method set to "'+W+'"'))}function n(){!0===K?(l(),t()):c("Auto Resize disabled")}function o(){var a=document.createElement("div");a.style.clear="both",a.style.display="block",document.body.appendChild(a)}function p(){function b(){return{x:void 0!==window.pageXOffset?window.pageXOffset:document.documentElement.scrollLeft,y:void 0!==window.pageYOffset?window.pageYOffset:document.documentElement.scrollTop}}function e(a){var c=a.getBoundingClientRect(),d=b();return{x:parseInt(c.left,10)+parseInt(d.x,10),y:parseInt(c.top,10)+parseInt(d.y,10)}}function f(a){function b(b){var d=e(b);c("Moving to in page link ("+a+") at x: "+d.x+" y: "+d.y),I(d.y,d.x,"scrollToOffset")}var d=document.querySelector(a)||document.querySelector('[name="'+a.substr(1,999)+'"]');null!==d?b(d):(c("In page link ("+a+") not found in iFrame, so sending to parent"),I(0,0,"inPageLink",a))}function g(){var a=location.hash;""!==a&&"#"!==a&&f(a)}function h(){function b(b){function c(a){a.preventDefault(),f(this.getAttribute("href"))}"#"!==b.getAttribute("href")&&a(b,"click",c)}Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'),b)}function i(){a(window,"hashchange",g)}function j(){setTimeout(g,S)}return Array.prototype.forEach&&document.querySelectorAll?(c("Setting up location.hash handlers"),h(),i(),j()):d("In page linking not fully supported in this browser! (See README.md for IE8 workaround)"),{findTarget:f}}function q(){db&&(c("Enable public methods"),window.parentIFrame={close:function(){E("close","parentIFrame.close()",0,0)},getId:function(){return cb},moveToAnchor:function(a){Z.findTarget(a)},reset:function(){H("parentIFrame.reset")},scrollTo:function(a,b){I(b,a,"scrollTo")},scrollToOffset:function(a,b){I(b,a,"scrollToOffset")},sendMessage:function(a,b){I(0,0,"message",JSON.stringify(a),b)},setHeightCalculationMethod:function(a){W=a,m()},setTargetOrigin:function(a){c("Set targetOrigin: "+a),fb=a},size:function(a,b){var c=""+(a?a:"")+(b?","+b:"");F(),E("size","parentIFrame.size("+c+")",a,b)}})}function r(){0!==$&&(c("setInterval: "+$+"ms"),setInterval(function(){E("interval","setInterval: "+$)},Math.abs($)))}function s(b){function d(b){(void 0===b.height||void 0===b.width||0===b.height||0===b.width)&&(c("Attach listerner to "+b.src),a(b,"load",function(){E("imageLoad","Image loaded")}))}b.forEach(function(a){if("attributes"===a.type&&"src"===a.attributeName)d(a.target);else if("childList"===a.type){var b=a.target.querySelectorAll("img");Array.prototype.forEach.call(b,function(a){d(a)})}})}function t(){function a(){var a=document.querySelector("body"),d={attributes:!0,attributeOldValue:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0},e=new b(function(a){E("mutationObserver","mutationObserver: "+a[0].target+" "+a[0].type),s(a)});c("Enable MutationObserver"),e.observe(a,d)}var b=window.MutationObserver||window.WebKitMutationObserver;b?0>$?r():a():(d("MutationObserver not supported in this browser!"),r())}function u(){function a(a){function b(a){var b=/^\d+(px)?$/i;if(b.test(a))return parseInt(a,L);var d=c.style.left,e=c.runtimeStyle.left;return c.runtimeStyle.left=c.currentStyle.left,c.style.left=a||0,a=c.style.pixelLeft,c.style.left=d,c.runtimeStyle.left=e,a}var c=document.body,d=0;return"defaultView"in document&&"getComputedStyle"in document.defaultView?(d=document.defaultView.getComputedStyle(c,null),d=null!==d?d[a]:0):d=b(c.currentStyle[a]),parseInt(d,L)}return document.body.offsetHeight+a("marginTop")+a("marginBottom")}function v(){return document.body.scrollHeight}function w(){return document.documentElement.offsetHeight}function x(){return document.documentElement.scrollHeight}function y(){for(var a=document.querySelectorAll("body *"),b=a.length,d=0,e=(new Date).getTime(),f=0;b>f;f++)a[f].getBoundingClientRect().bottom>d&&(d=a[f].getBoundingClientRect().bottom);return e=(new Date).getTime()-e,c("Parsed "+b+" HTML elements"),c("LowestElement bottom position calculated in "+e+"ms"),d}function z(){return[u(),v(),w(),x()]}function A(){return Math.max.apply(null,z())}function B(){return Math.min.apply(null,z())}function C(){return Math.max(u(),y())}function D(){return Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)}function E(a,b,d,e){function f(){a in{reset:1,resetPage:1,init:1}||c("Trigger event: "+b)}function g(){T=n,kb=o,I(T,kb,a)}function h(){return ib&&a in R}function i(){function a(a,b){var c=Math.abs(a-b)<=hb;return!c}return n=void 0!==d?d:lb[W](),o=void 0!==e?e:D(),a(T,n)||Q&&a(kb,o)}function j(){return!(a in{init:1,interval:1,size:1})}function k(){return W in eb}function l(){c("No change in size detected")}function m(){j()&&k()?H(b):a in{interval:1}||(f(),l())}var n,o;h()?c("Trigger event cancelled: "+a):i()?(f(),F(),g()):m()}function F(){ib||(ib=!0,c("Trigger event lock on")),clearTimeout(jb),jb=setTimeout(function(){ib=!1,c("Trigger event lock off"),c("--")},S)}function G(a){T=lb[W](),kb=D(),I(T,kb,a)}function H(a){var b=W;W=V,c("Reset trigger event: "+a),F(),G("reset"),W=b}function I(a,b,d,e,f){function g(){void 0===f?f=fb:c("Message targetOrigin: "+f)}function h(){var g=a+":"+b,h=cb+":"+g+":"+d+(void 0!==e?":"+e:"");c("Sending message to host page ("+h+")"),gb.postMessage(ab+h,f)}g(),h()}function J(a){function b(){return ab===(""+a.data).substr(0,bb)}function f(){Y=a.data,gb=a.source,e(),U=!1,setTimeout(function(){X=!1},S)}function g(){X?c("Page reset ignored by init"):(c("Page size reset by host page"),G("resetPage"))}function h(){return a.data.split("]")[1]}function i(){return"iFrameResize"in window}function j(){return a.data.split(":")[2]in{"true":1,"false":1}}b()&&(U&&j()?f():"reset"===h()?g():a.data===Y||i()||d("Unexpected message ("+a.data+")"))}var K=!0,L=10,M="",N=0,O="",P="",Q=!1,R={resize:1,click:1},S=128,T=1,U=!0,V="offset",W=V,X=!0,Y="",Z={},$=32,_=!1,ab="[iFrameSizer]",bb=ab.length,cb="",db=!1,eb={max:1,scroll:1,bodyScroll:1,documentElementScroll:1},fb="*",gb=window.parent,hb=0,ib=!1,jb=null,kb=1,lb={offset:u,bodyOffset:u,bodyScroll:v,documentElementOffset:w,scroll:x,documentElementScroll:x,max:A,min:B,grow:A,lowestElement:C};a(window,"message",J)}();
//# sourceMappingURL=../src/iframeResizer.contentWindow.map