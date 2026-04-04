import { PALETTES, DOTS, escHtml } from './constants.js';

function rRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxW, lh, max) {
  if (!text) return 0;
  let line = '', lines = [];
  for (let c of text) {
    const t = line + c;
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line);
      line = c;
    } else {
      line = t;
    }
  }
  if (line) lines.push(line);
  if (max) lines = lines.slice(0, max);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
  return lines.length;
}

export function generateCanvas({ title, dateVal, theme, sName, sTime, eName, eTime, stops, palette }) {
  const P = PALETTES[palette] || PALETTES.forest;

  const dateStr = dateVal
    ? new Date(dateVal).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const all = [
    { name: sName, time: sTime, memo: '출발', isStart: true },
    ...stops,
    { name: eName, time: eTime, memo: '도착', isEnd: true }
  ];

  const W = 720, CW = 185, CH = 108, COLS = 3, HG = 16, VG = 56;
  const PT = 148, PB = 64;
  const rows = Math.ceil(all.length / COLS);
  const H = PT + rows * (CH + VG) + PB;

  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');

  // Background
  ctx.fillStyle = P.bg;
  ctx.fillRect(0, 0, W, H);

  // Top banner with curve
  ctx.fillStyle = P.top;
  ctx.beginPath();
  ctx.moveTo(0, PT - 12);
  ctx.quadraticCurveTo(W / 2, PT + 16, W, PT - 12);
  ctx.lineTo(W, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  // Random dots decoration
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * PT, 4 + Math.random() * 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();
  }

  // Title
  ctx.fillStyle = P.accent;
  ctx.font = 'bold 27px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, W / 2, 44);

  // Subtitle
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '12px "Noto Sans KR", sans-serif';
  const sub = [dateStr, theme, sName + (sTime ? ' ' + sTime : '') + '→' + eName + (eTime ? ' ' + eTime : '')].filter(Boolean).join('  ·  ');
  ctx.fillText(sub, W / 2, 66);

  // Tags
  const tagItems = [theme, `총 ${all.length}곳`];
  let tx = W / 2 - (tagItems.length * 78) / 2;
  tagItems.forEach(tag => {
    rRect(ctx, tx, 78, 74, 20, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '10px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(tag, tx + 37, 92);
    tx += 82;
  });

  // Calculate positions
  const pos = all.map((_, i) => {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const tir = Math.min(COLS, all.length - row * COLS);
    const rw = tir * CW + (tir - 1) * HG;
    const ox = (W - rw) / 2;
    const fc = row % 2 === 0 ? col : (tir - 1 - col);
    return { x: ox + fc * (CW + HG), y: PT + row * (CH + VG) };
  });

  // Draw connecting lines
  ctx.strokeStyle = P.line;
  ctx.lineWidth = 3;
  ctx.setLineDash([9, 6]);
  for (let i = 0; i < pos.length - 1; i++) {
    const p = pos[i], n = pos[i + 1];
    const pr = Math.floor(i / COLS), nr = Math.floor((i + 1) / COLS);
    ctx.beginPath();
    if (pr === nr) {
      const gr = pr % 2 === 0;
      if (gr) {
        ctx.moveTo(p.x + CW, p.y + CH / 2);
        ctx.lineTo(n.x, n.y + CH / 2);
      } else {
        ctx.moveTo(p.x, p.y + CH / 2);
        ctx.lineTo(n.x + CW, n.y + CH / 2);
      }
    } else {
      const px = p.x + CW / 2, py = p.y + CH, nx = n.x + CW / 2, ny = n.y;
      ctx.moveTo(px, py);
      ctx.bezierCurveTo(px, py + VG / 2, nx, ny - VG / 2, nx, ny);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Draw cards
  all.forEach((place, i) => {
    const { x, y } = pos[i];
    const sp = place.isStart || place.isEnd;
    rRect(ctx, x, y, CW, CH, 11);
    ctx.fillStyle = sp ? P.sBg : P.card;
    ctx.fill();
    if (!sp) {
      rRect(ctx, x, y, CW, CH, 11);
      ctx.strokeStyle = P.cb;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    const dc = sp ? P.accent : DOTS[i % DOTS.length];
    ctx.beginPath();
    ctx.arc(x + 14, y + 15, 6, 0, Math.PI * 2);
    ctx.fillStyle = dc;
    ctx.fill();
    ctx.font = '10px sans-serif';
    ctx.fillStyle = sp ? 'rgba(255,255,255,0.55)' : '#aaa';
    ctx.textAlign = 'left';
    ctx.fillText('#' + (i + 1), x + 24, y + 19);
    if (place.time) {
      ctx.font = '10px sans-serif';
      ctx.fillStyle = sp ? P.accent : P.sub;
      ctx.textAlign = 'right';
      ctx.fillText(place.time, x + CW - 8, y + 19);
    }
    ctx.font = 'bold 13px "Noto Sans KR", sans-serif';
    ctx.fillStyle = sp ? P.sTxt : P.txt;
    ctx.textAlign = 'center';
    wrapText(ctx, place.name, x + CW / 2, y + 40, CW - 18, 17, 2);
    if (place.memo) {
      const mw = ctx.measureText(place.memo).width + 16;
      const mx = x + CW / 2 - mw / 2;
      rRect(ctx, mx, y + CH - 22, mw, 16, 8);
      ctx.fillStyle = sp ? 'rgba(255,255,255,0.15)' : P.tag;
      ctx.fill();
      ctx.font = '10px "Noto Sans KR", sans-serif';
      ctx.fillStyle = sp ? 'rgba(255,255,255,0.8)' : P.tagT;
      ctx.textAlign = 'center';
      ctx.fillText(place.memo, x + CW / 2, y + CH - 9);
    }
  });

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('made with 여행 코스 메이커', W / 2, H - 20);

  return cv;
}

export function downloadCanvas(cv) {
  const a = document.createElement('a');
  a.download = '여행코스.png';
  a.href = cv.toDataURL('image/png');
  a.click();
}
