(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * Polyfills utilities. Generally they're a pain the ass, 
 * this make this task much easier. 
 * Only loads the necessary polyfills in each case.
 *
 * Every polyfill is loaded , exporting global variables.
 * At the end, the promise is called.
 * 
 * @module kambo-polyfills
 */

const fetch   = [ () => !!window.fetch,   'fetch.js' ];
const promise = [ () => !!window.Promise, 'es6-promise.min.js'];

const intobs  = [ () => !!window.IntersectionObserver,  'intersection-observer.js'];
const mutobs  = [ () => !!window.MutationObserver,      'mutationobserver.min.js'];

/* Web animations */
const webAnimation = [ () => !!('animate' in document.createElement('div')), 'web-animations-next-lite.min.js'];

/* web components */
const customElements = [ () => !!window.customElements,  'custom-elements.min.js'];
const htmlImport = [ () => (!!('import' in document.createElement('link'))), 'html-import.js' ];

const DEFAULT_POLYFILLS = [ fetch, promise, 
                                   intobs, mutobs , 
				   webAnimation,
                                   htmlImport, customElements ];

/**
 * Dynamically create and add to document a script.
 * Don't block the browser rendering. 
 * 
 * @param  {String} src Absolute URL of file
 * @param  {Boolean} inorder Load script in order ? 
 * @return {HTMLScriptElement} 
 */
function loadScript( src , in_order=true, cb, errorCb) {
  var script = document.createElement('script');
  script.src = src;
  script.onload = cb;
  script.onerror = errorCb;
  script.async = !in_order;
  document.head.appendChild(script);
  return script
}

function isSupported( detect ) {
  return ( detect instanceof Function ?  detect() : detect )
}

/**
 * Apply polyfills as necessary.
 * Iterate source, runs detect_fn() and load the corresponding file if false 
 * 
 * @param  {Array} source List of polyfills as [ detect_fn(), 'filename' ] 
 * @param  {String} prefix Absolute base path where polyfills are located. 
 * @param  {Boolean} in_order Should load files in order? Default is true
 * @return {Promise} Promise when all files are loaded.
 */
function applyPolyfills( source=DEFAULT_POLYFILLS , 
                                prefix=document.currentScript,
                                in_order=true) {
  
  // Always get a working prefix
  prefix = (!!prefix ? prefix : document.location.href() );
  
  var filesToLoad = source.filter( ([detect_fn, file]) => ! isSupported(detect_fn) )
                          .map( (poly) => poly[1] )
                          .map( (file) => prefix + file );
  
  var allPromises = filesToLoad.map( (url) => {
    var scr = new Promise((resolve, reject) => {
      loadScript( url, true , resolve, reject);
    });
  });
  
  return Promise.all( allPromises )
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var zenscroll$1 = require('zenscroll');
window.zenscroll = zenscroll$1;

var Scroller = function () {
    function Scroller(el) {
        var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { page_size: undefined,
            interval: 12.5,
            direction: 'vertical',
            offset: 0,
            duration: 785 };
        classCallCheck(this, Scroller);

        this.el = el;

        this.page_size = settings.page_size || el.clientHeight;
        this.maxHeight = el.offsetHeight;

        this.dur = settings.duration || 785;
        this.interval = settings.interval || 3;
        this.dir = settings.direction == 'vertical' && 'Top' || 'Left';

        this.scroll(0);
    }

    createClass(Scroller, [{
        key: 'cycle',
        value: function cycle() {
            var next_window = zenscroll$1.getY() + this.page_size;
            this.scroll(next_window);
        }
    }, {
        key: 'scroll',
        value: function scroll(x) {
            console.log("Scroller:scroll", x);
            zenscroll$1.toY(x, this.dur, this.update.bind(this));
        }
    }, {
        key: 'update',
        value: function update() {
            this.pct = zenscroll$1.getY() / this.maxHeight;
        }
    }, {
        key: 'start',
        value: function start() {
            this._int_handler = setInterval(this.cycle.bind(this), this.interval * 1000);
        }
    }, {
        key: 'stop',
        value: function stop() {
            clearInterval(this._int_handler);
            this._int_handler = undefined;
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            if (this._int_handler != undefined) {
                this.stop();
            } else {
                this.start();
            }
        }
    }]);
    return Scroller;
}();

var f = require('kambo-functional');
var dom = require('kambo-dom');
var zenscroll = require('zenscroll');

applyPolyfills(DEFAULT_POLYFILLS, 'node_modules/kambo-polyfills/polyfills/').then(function () {
    window.$ = dom.$;
    window.f = f;
}).catch(function () {
    console.error('Polyfills load failed');
});

/*
 * App code
 
import TwitLine from './TwitLine'
*/
function setup() {
    var docScroller = new Scroller(document.body, {
        page_size: gui.params.window_size,
        interval: gui.params.interval
    });

    docScroller.start();
    setTimeout(function () {
        zenscroll.toY(70);
    }, 1000);
}

document.addEventListener('keypress', function (k) {
    if (k.key == "Enter") {
        gui.domElement.classList.toggle('transparent');
    }
});
document.addEventListener('DOMContentLoaded', setup);

})));