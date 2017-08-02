"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Search for directives like
 * <link rel="html-import" href="import-foo.html" >
 * or
 * <link rel="html-import" href="import-bar.html" repeat="3">
 *
 * and reads the HTML by URL (src) and replaces the directives with the HTML (multiplied when using repeat attribute)
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.HTMLImport = factory();
  }
})(window, function () {

  var IMPORT_SELECTOR = "link[rel=html-import]";

  /**
   * Invoke a given handler when DOM is ready
   * @param {function} cb
   */
  function onDOMReady(cb) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
      return cb();
    }
    document.addEventListener("DOMContentLoaded", cb);
  }

  var HtmlImport = function () {
    function HtmlImport() {
      _classCallCheck(this, HtmlImport);
    }

    _createClass(HtmlImport, [{
      key: "processHtmlString",


      /**
       * Process all th eimports in the newly fetched HTML
       * @param {string} html
       * @returns Promise
       */
      value: function processHtmlString(html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        var els = Array.from(div.querySelectorAll(IMPORT_SELECTOR));
        return els.length ? this.importForElements(els).then(function () {
          return div.innerHTML;
        }) : html;
      }

      /**
       * Process imports in a given Node
       * @param {Node} el
       * @returns {Promise}
       */

    }, {
      key: "importForElement",
      value: function importForElement(el) {
        var url = el.getAttribute("href"),
            repeat = parseInt(el.getAttribute("repeat"), 10) || 1,
            processHtmlString = this.processHtmlString.bind(this);

        return fetch(url).then(function (response) {
          return response.text();
        }).then(processHtmlString).then(function (html) {
          el.insertAdjacentHTML("beforebegin", html.repeat(repeat));
          el.parentNode && el.parentNode.removeChild(el);
          return url;
        });
      }

      /**
       * Load all given imports
       * @param {Node[]} imports
       * @returns {Promise}
       */

    }, {
      key: "importForElements",
      value: function importForElements(imports) {
        var importForElement = this.importForElement.bind(this);
        return Promise.all(imports.map(importForElement));
      }
      /**
       * Find and process all the imports in the DOM
       * @returns {Promise}
       */

    }, {
      key: "import",
      value: function _import() {
        var imports = Array.from(document.querySelectorAll(IMPORT_SELECTOR));
        if (!imports.length) {
          return Promise.resolve();
        }
        return this.importForElements(imports);
      }
    }]);

    return HtmlImport;
  }();

  var importer = new HtmlImport();

  onDOMReady(function () {
    importer.import().then(function (urls) {
      var event = new CustomEvent("html-imports-loaded", { detail: { urls: urls } });
      document.dispatchEvent(event);
    });
  });

  return importer;
});
