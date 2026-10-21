/* ====== EDITA AQUÍ: mensajes y dedicatoria ======
   x = posición en el mundo (0 a 1, de izquierda a derecha)
   b = altura en pantalla (% desde abajo)
   Puedes cambiar, quitar o añadir notas libremente. */
const CONFIG = {
  mensajes: [
    { x: .09, b: 46, texto: "Bicdy, ojalá la vida te regale tantos momentos bonitos como destinos tienes por descubrir." },
    { x: .21, b: 58, texto: "Que nunca te falten motivos para sonreír, lugares nuevos que conocer y sueños que perseguir." },
    { x: .37, b: 52, texto: "Incluso en los días más largos, recuerda que hay personas que se alegran de verte cumplir tus sueños." },
    { x: .60, b: 56, texto: "Sigue volando alto, a tu manera y a tu propio ritmo." },
    { x: .79, b: 54, texto: "Que siempre encuentres un poquito de magia en los lugares más inesperados." },
    { x: .91, b: 50, texto: "Este pequeño mundo fue creado pensando en ti, en las cosas que te gustan y en lo especial que es tu amistad." }
  ],
  dedicatoria: "Para la mejor amiga de todo el mundo", // se muestra en alfabeto aeronáutico
  // Mensajes de las avionetas con pancarta que cruzan el jardín
  pancartas: [
    "Te quiero mucho, Bicdy",
    "Eres una amiga increíble",
    "Gracias por existir en mi vida",
    "Vuela alto, mejor amiga",
    "Qué suerte tenerte de amiga"
  ],
  secreto: "EDITA: mensaje para quien encuentra la estrella escondida."
};
/* ================================================ */

const $ = s => document.querySelector(s), R = Math.random, rn = (a, b) => a + R() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mq = matchMedia("(prefers-reduced-motion: reduce)");
let calm = mq.matches;
const LOW = (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 3);
const layers = [$("#L1"), $("#L2"), $("#L3")], F = [.12, .4, 1], L3 = $("#L3");
const ZONES = [{ n: "El jardín", x: .14 }, { n: "El mirador", x: .38 }, { n: "La pista", x: .56 }, { n: "La puerta pequeña", x: .75 }, { n: "El rincón tranquilo", x: .91 }];
let vw, vh, W, cam = 0, camT = 0, pc = 0, mx = 0, my = 0, smx = 0, smy = 0, curZone = -1;

