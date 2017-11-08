const NAME="sw1";


// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  console.log(NAME+" installed");
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  console.log("activated: ", event);
});


var count = 0;
var countInterval = null;
self.addEventListener('message', function(event) {
  // console.log("message", event);
  switch(event.data.command){
    case "connect":
      if(!countInterval){
        countInterval = setInterval(function(){
          count++;
        },1000)
      }

      event.waitUntil(async function() {
        if (!event.source) return;
        const client = await clients.get(event.source.id);
        if (!client) return;

        client.postMessage({command:"update-timer",value:count});
        setInterval(function(){
          client.postMessage({command:"update-timer",value:count});
        },1000);
      }());
      break;
    case "reset":
      count = 0;
      break;
    default:
      event.ports[0].postMessage({
        error: "Invalid Command: "+ event.data.command
      });
  }
});

// var count = 0;
// var countInterval = null;
// self.onmessage = function (event) {;
//   console.log("message received: ", event);
//   switch(event.data.type){
//     case "reset-timer":
//       console.log("reset-timer");
//       if(countInterval) clearInterval(countInterval);
//       count = 0;
//       event.waitUntil(async function() {
//         if (!event.source) return;
//         const client = await clients.get(event.source.id);
//         if (!client) return;
//
//         countInterval = setInterval(_=>{
//           client.postMessage({type:"timer-update",data:count++});
//         },1000);
//       }())
//       break;
//     case "get-time":
//       console.log("get-time");
//       postMessage(event,{msg:"timer",data:count});
//       break;
//     default :
//       console.log("invalid");
//       break;
//   }
// }
//
//
//
// function postMessage(event, data){
//   event.waitUntil(async function() {
//     // Exit early if we don't have access to the client.
//     // Eg, if it's cross-origin.
//     if (!event.source) return;
//
//     // Get the client.
//     const client = await clients.get(event.source.id);
//     // Exit early if we don't get the client.
//     // Eg, if it closed.
//     console.log("client: ", client);
//     if (!client) return;
//
//     // Send a message to the client.
//     client.postMessage(data);
//   }())
// }
