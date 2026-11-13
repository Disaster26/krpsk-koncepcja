(function () {
  var rok = document.getElementById('rok');
  if (rok) rok.textContent = new Date().getFullYear();

  // menu mobilne
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function zamknij() { menu.classList.remove('otw'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Otwórz menu'); }
  if (burger) {
    burger.addEventListener('click', function () {
      var otw = menu.classList.toggle('otw');
      burger.setAttribute('aria-expanded', otw ? 'true' : 'false');
      burger.setAttribute('aria-label', otw ? 'Zamknij menu' : 'Otwórz menu');
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') zamknij(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') zamknij(); });
  }

  // aktywna pozycja menu
  var linki = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var sekcje = linki.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var io = new IntersectionObserver(function (wpisy) {
      wpisy.forEach(function (w) {
        if (w.isIntersecting) {
          linki.forEach(function (a) { a.classList.toggle('akt', a.getAttribute('href') === '#' + w.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sekcje.forEach(function (s) { io.observe(s); });

    // dolny pasek na telefonie po minięciu przycisku z pierwszego ekranu
    var pasek = document.getElementById('mob-pasek');
    var heroBtn = document.getElementById('hero-btn');
    var kontakt = document.getElementById('kontakt');
    var zaHero = false, wKontakcie = false;
    function odswiez() {
      var w = zaHero && !wKontakcie;
      pasek.classList.toggle('widac', w);
      pasek.setAttribute('aria-hidden', w ? 'false' : 'true');
      pasek.querySelectorAll('a').forEach(function (a) { a.tabIndex = w ? 0 : -1; });
    }
    new IntersectionObserver(function (w) { zaHero = !w[0].isIntersecting && w[0].boundingClientRect.top < 0; odswiez(); }).observe(heroBtn);
    new IntersectionObserver(function (w) { wKontakcie = w[0].isIntersecting; odswiez(); }, { rootMargin: '0px 0px -30% 0px' }).observe(kontakt);
  }

  // karty przeciągane myszą
  document.querySelectorAll('[data-swipe]').forEach(function (el) {
    var start = 0, sl = 0, ciagnie = false, ruch = false;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || el.scrollWidth <= el.clientWidth) return;
      ciagnie = true; ruch = false; start = e.clientX; sl = el.scrollLeft; el.style.scrollSnapType = 'none';
    });
    window.addEventListener('pointermove', function (e) {
      if (!ciagnie) return;
      var d = e.clientX - start; if (Math.abs(d) > 4) ruch = true;
      el.scrollLeft = sl - d;
    });
    window.addEventListener('pointerup', function () { if (!ciagnie) return; ciagnie = false; el.style.scrollSnapType = ''; });
    el.addEventListener('click', function (e) { if (ruch) { e.preventDefault(); ruch = false; } }, true);
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  });

  // formularz pokazowy
  var form = document.getElementById('form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var info = document.getElementById('form-info');
    info.hidden = false;
    info.textContent = form.checkValidity() ? 'Dziękuję. Formularz zacznie wysyłać wiadomości po wdrożeniu strony.' : 'Proszę uzupełnić imię, poprawny e-mail i zaznaczyć zgodę.';
  });

  // cookies
  var KLUCZ = 'krpsk_cookies';
  var baner = document.getElementById('cookies');
  function czytaj() { try { return JSON.parse(localStorage.getItem(KLUCZ) || 'null'); } catch (e) { return null; } }
  function zapisz(zew) { try { localStorage.setItem(KLUCZ, JSON.stringify({ zew: zew, t: Date.now() })); } catch (e) {} }
  function mapa(zew) {
    var box = document.getElementById('mapa');
    var ifr = document.getElementById('mapa-iframe');
    if (!zew && ifr) {
      box.innerHTML = '<div class="mapa-zast"><p><strong>ul. Jana III Sobieskiego 244, 43-300 Bielsko-Biała</strong></p><p>Mapa Google jest wyłączona w ustawieniach cookies.</p><a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=ul.+Jana+III+Sobieskiego+244,+43-300+Bielsko-Bia%C5%82a" target="_blank" rel="noopener">Wyznacz trasę</a></div>';
    } else if (zew && !ifr) {
      box.innerHTML = '<iframe id="mapa-iframe" title="Mapa dojazdu: ul. Jana III Sobieskiego 244, Bielsko-Biała" src="https://www.google.com/maps?q=ul.+Jana+III+Sobieskiego+244,+43-300+Bielsko-Bia%C5%82a&amp;output=embed" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    }
  }
  function decyzja(zew) { zapisz(zew); mapa(zew); baner.hidden = true; }
  var stan = czytaj();
  var rokMs = 365 * 24 * 3600 * 1000;
  if (stan && Date.now() - stan.t < rokMs) { mapa(stan.zew); } else { baner.hidden = false; }
  document.getElementById('ck-all').addEventListener('click', function () { decyzja(true); });
  document.getElementById('ck-min').addEventListener('click', function () {
    var opcje = document.getElementById('ck-opcje');
    decyzja(!opcje.hidden && document.getElementById('ck-zew').checked);
  });
  document.getElementById('ck-set').addEventListener('click', function () {
    var opcje = document.getElementById('ck-opcje');
    opcje.hidden = !opcje.hidden;
    document.getElementById('ck-min').textContent = opcje.hidden ? 'Tylko niezbędne' : 'Zapisz wybór';
  });
  var ust = document.getElementById('cookies-ust');
  if (ust) ust.addEventListener('click', function () { baner.hidden = false; });
})();
