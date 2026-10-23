(function () {
  document.querySelectorAll('.task-picker').forEach(function (picker) {
    var slot = picker.querySelector('.task-player .video-slot');
    var now = picker.querySelector('.task-now');

    picker.addEventListener('click', function (event) {
      var task = event.target.closest('.task');
      if (!task || task.getAttribute('aria-pressed') === 'true') return;
      var title = task.querySelector('.task-name').textContent;
      var video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.preload = 'none';
      video.poster = task.getAttribute('data-poster');
      video.setAttribute('aria-label', title + ' video');
      var source = document.createElement('source');
      source.src = task.getAttribute('data-src');
      source.type = 'video/mp4';
      video.appendChild(source);
      var previous = slot.querySelector('video');
      if (previous) {
        previous.pause();
        previous.replaceChildren();
        previous.load();
      }
      slot.replaceChildren(video);
      var meta = document.createElement('span');
      meta.textContent = '· ' + task.getAttribute('data-meta');
      now.replaceChildren(title + ' ', meta);
      picker.querySelectorAll('.task').forEach(function (other) {
        other.setAttribute('aria-pressed', other === task ? 'true' : 'false');
      });
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      slot.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
      var playing = video.play();
      if (playing) playing.catch(function () {});
    });
  });

  document.querySelectorAll('[data-copy-target]').forEach(function (button) {
    if (!navigator.clipboard) {
      button.hidden = true;
      return;
    }
    var label = button.textContent;
    button.addEventListener('click', function () {
      var text = document.getElementById(button.getAttribute('data-copy-target')).textContent;
      navigator.clipboard.writeText(text).then(function () {
        button.textContent = 'Copied';
        setTimeout(function () { button.textContent = label; }, 2000);
      });
    });
  });
})();
