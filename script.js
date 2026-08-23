const IMAGE_SCALE = 0.5;
const SPEED = 3;

const ctx = canvas.getContext('2d');

let media = document.createElement('img');
let mediaSize = { w: 0, h: 0 };
let isLoaded = false;

const bgColor = window.getComputedStyle(document.body).backgroundColor;
let rect = { x: 0, y: 0, w: 0, h: 0 };
let dir = { x: 2*Math.random() - 1, y: 2*Math.random() - 1 }
let dirLength = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
dir.x /= dirLength;
dir.y /= dirLength;


function loadImageOfTheDay() {
  const url = "./nasa.json"
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`ERROR Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const image_title = document.getElementById('image-title');
      image_title.textContent = data.title;
      const video = document.getElementById('video');
      if (data.media_type === 'video') {
        video.className = 'media';
        canvas.className = 'hidden';
        video.src = data.url;
        video.onMediaReady
      } else {
        canvas.className = 'media';
        video.className = 'hidden';
        resizeCanvas();
        const img = document.createElement('img');
        img.src = data.url;
        img.onload = () => {
          media = img;
          onMediaReady(img.width, img.height);
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching nasa data from server:', error);
    });
}

function onMediaReady(width, height) {
  isLoaded = true;
  mediaSize = { w: width, h: height };
  resizeRect();
  rect.x = (canvas.width - rect.w) / 2.0;
  rect.y = (canvas.height - rect.h) / 2.0;
  requestAnimationFrame(loop);
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
}

function resizeRect() {
  if (!isLoaded) return;
  if (canvas.width < canvas.height) {
    rect.w = canvas.width * IMAGE_SCALE;
    rect.h = rect.w * mediaSize.h / mediaSize.w;
  } else {
    rect.h = canvas.height * IMAGE_SCALE;
    rect.w = rect.h * mediaSize.w / mediaSize.h;
  }
}

window.addEventListener('resize', () => {
  resizeCanvas();
  resizeRect();
});

media.onload = () => {
  console.log(media.width, media.height);
  resizeRect();
};

function loop() {
  if (!isLoaded) {
    requestAnimationFrame(loop);
    return;
  }

  rect.x += dir.x * SPEED;
  rect.y += dir.y * SPEED;
  if (rect.x < 0 && dir.x < 0 || rect.x + rect.w > canvas.width && dir.x > 0)
      dir.x *= -1;
  if (rect.y < 0 && dir.y < 0 || rect.y + rect.h > canvas.height && dir.y > 0)
      dir.y *= -1;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(media, rect.x, rect.y, rect.w, rect.h);
  requestAnimationFrame(loop);
}

// Run
resizeCanvas();
loadImageOfTheDay();