/* ---------- construcción del mundo ---------- */
function put(html, x, b, cls = "") {
  const d = document.createElement("div");
  d.className = "obj " + cls; d.style.left = x * 100 + "%"; d.style.bottom = b + "%"; d.innerHTML = html;
  L3.appendChild(d); return d;
}
(function build() {
  // colinas lejanas con lucecitas
  $("#L1").innerHTML = '<svg class="hills" viewBox="0 0 1000 200" preserveAspectRatio="none"><path d="M0 200V120Q80 60 160 110T320 100T480 85T640 105T800 80T1000 110V200Z" fill="#1b1450"/></svg>';
  for (let i = 0; i < 14; i++) { const l = document.createElement("i"); l.className = "lamp"; l.style.left = rn(2, 98) + "%"; l.style.bottom = rn(24, 30) + "%"; l.style.animationDelay = -rn(0, 3) + "s"; $("#L1").appendChild(l); }
  // árboles
  for (let i = 0; i < 46; i++) { const t = document.createElement("div"), h = rn(14, 30); t.className = "tree"; t.style.left = rn(0, 98) + "%"; t.style.height = h + "vh"; t.style.width = h * .5 + "vh"; $("#L2").appendChild(t); }
  L3.insertAdjacentHTML("beforeend", '<div class="ground"></div><div class="path"></div>');

  // mirador
  put('<div class="rail"></div>', .33, 17); put('<div class="bench"></div>', .39, 17);
  // pista
  put('<div class="rw">' + Array.from({ length: 16 }, () => `<i style="--dl:${-rn(0, 2).toFixed(2)}s"></i>`).join("") + "</div>", .50, 14);
  put('<div class="pole"></div>', .53, 16); put('<div class="beacon" data-plane="1" role="button" aria-label="Faro de la pista"></div>', .64, 16);
  // puerta, gato, botones
  put('<div class="doorway" role="button" aria-label="Puerta pequeña"><div class="beam"></div><div class="frame"><div class="panel"><i class="bt"></i><i class="bt"></i><i class="knob"></i></div></div></div>', .74, 15);
  put('<div class="cat" data-spark="1"><svg viewBox="0 0 60 70"><path class="tail" d="M44 66C60 62 58 40 50 36" stroke="#07051a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M14 68C10 48 18 36 28 34C38 36 46 48 42 68Z" fill="#07051a"/><circle cx="26" cy="26" r="11" fill="#07051a"/><path d="M17 20L16 8L24 15ZM35 20L36 8L28 15Z" fill="#07051a"/><circle class="eye" cx="22" cy="26" r="2" fill="#d6ff9a"/><circle class="eye" cx="30" cy="26" r="2" fill="#d6ff9a"/></svg></div>', .70, 21);
  put('<div class="wall"></div>', .68, 15);
  for (let i = 0; i < 6; i++) { const b = put('<div class="bbtn" data-spark="1" aria-hidden="true"></div>', rn(.70, .83), rn(6, 11)); b.firstChild.style.position = "static"; }
  // rincón tranquilo
  put('<div class="post"></div>', .83, 16); put('<div class="bench"></div>', .955, 17);
  const NATO = { A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot", G: "Golf", H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima", M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee", Z: "Zulu" };
  const sign = put('<div class="signboard"></div>', .86, 17).firstChild;
  sign.setAttribute("aria-label", CONFIG.dedicatoria);
  CONFIG.dedicatoria.split(/\s+/).forEach(w => {
    const b = document.createElement("b");
    b.textContent = w.normalize("NFD").replace(/[^A-Za-z]/g, "").toUpperCase().split("").map(l => NATO[l].toUpperCase()).join(" ");
    sign.appendChild(b);
  });

  // tulipanes: jardín denso + algunos sueltos
  const PAL = ["#ff6fa5", "#ff9ec7", "#c86bff", "#ff7fb0", "#e8a0ff", "#ffb3d1"], ts = [];
  for (let i = 0; i < 28; i++) ts.push({ x: rn(.02, .27), b: rn(5, 19) });
  for (let i = 0; i < 12; i++) ts.push({ x: rn(.3, .98), b: rn(5, 13) });
  ts.sort((a, b) => b.b - a.b).forEach(p => {
    const t = put('<svg viewBox="0 0 40 100"><path d="M20 100C20 75 19 55 20 38" stroke="#3f8a64" stroke-width="3" fill="none"/><path d="M20 90C8 86 4 72 5 62C14 66 19 76 20 90Z" fill="#2f7455"/><path class="head" d="M7 8C7 30 12 42 20 42C28 42 33 30 33 8L26.5 17L20 2L13.5 17Z" fill="' + PAL[(R() * PAL.length) | 0] + '"/></svg>', p.x, p.b, "tulip");
    t.style.setProperty("--s", rn(9, 15).toFixed(1)); t.style.setProperty("--d", rn(3.5, 6.5).toFixed(2) + "s");
    t.style.setProperty("--dl", -rn(0, 6).toFixed(2) + "s"); t.style.setProperty("--r", rn(1.5, 4).toFixed(1) + "deg");
  });
  // avionetas con pancarta sobre el jardín
  CONFIG.pancartas.forEach((txt, i) => {
    const p = put('<svg viewBox="0 0 60 30"><path d="M4 16 L44 13 C54 12 59 14 59 16 C59 18 54 20 44 19 L4 16Z" fill="#e9ecff"/><path d="M26 15 L16 3 L22 3 L38 14Z M26 17 L16 29 L22 29 L38 18Z" fill="#b9c0ff"/><path d="M5 16 L2 8 L8 8 L12 14Z" fill="#ff6fa5"/></svg><i class="rope"></i><span class="flag"></span>', rn(.02, .1), 66 + (i % 3) * 8 - (i > 2 ? 3 : 0), "bplane");
    p.querySelector(".flag").textContent = txt;
    p.style.setProperty("--dur", rn(50, 70).toFixed(0) + "s"); p.style.setProperty("--dl", "-" + (i * 13) + "s");
    p.style.flexDirection = "row"; p.dataset.i = i;
  });
  // notas de amistad (después, para que queden por encima)
  CONFIG.mensajes.forEach((m, i) => { const n = put('<button class="note" aria-label="Nota ' + (i + 1) + '"></button>', m.x, m.b); n.firstChild.dataset.i = i; n.firstChild.style.animationDelay = -rn(0, 4) + "s"; });
  // navegación por zonas
  ZONES.forEach((z, i) => { const b = document.createElement("button"); b.setAttribute("aria-label", z.n); b.title = z.n; b.onclick = () => { camT = clamp(z.x * W - vw / 2, 0, W - vw); hint(); }; $("#nav").appendChild(b); });
})();

/* ---------- panel de mensajes ---------- */
let pt;
function show(text) { $("#ptext").textContent = text; $("#panel").classList.add("on"); clearTimeout(pt); pt = setTimeout(hidePanel, 12000); }
function hidePanel() { $("#panel").classList.remove("on"); }
$("#pclose").onclick = hidePanel;
$("#star").onclick = () => show(CONFIG.secreto);

/* ---------- interacciones del mundo ---------- */
L3.addEventListener("click", e => {
  const t = e.target;
  const note = t.closest(".note"); if (note) { show(CONFIG.mensajes[note.dataset.i].texto); burst(note, 6); return; }
  const tu = t.closest(".tulip"); if (tu) { tu.classList.add("lit"); setTimeout(() => tu.classList.remove("lit"), 2200); burst(tu, 4, true); return; }
  const door = t.closest(".doorway"); if (door) { door.classList.toggle("open"); burst(door, 10); return; }
  if (t.closest("[data-plane]")) { launchPlane(); burst(t, 6); return; }
  const sp = t.closest("[data-spark]"); if (sp) burst(sp, 6);
});

/* ---------- cámara: arrastre, teclado, rueda, botones ---------- */
let drag = null, moved = 0;
const stage = $("#stage");
stage.addEventListener("pointerdown", e => { drag = e.clientX; moved = 0; stage.style.cursor = "grabbing"; });
addEventListener("pointermove", e => {
  mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; P.x = e.clientX; P.y = e.clientY; P.on = 3;
  if (drag !== null) { const dx = e.clientX - drag; drag = e.clientX; moved += Math.abs(dx); camT = clamp(camT - dx, 0, W - vw); if (moved > 6) hint(); }
});
addEventListener("pointerup", () => { drag = null; stage.style.cursor = "grab"; });
addEventListener("pointercancel", () => { drag = null; });
stage.addEventListener("click", e => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
addEventListener("wheel", e => { camT = clamp(camT + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY), 0, W - vw); hint(); }, { passive: true });
addEventListener("keydown", e => {
  const k = { ArrowRight: vw * .3, ArrowLeft: -vw * .3 }[e.key];
  if (k) { camT = clamp(camT + k, 0, W - vw); hint(); }
  if (e.key === "Home") camT = 0; if (e.key === "End") camT = W - vw;
});
$("#prev").onclick = () => { camT = clamp(camT - vw * .6, 0, W - vw); hint(); };
$("#next").onclick = () => { camT = clamp(camT + vw * .6, 0, W - vw); hint(); };
function hint() { $("#hint").classList.add("off"); }

/* ---------- canvas ---------- */
const bg = $("#bg"), fg = $("#fg"), bx = bg.getContext("2d"), fx = fg.getContext("2d");
let stars = [], clouds = [], shoot = null, plane = null, nextShoot = 5, nextPlane = 7, flies = [], petals = [], sparks = [], nextPetal = 1;
const P = { x: -999, y: -999, on: 0 };
const glow = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"), r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,244,190,1)"); r.addColorStop(.25, "rgba(255,214,120,.55)"); r.addColorStop(1, "rgba(255,200,100,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return c; })();
const mkFly = () => ({ x: rn(0, vw), y: rn(vh * .35, vh * .95), z: rn(.3, 1), a: rn(0, 6.28), ph: rn(0, 6.28), bs: rn(.5, 1.6), life: 0, max: rn(8, 20), r: rn(1.5, 3) });

function resize() {
  vw = innerWidth; vh = innerHeight; W = Math.max(vw * 3.2, 2600);
  L3.style.setProperty("--dist", W * .26 + "px");
  layers.forEach((l, i) => l.style.width = vw + (W - vw) * F[i] + "px");
  const d = Math.min(devicePixelRatio || 1, LOW ? 1 : 1.75);
  [bg, fg].forEach(c => { c.width = vw * d; c.height = vh * d; c.getContext("2d").setTransform(d, 0, 0, d, 0, 0); });
  camT = clamp(camT, 0, W - vw); cam = clamp(cam, 0, W - vw);
  stars = Array.from({ length: LOW ? 70 : 140 }, () => ({ x: R() * vw, y: R() * vh * .7, r: rn(.4, 1.4), p: rn(0, 6.28), s: rn(.6, 2) }));
  clouds = Array.from({ length: 5 }, () => ({ x: rn(0, vw), y: rn(.08, .5) * vh, w: rn(160, 320), s: rn(3, 9) }));
  const n = LOW ? 12 : vw < 600 ? 20 : 32;
  flies = Array.from({ length: calm ? 8 : n }, () => { const f = mkFly(); f.life = rn(0, f.max); return f; });
}
addEventListener("resize", resize);

function launchPlane() {
  if (plane || calm) return;
  const dir = R() < .5 ? 1 : -1;
  plane = { x: dir > 0 ? -40 : vw + 40, y0: rn(.1, .3) * vh, dir, sp: vw / 12 + 40, trail: [], acc: 0 };
}
function burst(el, n, petal) {
  const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height * .3;
  for (let i = 0; i < n; i++) {
    if (petal && !calm) petals.push(mkPetal(x, y));
    else sparks.push({ x, y, vx: rn(-30, 30), vy: rn(-50, -10), life: 0, max: rn(.8, 1.6) });
  }
}
const mkPetal = (x, y) => ({ x, y, vx: rn(10, 30), vy: rn(8, 20), rot: rn(0, 6.28), vr: rn(-1.5, 1.5), s: rn(3, 6), ph: rn(0, 6.28) });

function drawPlane(c, p, t) {
  c.save(); c.translate(p.x, p.y); c.scale(p.dir, 1); c.rotate(-.04);
  c.fillStyle = "#e9ecff"; c.beginPath(); c.ellipse(0, 0, 13, 2.6, 0, 0, 6.28); c.fill();
  c.beginPath(); c.moveTo(-2, 0); c.lineTo(-9, -9); c.lineTo(-5, -9); c.lineTo(5, 0); c.fill();
  c.beginPath(); c.moveTo(-2, 0); c.lineTo(-9, 9); c.lineTo(-5, 9); c.lineTo(5, 0); c.fill();
  c.beginPath(); c.moveTo(-11, -1); c.lineTo(-14, -7); c.lineTo(-9, -7); c.fill();
  if (Math.sin(t * 6) > 0) { c.fillStyle = "#ff4060"; c.fillRect(-8, -10, 2.5, 2.5); }
  c.fillStyle = "#4dff9a"; c.fillRect(-8, 8, 2.5, 2.5); c.restore();
}

function drawBg(t, dt) {
  bx.clearRect(0, 0, vw, vh);
  stars.forEach(s => { bx.globalAlpha = .35 + .65 * (Math.sin(t * s.s + s.p) + 1) / 2; bx.fillStyle = "#fff"; bx.beginPath(); bx.arc(s.x, s.y, s.r, 0, 6.28); bx.fill(); });
  bx.globalAlpha = 1;
  clouds.forEach(c => {
    if (!calm) { c.x += c.s * dt; if (c.x - c.w > vw) c.x = -c.w; }
    const g = bx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.w);
    g.addColorStop(0, "rgba(160,140,230,.14)"); g.addColorStop(1, "rgba(160,140,230,0)");
    bx.fillStyle = g; bx.save(); bx.translate(0, c.y); bx.scale(1, .22); bx.translate(0, -c.y); bx.beginPath(); bx.arc(c.x, c.y, c.w, 0, 6.28); bx.fill(); bx.restore();
  });
  if (calm) return;
  nextShoot -= dt; if (nextShoot < 0 && !shoot) { shoot = { x: rn(.2, .9) * vw, y: rn(.02, .25) * vh, life: 0 }; nextShoot = rn(9, 20); }
  if (shoot) {
    shoot.life += dt; const k = shoot.life / .9; shoot.x -= 520 * dt; shoot.y += 190 * dt;
    const g = bx.createLinearGradient(shoot.x, shoot.y, shoot.x + 90, shoot.y - 33); g.addColorStop(0, "rgba(255,255,255," + (1 - k) + ")"); g.addColorStop(1, "rgba(255,255,255,0)");
    bx.strokeStyle = g; bx.lineWidth = 1.6; bx.beginPath(); bx.moveTo(shoot.x, shoot.y); bx.lineTo(shoot.x + 90, shoot.y - 33); bx.stroke();
    if (k >= 1) shoot = null;
  }
  nextPlane -= dt; if (nextPlane < 0) { launchPlane(); nextPlane = rn(25, 45); }
  if (plane) {
    plane.x += plane.sp * plane.dir * dt; plane.y = plane.y0 + Math.sin(plane.x * .004) * 14;
    plane.acc += dt; if (plane.acc > .03) { plane.acc = 0; plane.trail.push({ x: plane.x - plane.dir * 13, y: plane.y, t }); }
    plane.trail = plane.trail.filter(p => t - p.t < 4);
    bx.lineWidth = 2; bx.lineCap = "round";
    for (let i = 1; i < plane.trail.length; i++) {
      const a = plane.trail[i - 1], b = plane.trail[i]; bx.strokeStyle = "rgba(255,200,230," + (.5 * (1 - (t - b.t) / 4)) + ")";
      bx.beginPath(); bx.moveTo(a.x, a.y); bx.lineTo(b.x, b.y); bx.stroke();
    }
    drawPlane(bx, plane, t);
    if (plane.x < -60 || plane.x > vw + 60) { if (!plane.trail.length) plane = null; else plane.sp = 0; }
  }
}

