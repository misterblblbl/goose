let x0 = 0, x1 = 0, y0 = 0, y1 = 0, z0 = 0, z1 = 0;

function deviceMotionHandler(e) {
  const sensitivity = 20;

  x0 = e.accelerationIncludingGravity.x;
  y0 = e.accelerationIncludingGravity.y;
  z0 = e.accelerationIncludingGravity.z;

  setInterval(function() {
    var change = Math.abs(x0 - x1 + y0 - y1 + z0 - z1);
    if (change > sensitivity) {
      console.log('Shake!');
    }

    x1 = x0;
    y1= y0;
    z1 = z0;
    color = normalColor;
  }, 150);
}

function requestPermissionHahdler() {
  DeviceMotionEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        window.addEventListener('devicemotion', deviceMotionHandler);
      }
    })
    .catch(console.error);
}


const button = document.getElementById('shake-action');
button.addEventListener('click', requestPermissionHahdler);