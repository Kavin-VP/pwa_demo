var registration;

const subscribeButton = document.querySelector('.subscribe');

if('serviceWorker' in navigator)
{
    window.addEventListener('load', function (){
        this.navigator.serviceWorker
        .register('/serviceWorker.js')
        .then((reg) => {
            console.log('service worker registered');
            registration = reg; 
            reg.showNotification('title',options)
            console.log('-------notif------##########')
        }
    )
        .catch((error) => console.log('service worker not registered'));
    })

    requestNotificationPermission();
}


let options = {

};

//registration.showNotification('title',options);

if('geolocation' in navigator)
{
    const location = navigator.geolocation.getCurrentPosition(position=>{
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
    });
}
else{
    console.log('geolocation not available');
}

if('Notification' in window){
    console.log('notifications available');
}
else
{
    console.log('notifications not available');
}
const video = document.querySelector('.video');

const constraints = {
    video:true,
    audio:true
}
console.log('---------------------------------------------')
console.log(ServiceWorkerRegistration.prototype)

// ServiceWorkerRegistration.showNotification('title','body');

console.log(Notification.permission)
//request notification permission

function requestNotificationPermission(){
    // if(Notification.permission==='default')
    // {
    //     Notification.requestPermission().then(()=>{
    //         if(Notification.permission==='denied')
    //             console.log('permission denied');
    //         else
    //             console.log('permission granted');
    //     })
    // }
}


const videoButton = document.querySelector('.videoButton');
let videoTracks;

videoButton.addEventListener('click', function(){
    navigator.mediaDevices.getUserMedia(constraints)
.then(stream=>{
    videoTracks = stream.getVideoTracks();
    console.log('video tracks -> '+videoTracks);

    stream.onremovetrack = () => {
        console.log("Stream ended");
      };

    video.srcObject = stream;
})
.catch(error=>{
    console.log('error occurred '+ error.name);
})
});

const stopButton = document.querySelector('.stopButton');

stopButton.addEventListener('click',function(){

    videoTracks.forEach(track => {
        track.stop();
    });
});


const x = document.querySelector('.x');
const y = document.querySelector('.y');
const z = document.querySelector('.z');

console.log('-----------sensors-----------');
window.addEventListener('devicemotion', function(event) {

    x.innerHTML = event.acceleration.x;
    y.innerHTML = event.acceleration.y;
    z.innerHTML = event.acceleration.z;

    console.log("Acceleration X: " + event.acceleration.x);
    console.log("Acceleration Y: " + event.acceleration.y);
    console.log("Acceleration Z: " + event.acceleration.z);
  });
  
  // Listen for device orientation events
  window.addEventListener('deviceorientation', function(event) {
    console.log("Alpha (Rotation around Z axis): " + event.alpha);
    console.log("Beta (Rotation around X axis): " + event.beta);
    console.log("Gamma (Rotation around Y axis): " + event.gamma);
  });

  if ("getBattery" in navigator) {
    navigator.getBattery().then(function(battery) {
      console.log("Battery Level: " + battery.level * 100 + "%");
      console.log("Is Charging: " + battery.charging);
    });
  } else {
    console.log("Battery Status API is not supported in this browser.");
  }

  //push notification

  subscribeButton.addEventListener('click', function (){
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          subscribeUser();
        } else {
          console.log('Notification permission denied.');
        }
      });
  })


  function subscribeUser(){

    navigator.serviceWorker.ready.then(registration=>{
        registration.pushManager.getSubscription()
        .then(subscription=>{
            if(subscription){
                console.log('user already subscribed',subscription);
                subscription.unsubscribe();
            }
            else{

                const publicKey = 'BMGGDCV9MmSACdkKO7U8jDpgQLFKSFweUcMamVV1aHMHLazrmVF_Ob4_CRQBhSs5PYpdFMIfBVc3GNwcSt_BC58';

                const applicationServerKey = urlB64ToUint8Array(publicKey);

                console.log('--------------------------------------------------');
                console.log(applicationServerKey);

                registration.pushManager.subscribe({
                    userVisibleOnly:true,
                    applicationServerKey: applicationServerKey
                }).then(newSubscription=>{
                    console.log('subscribed',newSubscription);

                    sendSubscriptionToServer(newSubscription);
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        })
    })
  }

  async function sendSubscriptionToServer(subscription) {
    await fetch('http://192.168.0.100:3000/subscribe', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        console.log('Subscription sent to the server');
      } else {
        console.error('Failed to send subscription to the server');
      }
    });
  }

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }