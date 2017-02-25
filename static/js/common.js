var domLoaded = function () {};

domLoaded.callbacks = [];

domLoaded.add = function(callback) {
    this.callbacks.push(callback);
};

domLoaded.init = function() {
    var self = this,
        callback;

    callback = function() {
        for (var i = 0, len = self.callbacks.length; i < len; i++) {
            self.callbacks[i]();
        };
    };

    /*@cc_on
    @if (@_win32 || @_win64)
        document.write('<script id="ieScriptLoad" defer src="//:"><\/script>');
        document.getElementById('ieScriptLoad').onreadystatechange = function() {
            if (this.readyState == 'complete') {
                callback();
                return;
            };
        };
    @end @*/

    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback, false);
        return;
    };

    if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
        var DOMLoadTimer = setInterval(function () {
            if (/loaded|complete/i.test(document.readyState)) {
                callback();
                clearInterval(DOMLoadTimer);
                return;
            }
        }, 10);
    };

    window.onload = callback;
};

if(!document.getElementsByClassName) {
    document.getElementsByClassName = function(classname) {
        var elArray = [];
        var tmp = document.getElementsByTagName("*");
        var regex = new RegExp("(^|\\s)" + classname + "(\\s|$)");
        for (var i = 0; i < tmp.length; i++) {
 
            if (regex.test(tmp[i].className)) {
                elArray.push(tmp[i]);
            }
        }
 
        return elArray;
    }
}
function $id(id){
  return document.getElementById(id);
}
 
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
 
