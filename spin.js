let data = [];
let canvas, ctx;

window.onload = () => {
  canvas = document.getElementById("wheel");
  ctx = canvas.getContext("2d");
};

function toggleForm() {
  const form = document.getElementById("dataForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

function createWheel() {
  const input = document.getElementById("input").value.trim().split("\n").filter(x => x);
  data = input.map(name => ({ label: name }));
  drawWheel();
}

function drawWheel() {
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const angleStep = (2 * Math.PI) / data.length;

  for (let i = 0; i < data.length; i++) {
    const angle = i * angleStep;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle, angle + angleStep);
    ctx.fillStyle = `hsl(${i * 360 / data.length}, 70%, 70%)`;
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + angleStep / 2);
    ctx.fillStyle = "#000";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(data[i].label, radius - 10, 5);
    ctx.restore();
  }
}

function spinWheel() {
  if (data.length === 0) return alert("Please enter data first!");

  const winnerIndex = Math.floor(Math.random() * data.length);
  document.getElementById("result").textContent = `🎉 Winner: ${data[winnerIndex].label}`;
}
