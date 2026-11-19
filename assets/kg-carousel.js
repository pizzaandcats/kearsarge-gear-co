/* Feature close-up carousel. Markup:
   <div class="carousel" data-carousel>
     <div class="car-track" tabindex="0"> <figure class="car-slide">...</figure> ... </div>
     <button class="car-prev">  <button class="car-next">
   </div>
   Scrolls one slide per click; buttons disable at the ends. Swipe and
   trackpad scrolling work natively (CSS scroll-snap). */
(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var track = car.querySelector('.car-track');
    var root = car.closest('section') || car; // the arrows sit in the section header
    var prev = root.querySelector('.car-prev');
    var next = root.querySelector('.car-next');
    if (!track || !prev || !next) return;
    function step() {
      var slide = track.querySelector('.car-slide');
      if (!slide) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      return slide.getBoundingClientRect().width + gap;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
