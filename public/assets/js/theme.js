/* Theme preference. Loaded in <head> so the correct theme applies before first paint.
   Stored only in this browser. "system" (default) follows the device setting. */
(function () {
  var KEY = 'accm-hub:theme';
  function read() { try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; } }
  function apply(mode) {
    if (mode === 'light' || mode === 'dark') document.documentElement.setAttribute('data-theme', mode);
    else document.documentElement.removeAttribute('data-theme');
  }
  apply(read());

  window.HubTheme = {
    get: read,
    set: function (mode) { try { localStorage.setItem(KEY, mode); } catch (e) {} apply(mode); render(); },
    mount: mount
  };

  function render() {
    var cur = read();
    document.querySelectorAll('.theme-toggle button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.mode === cur ? 'true' : 'false');
    });
  }
  function mount() {
    var nav = document.querySelector('header.site nav.primary ul');
    if (!nav || document.querySelector('.theme-toggle')) return;
    var li = document.createElement('li');
    li.innerHTML = '<div class="theme-toggle" role="group" aria-label="Colour theme">' +
      '<button type="button" data-mode="system" title="Follow device setting">Auto</button>' +
      '<button type="button" data-mode="light" title="Light theme">Light</button>' +
      '<button type="button" data-mode="dark" title="Dark theme">Dark</button></div>';
    nav.appendChild(li);
    li.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-mode]'); if (b) window.HubTheme.set(b.dataset.mode);
    });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
