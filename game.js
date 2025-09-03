const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");
const uploadInput = document.getElementById("uploadCharacter");

canvas.width = 300;
canvas.height = 600;

// ------------------ Load Gambar ------------------
const bgImg = new Image();
bgImg.src = "assets/bg.png";

let characterImg = new Image();
characterImg.src = "assets/character.png"; // default karakter

uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    characterImg = new Image();
    characterImg.src = event.target.result; // pakai foto upload
  };
  reader.readAsDataURL(file);
});

const heartImg = new Image();
heartImg.src = "assets/heart.png";

const bombImg = new Image();
bombImg.src = "assets/bomb.png";

// ------------------ Player ------------------
const player = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 80,
  width: 75,
  height: 75,
  speed: 5
};

// ------------------ State ------------------
let objects = [];
let score = 0;
let gameOver = false;

// ------------------ Kontrol ------------------
let leftPressed = false;
let rightPressed = false;

// Keyboard control
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === "ArrowRight") rightPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") leftPressed = false;
  if (e.key === "ArrowRight") rightPressed = false;
});

// Kontrol tombol HP + PC
function pressLeft() { leftPressed = true; }
function releaseLeft() { leftPressed = false; }
function pressRight() { rightPressed = true; }
function releaseRight() { rightPressed = false; }

leftBtn.addEventListener("mousedown", pressLeft);
leftBtn.addEventListener("mouseup", releaseLeft);
leftBtn.addEventListener("mouseleave", releaseLeft);

rightBtn.addEventListener("mousedown", pressRight);
rightBtn.addEventListener("mouseup", releaseRight);
rightBtn.addEventListener("mouseleave", releaseRight);

leftBtn.addEventListener("touchstart", (e) => { e.preventDefault(); pressLeft(); });
leftBtn.addEventListener("touchend", (e) => { e.preventDefault(); releaseLeft(); });

rightBtn.addEventListener("touchstart", (e) => { e.preventDefault(); pressRight(); });
rightBtn.addEventListener("touchend", (e) => { e.preventDefault(); releaseRight(); });

// ------------------ Spawn Object ------------------
function spawnObject() {
  if (gameOver) return;
  const x = Math.random() * (canvas.width - 40);
  const type = Math.random() < 0.7 ? "heart" : "bomb"; // 70% hati, 30% bom
  objects.push({
    x: x,
    y: -40,
    width: 40,
    height: 40,
    speed: 3 + Math.random() * 2,
    type: type
  });
}
setInterval(spawnObject, 1200);

// ------------------ Collision ------------------
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ------------------ Reset ------------------
function resetGame() {
  score = 0;
  objects = [];
  gameOver = false;
  player.x = canvas.width / 2 - 30;
  restartBtn.style.display = "none";
  scoreDisplay.innerText = "Skor: 0";
  gameLoop();
}
restartBtn.addEventListener("click", resetGame);

// ------------------ Update ------------------
function update() {
  if (gameOver) return;

  if (leftPressed && player.x > 0) player.x -= player.speed;
  if (rightPressed && player.x + player.width < canvas.width) player.x += player.speed;

  objects.forEach((obj, index) => {
    obj.y += obj.speed;

    if (isColliding(player, obj)) {
      if (obj.type === "heart") {
        score++;
        scoreDisplay.innerText = "Skor: " + score;
      } else if (obj.type === "bomb") {
        gameOver = true;
        restartBtn.style.display = "inline-block";
      }
      objects.splice(index, 1);
    }

    if (obj.y > canvas.height) {
      objects.splice(index, 1);
    }
  });
}

// ------------------ Draw ------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(characterImg, player.x, player.y, player.width, player.height);

  objects.forEach((obj) => {
    if (obj.type === "heart") {
      ctx.drawImage(heartImg, obj.x, obj.y, obj.width, obj.height);
    } else if (obj.type === "bomb") {
      ctx.drawImage(bombImg, obj.x, obj.y, obj.width, obj.height);
    }
  });
}

// ------------------ Loop ------------------
function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

gameLoop();