function in_array(value, array) {
    for(var i = 0; i < array.length; i++) {
        if(array[i] == value)
            return i;
    }
    return false;
}
function decline(number, titles)  {  
    cases = [2, 0, 1, 1, 1, 2];  
    return titles[(number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5]];  
}  
function removeNodes(node){
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
function readCookie(name) {
    if(name == null){
        return false;
    }
    name += '=';
    for (var ca = document.cookie.split(/;\s*/), i = ca.length - 1; i >= 0; i--)
        if (!ca[i].indexOf(name))
            return ca[i].replace(name, '');
} 
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function updQueryParam(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}
function nextElementSibling(el) {
    do { el = el.nextSibling } while ( el && el.nodeType !== 1 );
    return el;
}
 
function hasClass(elem, klass) {
     return (" "+elem.className+" ").indexOf(" "+klass+" ") > -1;
}
 
function ge(element, parent){
 
    var parent = (typeof parent !== "undefined") ? parent : document;
 
    if(parent.querySelector){
        return parent.querySelector(element);
    } else{
        return (element[0] == "#" ? parent.getElementById(element.slice(1)) : parent.getElementsByClassName(element.slice(1))[0]);
    }
 
}
 
function geAll(element, parent){
 
    var parent = (typeof parent !== "undefined") ? parent : document;
 
    if(parent.querySelectorAll){
        return parent.querySelectorAll(element);
    } else{
        return parent.getElementsByClassName(element.slice(1));
    }
 
}
function bindEvent(element, event, handler){
 
    if(document.addEventListener){
 
        return element.addEventListener(event, handler, false);
 
    } else if(document.attachEvent){
 
        return element.attachEvent("on"+event, handler);
 
    }
 
}
 
function removeEvent(element, event, handler){
 
    if(document.removeEventListener){
 
        return element.removeEventListener(event, handler, false);
 
    } else if(document.detachEvent){
 
        return element.detachEvent("on"+event, handler);
 
    }
 
}
(function() { // classList
    /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
    ;if("document" in self&&!("classList" in document.createElement("_"))){(function(j){"use strict";if(!("Element" in j)){return}var a="classList",f="prototype",m=j.Element[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.getAttribute("class")||""),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.setAttribute("class",this.toString())}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(){var s=arguments,r=0,p=s.length,q,o=false;do{q=s[r]+"";if(g(this,q)===-1){this.push(q);o=true}}while(++r<p);if(o){this._updateClassName()}};e.remove=function(){var t=arguments,s=0,p=t.length,r,o=false;do{r=t[s]+"";var q=g(this,r);if(q!==-1){this.splice(q,1);o=true}}while(++s<p);if(o){this._updateClassName()}};e.toggle=function(p,q){p+="";var o=this.contains(p),r=o?q!==true&&"remove":q!==false&&"add";if(r){this[r](p)}return !o};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};
})();
(function() { // document.querySelector
    if (!document.querySelectorAll) {
      document.querySelectorAll = function (selectors) {
        var style = document.createElement('style'), elements = [], element;
        document.documentElement.firstChild.appendChild(style);
        document._qsa = [];
     
        style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
        window.scrollBy(0, 0);
        style.parentNode.removeChild(style);
     
        while (document._qsa.length) {
          element = document._qsa.shift();
          element.style.removeAttribute('x-qsa');
          elements.push(element);
        }
        document._qsa = null;
        return elements;
      };
    }
     
    if (!document.querySelector) {
      document.querySelector = function (selectors) {
        var elements = document.querySelectorAll(selectors);
        return (elements.length) ? elements[0] : null;
      };
    }
})();

var shiftMonth = function(type, time) {
    var time = time || new Date(),
        current;

    if (type === "prev") {
        if (time.getMonth() === 0) {
            current = new Date(time.getFullYear() - 1, 11, 1);
        } else {
            current = new Date(time.getFullYear(), time.getMonth() - 1, 1);
        };
    } else if (type === "next") {
        if (time.getMonth() === 11) { // December
            current = new Date(time.getFullYear() + 1, 0, 1);
        } else {
            current = new Date(time.getFullYear(), time.getMonth() + 1, 1);
        };
    } else {
        return false;
    };

    return current;
};
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);

        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match;
        });
    };
};
var setTableBodyInnerHTML = function(tbody, html) {
    var temp = tbody.ownerDocument.createElement('div');
    temp.innerHTML = '<table>' + html + '</table>';
    tbody.parentNode.replaceChild(temp.firstChild.firstChild, tbody);
};
var browserDetection = function() {
    var osName = "Unknown OS";

    if (navigator.appVersion.indexOf("Win") !== -1) {
        osName = "Windows";
    } else if (navigator.appVersion.indexOf("Mac") !== -1) {
        osName = "Mac OS";
    } else if (navigator.appVersion.indexOf("X11") !== -1) {
        osName = "Unix";
    } else if (navigator.appVersion.indexOf("Linux") !== -1) {
        osName = "Linux";
    };

    return osName;
};
(function() { // Active tab
    window.isActive;

    window.onfocus = function () {
        window.isActive = true;
    };

    window.onblur = function () {
        window.isActive = false;
    };
})();
(function() {
    // lazy loading images

    /*! echo.js v1.6.0 | (c) 2014 @toddmotto | https://github.com/toddmotto/echo */
    !function(t,e){"function"==typeof define&&define.amd?define(function(){return e(t)}):"object"==typeof exports?module.exports=e:t.echo=e(t)}(this,function(t){"use strict";var e,n,o,r,c,i={},l=function(){},a=function(t,e){var n=t.getBoundingClientRect();return n.right>=e.l&&n.bottom>=e.t&&n.left<=e.r&&n.top<=e.b},d=function(){(r||!n)&&(clearTimeout(n),n=setTimeout(function(){i.render(),n=null},o))};return i.init=function(n){n=n||{};var a=n.offset||0,u=n.offsetVertical||a,f=n.offsetHorizontal||a,s=function(t,e){return parseInt(t||e,10)};e={t:s(n.offsetTop,u),b:s(n.offsetBottom,u),l:s(n.offsetLeft,f),r:s(n.offsetRight,f)},o=s(n.throttle,250),r=n.debounce!==!1,c=!!n.unload,l=n.callback||l,i.render(),document.addEventListener?(t.addEventListener("scroll",d,!1),t.addEventListener("load",d,!1)):(t.attachEvent("onscroll",d),t.attachEvent("onload",d))},i.render=function(){for(var n,o,r=document.querySelectorAll("img[data-echo]"),d=r.length,u={l:0-e.l,t:0-e.t,b:(t.innerHeight||document.documentElement.clientHeight)+e.b,r:(t.innerWidth||document.documentElement.clientWidth)+e.r},f=0;d>f;f++)o=r[f],a(o,u)?(c&&o.setAttribute("data-echo-placeholder",o.src),o.src=o.getAttribute("data-echo"),c||o.removeAttribute("data-echo"),l(o,"load")):c&&(n=o.getAttribute("data-echo-placeholder"))&&(o.src=n,o.removeAttribute("data-echo-placeholder"),l(o,"unload"));d||i.detach()},i.detach=function(){document.removeEventListener?t.removeEventListener("scroll",d):t.detachEvent("onscroll",d),clearTimeout(n)},i});
})();