function drawFg(t, dt, dcam) {
  fx.clearRect(0, 0, vw, vh); fx.globalCompositeOperation = "lighter";
  P.on = Math.max(0, P.on - dt);
  flies.forEach(f => {
    f.life += dt; if (f.life > f.max) Object.assign(f, mkFly());
    const fade = Math.min(1, f.life / 2, (f.max - f.life) / 2);
    f.a += (Math.sin(t * .3 + f.ph) * .9 + rn(-1, 1) * .6) * dt * 1.6;
    const sp = (10 + 26 * f.z) * (calm ? .15 : 1);
    let vx = Math.cos(f.a) * sp, vy = Math.sin(f.a) * sp * .6 - 4 * f.z;
    if (P.on > 0 && !calm) { const dx = P.x - f.x, dy = P.y - f.y, d = Math.hypot(dx, dy); if (d < 200 && d > 1) { const k = (d < 70 ? -1 : .5) * (1 - d / 200) * 40; vx += dx / d * k; vy += dy / d * k; } }
    f.x += vx * dt - dcam * f.z * .6; f.y += vy * dt;
    if (f.y < -20 || f.y > vh + 20 || f.x < -30 || f.x > vw + 30) f.life = f.max;
    const b = (Math.sin(t * f.bs * 1.5 + f.ph) + 1) / 2, a = fade * (.25 + .75 * b * b), s = f.r * 8 * (.5 + f.z);
    fx.globalAlpha = clamp(a, 0, 1); fx.drawImage(glow, f.x - s / 2, f.y - s / 2, s, s);
    fx.globalAlpha = clamp(a * 1.3, 0, 1); fx.drawImage(glow, f.x - s / 6, f.y - s / 6, s / 3, s / 3);
  });
  sparks = sparks.filter(s => (s.life += dt) < s.max);
  sparks.forEach(s => { s.x += s.vx * dt; s.y += s.vy * dt; fx.globalAlpha = 1 - s.life / s.max; fx.drawImage(glow, s.x - 8, s.y - 8, 16, 16); });
  fx.globalCompositeOperation = "source-over";
  if (!calm) {
    nextPetal -= dt;
    if (nextPetal < 0 && petals.length < (LOW ? 6 : 14)) {
      nextPetal = rn(2, 4); const ts = L3.querySelectorAll(".tulip"), el = ts[(R() * ts.length) | 0], r = el.getBoundingClientRect();
      if (r.right > 0 && r.left < vw) petals.push(mkPetal(r.left + r.width / 2, r.top + r.height * .1));
    }
    petals = petals.filter(p => p.y < vh + 10 && p.x > -50 && p.x < vw + 50);
    petals.forEach(p => {
      p.x += (p.vx + Math.sin(t + p.ph) * 12) * dt - dcam * .9; p.y += p.vy * dt; p.rot += p.vr * dt;
      fx.save(); fx.translate(p.x, p.y); fx.rotate(p.rot); fx.fillStyle = "rgba(255,150,190,.85)"; fx.beginPath(); fx.ellipse(0, 0, p.s, p.s * .55, 0, 0, 6.28); fx.fill(); fx.restore();
    });
  }
  fx.globalAlpha = 1;
}

