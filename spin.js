let data = [];
let canvas, ctx;
let spinning = false;
let angle = 0;
let lastWinner = null;

window.onload = () => {
  canvas = document.getElementById("wheel");
  ctx = canvas.getContext("2d");
};

function toggleForm() {
  const form = document.getElementById("dataForm");
  const isHidden = window.getComputedStyle(form).display === "none";
  form.style.display = isHidden ? "block" : "none";
}

function createWheel() {
  const raw = document.getElementById("input").value.trim();
  const lines = raw.split(/\r?\n/);
  data = lines
    .map(line => {
      const parts = line.includes('\t') ? line.split('\t') : line.split('|');
      return parts.map(x => x.trim());
    })
    .filter(arr => arr.length >= 2)
    .map(([name, course]) => ({ name, course }));
  angle = 0;
  drawWheel();
  document.getElementById("result").textContent = '';
  lastWinner = null;
}

function drawWheel() {
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(angle);

  const angleStep = (2 * Math.PI) / data.length;
  data.forEach((item, i) => {
    const start = i * angleStep;
    const end = start + angleStep;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.fillStyle = `hsl(${(i * 360) / data.length}, 65%, 70%)`;
    ctx.fill();
    ctx.save();
    ctx.rotate(start + angleStep / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(item.name, radius - 10, 5);
    ctx.restore();
  });

  ctx.restore();
  ctx.beginPath();
  ctx.arc(radius, radius, 8, 0, 2 * Math.PI);
  ctx.fillStyle = '#000';
  ctx.fill();
}

function spinWheel() {
  if (spinning || data.length === 0) {
    return alert('Please enter data first.');
  }
  spinning = true;
  const duration = 4000;
  const spins = 5;
  const slice = (2 * Math.PI) / data.length;
  const pick = Math.floor(Math.random() * data.length);
  const offset = Math.random() * slice;
  const target = (2 * Math.PI * spins) + (pick * slice) + offset;
  const startTime = performance.now();

  function animate(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    angle = target * ease;
    drawWheel();
    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      const final = (2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI);
      const idx = Math.floor(final / slice) % data.length;
      const winner = data[idx];
      lastWinner = winner;
      document.getElementById('result').innerHTML = `
        <span class="name">${winner.name}</span>
        ${winner.course}
      `;
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { x: 0.5, y: 0 },
        zIndex: 500
      });
    }
  }
  requestAnimationFrame(animate);
}

function downloadResult() {
  if (!lastWinner) return alert('Spin the wheel first!');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
  const w = doc.internal.pageSize.getWidth();
  doc.setFontSize(36);
  doc.text('🎉 Certificate of Winning 🎉', w/2, 80, { align: 'center' });
  doc.setFontSize(24);
  doc.text('This certifies that', w/2, 160, { align: 'center' });
  doc.setFontSize(30);
  doc.text(lastWinner.name, w/2, 220, { align: 'center' });
  doc.setFontSize(24);
  doc.text('has won the wheel for the course', w/2, 280, { align: 'center' });
  doc.setFontSize(26);
  doc.text(lastWinner.course, w/2, 340, { align: 'center' });
  doc.save('certificate.pdf');
}

function shareResult() {
  if (!lastWinner) return alert('Spin the wheel first!');
  const txt = `🎉 Winner: ${lastWinner.name}\n📘 Course: ${lastWinner.course}`;
  if (navigator.share) {
    navigator.share({ title: 'Wheel Winner', text: txt });
  } else {
    navigator.clipboard.writeText(txt);
    alert('Copied to clipboard!');
  }
}
