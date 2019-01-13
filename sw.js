importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/app.css',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css?family=Montserrat',
    'materialize-css/dist/css/materialize.min.css',
    'js/jquery-3.3.1.min.js',
    'materialize-css/dist/js/materialize.min.js'
];

// INSTALACION

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => {
            console.log('STATICO REGISTRADO')
            cache.addAll(APP_SHELL)
        });

    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => {
            cache.addAll(APP_SHELL_INMUTABLE);
        });

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

// MANEJO DE CACHE
self.addEventListener('activate', e => {

    const respuesta = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if (key != STATIC_CACHE && key.includes('static')) {
                    return caches.delete(key);
                }
            });
        })

    e.waitUntil(respuesta);

});

self.addEventListener('fetch', e => {
    console.log(e.request.url);
    const respuesta = caches.match(e.request)
        .then(res => {
            if (res) {
                return res;
            } else {
                return fetch(e.request).then(newRes => {
                    return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
                });

            }

        })

    e.respondWith(respuesta);

});