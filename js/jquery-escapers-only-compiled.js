(function(){function c(){}c.prototype.toString=function(){return this.content};function d(){function a(a){this.content=a}var b=a.prototype=new c;b.constructor=a;b.contentKind=0;return a}var f=d(0),g=d(1),h=d(2);SanitizedHtml=f;SanitizedJsStrChars=g;SanitizedUri=h;function i(a){return a&&a.contentKind===0?a:a instanceof Array?a.map(i).join(""):String(a).replace(j,k)}function l(a){if(a&&a.contentKind===0)return String(a.content).replace(m,k);return String(a).replace(j,k)}
function n(a){if(a&&a.contentKind===0)return a=String(a.content).replace(o,""),a=String(a).replace(m,k);return String(a).replace(j,k)}function p(a){if(a&&a.contentKind===0)return a=String(a.content).replace(o,""),a=String(a).replace(q,k);return String(a).replace(r,k)}function s(a){a=String(a);a=t.test(a)?a:"zSafehtmlz";var b,e=a.indexOf("=");return e>=0&&(b=a.charAt(a.length-1))!='"'&&b!="'"?a.substring(0,e+1)+'"'+a.substring(e+1)+'"':a}
function u(a){a=String(a);a=v.test(a)?a:"zSafehtmlz";return a}function w(a){if(a&&a.contentKind===1)return a.content;return String(a).replace(x,y)}function z(a){var b;return a==null?" null ":(b=typeof a)=="boolean"||b=="number"?" "+a+" ":"'"+w(a)+"'"}function A(a){return String(a).replace(B,y)}var C=/['()]/g;function D(a){return"%"+a.charCodeAt(0).toString(16)}function E(a){if(a&&a.contentKind===2)return F(a);a=encodeURIComponent(a);return a.replace(C,D)}
function F(a){a=String(a);if(/[\0- "<>\\{}\x7f\x85\xa0\u2028\u2029\uff00-\uffff]|%(?![a-f0-9]{2})/i.test(a)){for(var a=a.split(/(%[a-f0-9]{2}|[#$&+,/:;=?@\[\]])/i),b=a.length-1;b>=0;b-=2)a[b]=encodeURIComponent(a[b]);a=a.join("")}return a.replace(C,D)}function G(a){var b=String(a);return H.test(b)?F(a):"#zSafehtmlz"}function I(a){return String(a).replace(J,K)}function L(a){if(a==null)return"";a=String(a);a=M.test(a)?a:"zSafehtmlz";return a}var N={'"':"&quot;","&":"&amp;","<":"&lt;",">":"&gt;"}
function k(a){return N[a]||(N[a]="&#"+a.charCodeAt(0)+";")}var O={"\x08":"\\b","\t":"\\t","\n":"\\n","\x0c":"\\f","\r":"\\r","/":"\\/","\\":"\\\\"};function y(a){var b;if(!(b=O[a])){b=a.charCodeAt(0).toString(16);var e=b.length<=2?"\\x00":"\\u0000";b=e.substring(0,e.length-b.length)+b;b=O[a]=b}return b}var P={};function K(a){return P[a]||(P[a]="\\"+a.charCodeAt(0).toString(16)+" ")}
var j=/[\x00\x22\x26\x27\x3c\x3e]/g,m=/[\x00\x22\x27\x3c\x3e]/g,r=/[\x00\x09-\x0d \x22\x26\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g,q=/[\x00\x09-\x0d \x22\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g,x=/[\x00\x08-\x0d\x22\x26\x27\/\x3c-\x3e\\\x85\u2028\u2029]/g,B=/[\x00\x08-\x0d\x22\x24\x26-\/\x3a\x3c-\x3f\x5b-\x5e\x7b-\x7d\x85\u2028\u2029]/g,J=/[\x00\x08-\x0d\x22\x26-\x2a\/\x3a-\x3e@\\\x7b\x7d\x85\xa0\u2028\u2029]/g,M=/^(?!-*(?:expression|(?:moz-)?binding))(?:[.#]?-?(?:[_a-z0-9][_a-z0-9-]*)(?:-[_a-z][_a-z0-9-]*)*-?|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9])(?:[a-z]{1,2}|%)?|!important|)$/i,
H=/^(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i,t=/^(?!style|on|action|archive|background|cite|classid|codebase|data|dsync|href|longdesc|src|usemap)(?:[a-z0-9_$:-]*|dir=(?:ltr|rtl))$/i,v=/^(?!script|style|title|textarea|xmp|no)[a-z0-9_$:-]*$/i,o=/<(?:!|\/?[a-z])(?:[^>'"]|"[^"]*"|'[^']*')*>/gi,Q=[i,l,n,p,u,s,w,z,A,I,L,E,F,G];$.extend($.encode,Q)})()
