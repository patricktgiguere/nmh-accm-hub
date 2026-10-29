(async function () {
  'use strict';
  var list = document.getElementById('list');
  var count = document.getElementById('count');
  var q = document.getElementById('q');
  var tagSel = document.getElementById('tag');
  var hideDone = document.getElementById('hide-done');
  var idx;

  try { idx = await Hub.getJSON('/content/cases/index.json'); }
  catch (e) { list.innerHTML = '<p class="notice flag">Could not load the case index.</p>'; return; }

  var cases = idx.cases.filter(function (c) { return c.status !== 'hidden'; });
  var tags = {};
  cases.forEach(function (c) { (c.tags || []).forEach(function (t) { tags[t] = true; }); });
  Object.keys(tags).sort().forEach(function (t) {
    var o = document.createElement('option'); o.value = t; o.textContent = t; tagSel.appendChild(o);
  });

  function render() {
    var prog = Hub.storage.allProgress();
    var term = q.value.trim().toLowerCase();
    var tag = tagSel.value;
    var shown = cases.filter(function (c) {
      var p = prog[c.id];
      if (hideDone.checked && p && p.completed) return false;
      if (tag && (c.tags || []).indexOf(tag) < 0) return false;
      if (term) {
        var hay = [c.title, c.subtitle, (c.tags || []).join(' '), (c.objectives || []).join(' ')].join(' ').toLowerCase();
        if (hay.indexOf(term) < 0) return false;
      }
      return true;
    });
    list.innerHTML = '';
    shown.forEach(function (c) {
      var p = prog[c.id] || {};
      var state = p.completed ? '<span class="pill ok">Completed</span>' : (p.stage > 0 ? '<span class="pill">In progress</span>' : '');
      var draft = c.status !== 'released' ? '<span class="pill warn">Draft, visible to administrators only</span>' : '';
      var a = Hub.el('a', { class: 'card link', href: '/case.html?id=' + encodeURIComponent(c.id) });
      a.innerHTML =
        '<h2>' + Hub.escapeHtml(c.title) + '</h2>' +
        (c.subtitle ? '<p class="muted">' + Hub.escapeHtml(c.subtitle) + '</p>' : '') +
        '<p class="small">' + Hub.escapeHtml(c.estimatedMinutes || '') + ' min · ' + Hub.escapeHtml(c.difficulty || '') + '</p>' +
        '<p>' + (c.tags || []).map(function (t) { return '<span class="pill neutral">' + Hub.escapeHtml(t) + '</span>'; }).join('') + '</p>' +
        '<p>' + state + draft + '</p>';
      list.appendChild(a);
    });
    count.textContent = shown.length + ' of ' + cases.length + ' cases shown';
  }

  q.addEventListener('input', render);
  tagSel.addEventListener('change', render);
  hideDone.addEventListener('change', render);
  render();

  // Export, import, clear
  document.getElementById('export').addEventListener('click', function () {
    var data = { exported: new Date().toISOString(), site: 'accm-hub', progress: Hub.storage.allProgress() };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'accm-hub-notes.json'; a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
  document.getElementById('import-btn').addEventListener('click', function () { document.getElementById('import').click(); });
  document.getElementById('import').addEventListener('change', function (ev) {
    var f = ev.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var data = JSON.parse(r.result);
        if (!data.progress) throw new Error('bad file');
        Object.keys(data.progress).forEach(function (id) { Hub.storage.set('case:' + id, data.progress[id]); });
        alert('Imported notes for ' + Object.keys(data.progress).length + ' cases.');
        render();
      } catch (e) { alert('That file does not look like an export from this site.'); }
    };
    r.readAsText(f);
  });
  document.getElementById('clear').addEventListener('click', function () {
    if (!confirm('Delete all case progress and notes stored in this browser? This cannot be undone.')) return;
    Object.keys(Hub.storage.allProgress()).forEach(function (id) { Hub.storage.remove('case:' + id); });
    render();
  });
})();
