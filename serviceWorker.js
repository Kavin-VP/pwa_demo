//import {openDB} from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

const pwaDemo = 'pwa-demo-site';

const assets = [
    './',
    './index.html',
    './style.css',
    './js/app.js',
    './icons/icon-48x48.png',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-256x256.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
];

self.addEventListener('install',(installEvent) => installEvent.waitUntil(
    caches.open(pwaDemo).then(cache=>cache.addAll(assets).then(async ()=>{
         await createDB();
    }
    ))
)
);

self.addEventListener('fetch', fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then( res => {
            return res || fetch(fetchEvent.request)
        })
    )
});

const options = {

};


async function createDB() {

    let db;
    
    // const request = openDB('demo-db',1);

    // request.onerror = (error)=>{
    //     console.log('error occurred while creating indexed db' + error);
    // };

    // request.onsuccess = (event)=>{
    //     db = event.target.result;
    // };

    // request.onupgradeneeded = (event)=>{

    //     const db = event.target.result;
    //     const objectStore = db.createObjectStore('employee-details',{keyPath:'id', autoIncrement:true});
    //     objectStore.createIndex('type','type');
    // };

}


//push notification event listener

// self.addEventListener('push',(event)=>{

//     const data = event.data.json();
//     const options = {

//         body:data.body,
//     };

//     event.waitUntil(
//         self.registration.showNotification(data.title,options)
//     );

    
// });

console.log('----------------reg--------------')
console.log(registration);


// function subscribeToPushNotification()
// {
//     navigator.serviceWorker.ready.then(
//         (registration)=>{
    
//             const options = {
//                 //'message body',
//             };
//             registration.showNotification('title',options);
//             return registration.pushManager.getSubscription().then(
//                 (subscription)=>{
//                     if(subscription){
//                         console.log('User is already subscribed:', subscription);
//                         return subscription;
//                     }
//                     else
//                     {
    
//                     }
//                 }
//             )
//         }
//     )
// }

self.addEventListener('push',(event)=>{

    const data = event.data ? event.data.json() : {};
    const title = data.title || 'New Notification';

    const options = {
        body:data.body,
        icon:'./icons/icon-192x192.png',
        badge:'./icons/icon-192x192.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('https://kavin-vp.github.io/pwa_demo/')
    );
  });