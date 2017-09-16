// 缓存 更新 版本号
var cacheStorageKey = 'minimal-pwa-1'
// 哪些文件需要缓存，可以离线访问
var cacheList = [
    '/',
    'index.html',
    'main.css',
    'logo.png'
]
// self 表示Service Worker
// 处理静态缓存
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheStorageKey).then(function(cache) {
            return cache.addAll(cacheList)
        }).then(function() {
            // 强制当前处于waiting状态的脚本进入active状态 让脚本生效
            return self.skipWaiting()
        })
    )
})
// fetch处理动态缓存 决定如何响应资源的请求
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if (response != null) {
                return response
            }
            return fetch(e.request.url)
        })
    )
})

self.addEventListener('active', function(e) {
    e.waitUtil(
        Promise.all(
            caches.keys().then(cacheNames => {
                return cacheNames.map(name => {
                    if (name !== cacheStorageKey) {
                        return caches.delete(name)
                    }
                })
            })
        ).then(() => {
            return self.clients.claim()
        })
    )
})