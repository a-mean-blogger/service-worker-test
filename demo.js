if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker1.js');
  console.log(navigator.serviceWorker)
  navigator.serviceWorker.controller.postMessage({command:"connect"});
}


document.querySelector('#reset').addEventListener('click', () => {
  // console.log('#reset clicked');
  sendMessage({command:"reset",value:null})
  .then(function(response){
    console.log("response: ", response);
  })
  .catch(function(error){
    console.log("error: ", error);
  });
});

navigator.serviceWorker.addEventListener('message', event => {
  // console.log("message: ", event);
  switch(event.data.command){
    case "update-timer":
      document.querySelector('#timer').value = event.data.value;
      break;
    default:
      console.error("Invalid Command: "+ event.data.command);
  }
});


function sendMessage(message) {
  return new Promise(function(resolve, reject) {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function(event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    navigator.serviceWorker.controller.postMessage(message,
      [messageChannel.port2]);
  });
}
