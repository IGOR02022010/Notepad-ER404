

'use strict';


const VERSION = 'v6.9';
const CACHE_NAME = 'notepad-er404-' + VERSION;
const OFFLINE_URL = 'index.html'; 


const PRECACHE = [
  '67.png',
  'active-line.min.js',
  'all.min.css',
  'brace-fold.min.js',
  'clike.min.js',
  'closebrackets.min.js',
  'closetag.min.js',
  'codemirror.min.css',
  'codemirror.min.js',
  'comment-fold.min.js',
  'comment.min.js',
  'css-hint.min.js',
  'css.min.js',
  'dart.min.js',
  'dialog.min.css',
  'dialog.min.js',
  'dockerfile.min.js',
  'dracula.min.css',
  'd_close.png',
  'd_create.png',
  'd_open.png',
  'd_redo.png',
  'd_save.png',
  'd_saveas.png',
  'd_search.png',
  'd_undo.png',
  'd_wrap.png',
  'foldcode.min.js',
  'foldgutter.min.css',
  'foldgutter.min.js',
  'go.min.js',
  'html-hint.min.js',
  'htmlmixed.min.js',
  'indent-fold.min.js',
  'index.html',
  'javascript-hint.min.js',
  'javascript.min.js',
  'jsmediatags.min.js',
  'lua.min.js',
  'manifest.json',
  'markdown.min.js',
  'matchbrackets.min.js',
  'matchtags.min.js',
  'material-darker.min.css',
  'pascal.min.js',
  'perl.min.js',
  'php.min.js',
  'powershell.min.js',
  'pwa.png',
  'python.min.js',
  'qrcode.min.js',
  'ruby.min.js',
  'rust.min.js',
  'search.min.js',
  'searchcursor.min.js',
  'shell.min.js',
  'show-hint.min.css',
  'show-hint.min.js',
  'simplescrollbars.min.css',
  'simplescrollbars.min.js',
  'sql.min.js',
  'sublime.min.js',
  'SW.js',
  'swift.min.js',
  'SWinstrument.py',
  'textile.min.js',
  'toml.min.js',
  'trailingspace.min.js',
  'vb.min.js',
  'vue.min.js',
  'xml-fold.min.js',
  'xml.min.js',
  'yaml.min.js',
  OFFLINE_URL

];


self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){

      return Promise.all(PRECACHE.map(function(url){
        return cache.add(url).catch(function(){  });
      }));
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});


self.addEventListener('fetch', function(event){
  const req = event.request;

  if (req.method !== 'GET') return;                    
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;    


  if (req.mode === 'navigate'){
    event.respondWith(
      fetch(req).catch(function(){
        return caches.match(OFFLINE_URL).then(function(r){
          return r || caches.match('./');
        });
      })
    );
    return;
  }


  event.respondWith(
    caches.match(req).then(function(cached){
      const fresh = fetch(req).then(function(resp){
        if (resp && resp.ok){
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(function(c){ c.put(req, copy); });
        }
        return resp;
      }).catch(function(){ return cached; });
      return cached || fresh;
    })
  );
});
