const permissionBtn = document.getElementById('action-permission');
const actionBtn = document.getElementById('action-shake');
const audio = document.getElementById('audio-goose');

if (window.DeviceMotionEvent && !DeviceMotionEvent.requestPermission) {
  permissionBtn.style.display = 'none';
  actionBtn.style.display = 'block';
}

const playAudioHandler = () => audio.play();

/* eslint-disable */
let x0 = 0, x1 = 0;
let y0 = 0, y1 = 0;
let z0 = 0, z1 = 0;
/* eslint-enable */

const deviceMotionHandler = (e) => {
  const sensitivity = 15;

  x0 = e.accelerationIncludingGravity.x;
  y0 = e.accelerationIncludingGravity.y;
  z0 = e.accelerationIncludingGravity.z;

  setInterval(() => {
    const change = Math.abs(x0 - x1 + y0 - y1 + z0 - z1);

    if (change > sensitivity) {
      audio.play();
    }

    x1 = x0;
    y1 = y0;
    z1 = z0;
  }, 150);
};

function requestPermissionHahdler() {
  audio.play();

  if (window.DeviceMotionEvent) {
    DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', deviceMotionHandler);
        }
      })
      .catch(console.error);
  }

  permissionBtn.style.display = 'none';
  actionBtn.style.display = 'block';
}

permissionBtn.addEventListener('click', requestPermissionHahdler);
actionBtn.addEventListener('click', playAudioHandler);
