document.addEventListener('DOMContentLoaded', function(){
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('visible'); observer.unobserve(e.target);} });
  }, {threshold:.08});
  document.querySelectorAll('.reveal').forEach(function(el){observer.observe(el)});
  document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
});


// Homepage animation carousel
(function(){
  const carousel = document.querySelector('[data-animation-carousel]');
  if(!carousel) return;
  const track = carousel.querySelector('[data-animation-track]');
  const slides = Array.from(carousel.querySelectorAll('[data-animation-slide]'));
  const prev = carousel.querySelector('[data-animation-prev]');
  const next = carousel.querySelector('[data-animation-next]');
  const dots = Array.from(carousel.querySelectorAll('[data-animation-dot]'));
  let index = 0;

  function pauseVideos(){
    carousel.querySelectorAll('.animation-frame').forEach(frame => {
      try {
        frame.contentWindow.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}), '*');
      } catch(e) {}
    });
  }

  function goTo(nextIndex){
    pauseVideos();
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translate3d(-${index * 100}%,0,0)`;
    dots.forEach((dot,i) => dot.classList.toggle('active', i === index));
  }

  if(prev) prev.addEventListener('click', () => goTo(index - 1));
  if(next) next.addEventListener('click', () => goTo(index + 1));
  dots.forEach((dot,i) => dot.addEventListener('click', () => goTo(i)));

  let touchStart = null;
  carousel.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; }, {passive:true});
  carousel.addEventListener('touchend', e => {
    if(touchStart === null) return;
    const delta = e.changedTouches[0].clientX - touchStart;
    if(Math.abs(delta) > 55) goTo(index + (delta < 0 ? 1 : -1));
    touchStart = null;
  }, {passive:true});
})();


// Justified image mosaics: preserve each image's full composition while filling every row.
(function(){
  function layoutMosaic(gallery){
    const tiles = Array.from(gallery.querySelectorAll(':scope > .creative-tile'));
    if(!tiles.length) return;

    const gap = window.innerWidth <= 640 ? 3 : 5;
    const innerWidth = gallery.clientWidth - gap * 2;
    if(innerWidth <= 0) return;

    // Mobile: one full-width image per row, using its natural aspect ratio.
    if(window.innerWidth <= 640){
      tiles.forEach(tile => {
        const img = tile.querySelector('img');
        if(!img || !img.naturalWidth || !img.naturalHeight) return;
        const ratio = img.naturalWidth / img.naturalHeight;
        tile.style.width = innerWidth + 'px';
        tile.style.height = Math.round(innerWidth / ratio) + 'px';
      });
      gallery.classList.add('justified-ready');
      return;
    }

    const target = gallery.classList.contains('work-mosaic') ? 280 : 245;
    const minH = gallery.classList.contains('work-mosaic') ? 205 : 185;
    const maxH = gallery.classList.contains('work-mosaic') ? 345 : 315;

    const items = tiles.map(tile => {
      const img = tile.querySelector('img');
      const ratio = img && img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1.35;
      return {tile, ratio};
    });

    // Build rows near the target height. This is similar to Flickr/Google Photos justified layouts.
    const rows = [];
    let row = [];
    let ratioSum = 0;
    items.forEach((item, idx) => {
      row.push(item);
      ratioSum += item.ratio;
      const available = innerWidth - gap * Math.max(0, row.length - 1);
      const projectedH = available / ratioSum;
      const isLast = idx === items.length - 1;
      if(projectedH <= target || isLast){
        rows.push(row);
        row = [];
        ratioSum = 0;
      }
    });

    // Avoid a lonely final tile by borrowing one image from the previous row.
    if(rows.length > 1 && rows[rows.length - 1].length === 1 && rows[rows.length - 2].length > 2){
      rows[rows.length - 1].unshift(rows[rows.length - 2].pop());
    }

    rows.forEach((r, rowIndex) => {
      const sum = r.reduce((s,i) => s + i.ratio, 0);
      const available = innerWidth - gap * Math.max(0, r.length - 1);
      let h = available / sum;

      // Keep resizing modest. If a row would become extreme, keep it near target,
      // then proportionally distribute the remaining width across the row.
      h = Math.max(minH, Math.min(maxH, h));
      let widths = r.map(i => i.ratio * h);
      const total = widths.reduce((s,w) => s + w, 0);
      const scale = available / total;
      widths = widths.map(w => w * scale);
      h *= scale;

      r.forEach((item, i) => {
        // Assign the rounding remainder to the last tile so every row lands flush.
        let w = i === r.length - 1
          ? available - widths.slice(0, -1).reduce((s,x) => s + Math.round(x), 0)
          : Math.round(widths[i]);
        item.tile.style.width = Math.max(1, w) + 'px';
        item.tile.style.height = Math.max(1, Math.round(h)) + 'px';
      });
    });

    gallery.classList.add('justified-ready');
  }

  function initJustifiedMosaics(){
    document.querySelectorAll('.creative-mosaic').forEach(gallery => {
      if(gallery.classList.contains('home-mosaic')) return;
      const images = Array.from(gallery.querySelectorAll('img'));
      let pending = images.filter(img => !img.complete || !img.naturalWidth).length;
      const run = () => requestAnimationFrame(() => layoutMosaic(gallery));
      if(pending === 0){ run(); }
      else {
        images.forEach(img => {
          if(img.complete && img.naturalWidth) return;
          const done = () => { pending--; if(pending <= 0) run(); };
          img.addEventListener('load', done, {once:true});
          img.addEventListener('error', done, {once:true});
        });
      }
    });
  }

  let resizeTimer;
  window.addEventListener('load', initJustifiedMosaics);
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initJustifiedMosaics, 120);
  });
})();
