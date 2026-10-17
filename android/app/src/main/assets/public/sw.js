/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "4aa7389c3159b5e9e9d2cf92a4222d80"
  }, {
    "url": "pwa-512x512.png",
    "revision": "c6172bee776da93101d81da6e35efdc3"
  }, {
    "url": "pwa-192x192.png",
    "revision": "75bf3257ecbe399a932e109eb2462bab"
  }, {
    "url": "looplive_logo.svg",
    "revision": "a8b60d5905b3932f8bcdabf2630d371e"
  }, {
    "url": "index.html",
    "revision": "bad8b7bb745698b813f0679c7f857c7b"
  }, {
    "url": "icon.svg",
    "revision": "5a04f386b4830f45886b619723ab2d59"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "63b64d4712371b1ba67df46f37344829"
  }, {
    "url": "assets/index-tVSPX4Qy.css",
    "revision": null
  }, {
    "url": "assets/index-CiaJ0vvB.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "63b64d4712371b1ba67df46f37344829"
  }, {
    "url": "icon.svg",
    "revision": "5a04f386b4830f45886b619723ab2d59"
  }, {
    "url": "pwa-192x192.png",
    "revision": "75bf3257ecbe399a932e109eb2462bab"
  }, {
    "url": "pwa-512x512.png",
    "revision": "c6172bee776da93101d81da6e35efdc3"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "4aa7389c3159b5e9e9d2cf92a4222d80"
  }, {
    "url": "manifest.webmanifest",
    "revision": "70470016490e3f06d16c7ae951bbafb1"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
