function handleRegistration(registration) {
  console.log('Service Worker Registered. ', registration)
  registration.onupdatefound = (e) => {
    const installingWorker = registration.installing;
    installingWorker.onstatechange = (e) => {
      if (installingWorker.state !== 'installed') return;
      if (navigator.serviceWorker.controller) {
        console.log('SW is updated');
      } else {
        console.log('A Visit without previous SW');
        createSnackbar({
          message: 'App ready for offline use.',
          duration: 3000
        })
      }
    };
  }
}

if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('/notes/sw.js')
    .then((registration) => handleRegistration(registration))
    .catch((error) => { console.log('ServiceWorker registration failed: ', error) })

  navigator.serviceWorker.onmessage = (e) => {
    console.log('SW: SW Broadcasting:', event);
    const data = e.data

    if (data.command == "UPDATE_FOUND") {
      console.log("UPDATE_FOUND_BY_SW", data);
      createSnackbar({
        message: "Content updated.",
        actionText: "refresh",
        action: function (e) { location.reload() }
      })
    }
  }
}
