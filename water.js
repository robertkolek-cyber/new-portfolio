(function () {
  const canvas = document.getElementById('waterCanvas');
  const card = canvas.parentElement;

  const COLS = 120;
  const ROWS = 80;
  const DAMPING = 0.985;
  const SPREAD = 0.25;

  let current, previous, width, height;

  function resize() {
    width = card.clientWidth;
    height = card.clientHeight;
    canvas.width = width;
    canvas.height = height;
    current = new Float32Array(COLS * ROWS);
    previous = new Float32Array(COLS * ROWS);
  }

  function idx(x, y) {
    return y * COLS + x;
  }

  function step() {
    for (let y = 1; y < ROWS - 1; y++) {
      for (let x = 1; x < COLS - 1; x++) {
        const i = idx(x, y);
        const val =
          (previous[idx(x - 1, y)] +
            previous[idx(x + 1, y)] +
            previous[idx(x, y - 1)] +
            previous[idx(x, y + 1)]) /
            2 -
          current[i];
        current[i] = val * DAMPING;
      }
    }
    const tmp = previous;
    previous = current;
    current = tmp;
  }

  function disturb(px, py, strength) {
    const x = Math.floor((px / width) * COLS);
    const y = Math.floor((py / height) * ROWS);
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
          previous[idx(nx, ny)] += strength * (1 - Math.abs(dx + dy) * 0.2);
        }
      }
    }
  }

  function render() {
    const ctx = canvas.getContext('2d');
    const cellW = width / COLS;
    const cellH = height / ROWS;

    const baseR = 184, baseG = 245, baseB = 176;

    ctx.clearRect(0, 0, width, height);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const val = previous[idx(x, y)];
        const shift = Math.min(Math.max(val * 0.8, -40), 40);
        const r = Math.round(baseR - shift * 0.3);
        const g = Math.round(baseG - shift * 0.2);
        const b = Math.round(baseB + shift * 0.5);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(
          Math.round(x * cellW),
          Math.round(y * cellH),
          Math.ceil(cellW) + 1,
          Math.ceil(cellH) + 1
        );
      }
    }
  }

  function loop() {
    step();
    render();
    requestAnimationFrame(loop);
  }

  function randomDrop() {
    const x = Math.random() * width;
    const y = Math.random() * height;
    disturb(x, y, 80 + Math.random() * 80);
    const next = 1000 + Math.random() * 2500;
    setTimeout(randomDrop, next);
  }

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    disturb(e.clientX - rect.left, e.clientY - rect.top, 60);
  });

  canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    disturb(t.clientX - rect.left, t.clientY - rect.top, 60);
  }, { passive: false });

  window.addEventListener('resize', resize);

  resize();
  randomDrop();
  loop();
})();