let lt = 0;
function frame(ms) {
  requestAnimationFrame(frame); if (document.hidden) return;
  const t = ms / 1000, dt = Math.min(.05, t - lt); lt = t;
  cam += (camT - cam) * Math.min(1, dt * 7); const dcam = cam - pc; pc = cam;
  smx += (mx - smx) * .05; smy += (my - smy) * .05;
  layers.forEach((l, i) => l.style.transform = `translate3d(${-cam * F[i] - smx * F[i] * 28}px,${-smy * F[i] * 10}px,0)`);
  $(".moon").style.transform = `translate3d(${-cam * .03 - smx * 6}px,${-smy * 4}px,0)`;
  drawBg(t, dt); drawFg(t, dt, dcam);
  const c = cam + vw / 2; let zi = 0, best = 9e9;
  ZONES.forEach((z, i) => { const d = Math.abs(z.x * W - c); if (d < best) { best = d; zi = i; } });
  if (zi !== curZone) {
    curZone = zi; [...$("#nav").children].forEach((b, i) => b.classList.toggle("on", i === zi));
    const z = $("#zone"); z.textContent = ZONES[zi].n; z.classList.add("show"); clearTimeout(z._t); z._t = setTimeout(() => z.classList.remove("show"), 2600);
  }
}

/* ---------- sonido opcional (generado, sin archivos; apagado al inicio) ---------- */
let AC = null, master = null, soundOn = false, chimeT;
function setupAudio() {
  AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = 0; master.connect(AC.destination);
  const len = AC.sampleRate * 2, buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0); let l = 0;
  for (let i = 0; i < len; i++) { l = (l + .02 * (R() * 2 - 1)) / 1.02; d[i] = l * 3.5; }
  const s = AC.createBufferSource(); s.buffer = buf; s.loop = true;
  const f = AC.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 450;
  const o = AC.createOscillator(), og = AC.createGain(); o.frequency.value = .12; og.gain.value = 200; o.connect(og); og.connect(f.frequency); o.start();
  const g = AC.createGain(); g.gain.value = .5; s.connect(f); f.connect(g); g.connect(master); s.start();
}
function chime() {
  if (!soundOn) return;
  const n = [523.25, 587.33, 659.25, 783.99, 880][(R() * 5) | 0], o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
  o.type = "sine"; o.frequency.value = n; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + 3);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + 3.2);
  chimeT = setTimeout(chime, rn(6000, 12000));
}
$("#snd").onclick = () => {
  if (!AC) setupAudio();
  soundOn = !soundOn; AC.resume();
  master.gain.linearRampToValueAtTime(soundOn ? .6 : 0, AC.currentTime + 1);
  clearTimeout(chimeT); if (soundOn) chimeT = setTimeout(chime, 2000);
  $("#snd").setAttribute("aria-pressed", soundOn); $("#snd").textContent = "Sonido: " + (soundOn ? "encendido" : "apagado");
};

/* ---------- animaciones reducidas, bienvenida, impresión ---------- */
function setCalm(on) {
  calm = on; document.body.classList.toggle("calm", on); document.body.classList.toggle("full", !on);
  $("#calm").setAttribute("aria-pressed", on); $("#calm").textContent = on ? "Activar animaciones" : "Reducir animaciones"; resize();
}
$("#calm").onclick = () => setCalm(!calm);
$("#go").onclick = () => { $("#intro").classList.add("gone"); setTimeout(() => $("#intro").style.display = "none", 1000); };
$("#print").onclick = () => window.print();
$("#home").onclick = () => { const i = $("#intro"); i.style.display = "flex"; requestAnimationFrame(() => i.classList.remove("gone")); };

resize(); if (calm) setCalm(true);
requestAnimationFrame(frame);
