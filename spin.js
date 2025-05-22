let data = [];
let canvas, ctx;
let spinning = false;
let angle = 0;

window.onload = () => {
  canvas = document.getElementById("wheel");
  ctx = canvas.getContext("2d");
};

function toggleForm() {
  const form = document.getElementById("dataForm");
  form.style.display = (form.style.display === "block") ? "none" : "block";
}

function createWheel() {
  const lines = document.getElementById("input").value.trim().split("\n");
  data = lines
    .map(line => line.split("|").map(x => x.trim()))
    .filter(arr => arr.length === 2)
    .map(([name, course]) => ({ name, course }));
  drawWheel();
  document.getElementById("result").textContent = "";
}

function drawWheel() {
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const angleStep = (2 * Math.PI) / data.length;

  for (let i = 0; i < data.length; i++) {
    const startAngle = angle + i * angleStep;
    const endAngle = startAngle + angleStep;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.fillStyle = `hsl(${i * 360 / data.length}, 65%, 70%)`;
    ctx.fill();

    // Draw only name
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + angleStep / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(data[i].name, radius - 10, 5);
    ctx.restore();
  }

  // Draw center dot
  ctx.beginPath();
  ctx.arc(radius, radius, 8, 0, 2 * Math.PI);
  ctx.fillStyle = "#000";
  ctx.fill();
}

function spinWheel() {
  if (spinning || data.length === 0) return alert("Please enter valid data first!");

  spinning = true;
  const duration = 4000;
  const spins = 5;
  const index = Math.floor(Math.random() * data.length);
  const anglePerSlice = (2 * Math.PI) / data.length;
  const randomOffset = Math.random() * anglePerSlice;
  const finalAngle = (2 * Math.PI * spins) + (index * anglePerSlice) + randomOffset;

  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3); // cubic easing
    angle = finalAngle * easeOut;

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      const selectedIndex = Math.floor(((2 * Math.PI) - (angle % (2 * Math.PI))) / anglePerSlice) % data.length;
      const selected = data[selectedIndex];
      document.getElementById("result").innerHTML = `
        <span class="name">${selected.name}</span>
        ${selected.course}
      `;
    }
  }

  requestAnimationFrame(animate);
}
