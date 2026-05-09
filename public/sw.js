// sw.js — minimal service worker
// The browser probes for /sw.js when a web app manifest is present.
// This file satisfies that probe without registering any caching or
// offline behaviour. Extend it here if you later want PWA offline support.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())