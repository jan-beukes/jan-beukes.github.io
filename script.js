function getImageOfTheDay() {
  let image = new Image();
  // TODO: maybe get from https://api.nasa.gov
  const url = "http://172.209.216.106:8000/nasa.json"
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`ERROR Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      image.src = data.url;
      image.alt = data.title
      let image_title = document.getElementById('image-title');
      image_title.textContent = image.alt;
    })
    .catch((error) => {
      console.error('Error fetching nasa data from server:', error);
    });

  return image;
}

const IMAGE_SCALE = 0.5;
const SPEED = 3;

const ctx = canvas.getContext('2d');
let image = getImageOfTheDay();
let rect = { x: 0, y: 0, w: 0, h: 0 };
let dir = { x: 2*Math.random() - 1, y: 2*Math.random() - 1 }
let dirLength = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
dir.x /= dirLength;
dir.y /= dirLength;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
}

function resizeRect() {
  if (!image.complete) return;
  if (canvas.width < canvas.height) {
    rect.w = canvas.width * IMAGE_SCALE;
    rect.h = rect.w * image.height / image.width;
  } else {
    rect.h = canvas.height * IMAGE_SCALE;
    rect.w = rect.h * image.width / image.height;
  }
}

window.addEventListener('resize', () => {
  resizeCanvas();
  resizeRect();
});

resizeCanvas();
image.onload = () => {
  console.log(image.width, image.height);
  resizeRect();
  rect.x = (canvas.width - rect.w) / 2.0;
  rect.y = (canvas.height - rect.h) / 2.0;
};

const bgColor = window.getComputedStyle(document.body).backgroundColor;
function loop() {
  rect.x += dir.x * SPEED;
  rect.y += dir.y * SPEED;
  if (rect.x < 0 && dir.x < 0 || rect.x + rect.w > canvas.width && dir.x > 0)
      dir.x *= -1;
  if (rect.y < 0 && dir.y < 0 || rect.y + rect.h > canvas.height && dir.y > 0)
      dir.y *= -1;

  ctx.fillStyle = "#282828";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
