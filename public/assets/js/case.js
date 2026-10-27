/* Renders one case from content/cases/<id>.json.
   Schema is documented in content/cases/_TEMPLATE.json and the README. */
(async function () {
  'use strict';
  var root = document.getElementById('case');
  var id = Hub.qs('id');
  if (!id || !/^[a-z0-9-]+$/.test(id)) { root.innerHTML = '<p class="notice flag">No case selected.</p>'; return; }

  var c;
  try { c = await Hub.getJSON('/content/cases/' + id + '.json'); }
  catch (e) { root.innerHTML = '<p class="notice flag">That case could not be loaded. Check that <code>content/cases/' + Hub.escapeHtml(id) + '.json</code> exists and is valid JSON.</p>'; return; }

  document.title = c.title + ' · ACCM Curriculum Hub';
  var key = 'case:' + c.id;
  var prog = Hub.storage.get(key, { stage: 0, completed: false, notes: '', answers: {}, sba: {}, revealed: {} });
  function save() { Hub.storage.set(key, prog); }

  var html = [];
  html.push('<h1>' + Hub.escapeHtml(c.title) + '</h1>');
  if (c.subtitle) html.push('<p class="lead">' + Hub.escapeHtml(c.subtitle) + '</p>');
  if (c.status === 'draft') html.push('<p class="notice warn no-print"><strong>Draft.</strong> This case has not yet completed faculty review. Flagged items: <mark class="verify">VERIFY</mark> = reference or value unconfirmed, <mark class="nmh">NMH protocol, insert</mark> = institution-specific practice to be added, <mark class="review">REVIEW</mark> = clinical claim awaiting attending sign-off.</p>');
  html.push('<div class="case-meta">' +
    '<span>Estimated time: ' + Hub.escapeHtml(c.estimatedMinutes) + ' min</span>' +
    '<span>Difficulty: ' + Hub.escapeHtml(c.difficulty) + '</span>' +
    (c.version ? '<span>Version ' + Hub.escapeHtml(c.version) + '</span>' : '') +
    '</div>');
  html.push('<p>' + (c.tags || []).map(function (t) { return '<span class="pill neutral">' + Hub.escapeHtml(t) + '</span>'; }).join('') + '</p>');

  html.push('<div class="progress-bar no-print">' +
    '<span class="state" id="state"></span>' +
    '<button type="button" id="toggle-complete" class="secondary"></button>' +
    '<button type="button" id="print-view" class="secondary">Print view</button>' +
    '<button type="button" id="reset" class="secondary">Reset this case</button>' +
    '</div>');

  // Learning objectives and the topic name would give the diagnosis away, so they appear in the wrap-up.

  // Stages
  (c.stages || []).forEach(function (s, i) {
    var locked = i > prog.stage;
    html.push('<section class="stage' + (locked ? ' locked' : '') + '" id="stage-' + i + '" aria-labelledby="stage-h-' + i + '">');
    html.push('<div class="stage-head"><h2 id="stage-h-' + i + '">Stage ' + (i + 1) + ': ' + Hub.escapeHtml(s.title) + '</h2>' +
      (locked ? '<span class="pill neutral">Locked until you commit above</span>' : '') + '</div>');
    html.push('<div class="stage-body">');
    html.push(Hub.md(s.narrative));
    (s.questions || []).forEach(function (qn, j) {
      var qid = i + '-' + j;
      html.push('<div class="question" id="q-' + qid + '">');
      html.push('<p class="prompt">' + Hub.inline(qn.prompt) + '</p>');
      // All questions are open response. The fellow types a response and presses Enter
      // (or taps Submit). The model answer then appears beneath. Nothing is auto-graded.
      var saved = (prog.answers[qid] || '');
      var revealed = !!prog.revealed[qid];
      html.push('<div class="commit"><label for="a-' + qid + '">Your response (saved only in this browser)</label>' +
        '<textarea id="a-' + qid + '" data-q="' + qid + '" placeholder="Type your response, then press Enter. Shift+Enter for a new line."' + (revealed ? ' readonly' : '') + '>' + Hub.escapeHtml(saved) + '</textarea></div>');
      html.push('<div class="answer-reveal no-print"><button type="button" class="reveal" data-q="' + qid + '"' + (revealed ? ' hidden' : '') + '>Submit response</button>' +
        '<span class="small muted" id="hint-' + qid + '"' + (revealed ? ' hidden' : '') + '> &nbsp;Write something first. Committing is the point.</span></div>');
      html.push('<div class="model-answer" id="ma-' + qid + '"' + (revealed ? '' : ' hidden') + '><strong>Model answer and rationale</strong>' + Hub.md(qn.modelAnswer) + '</div>');
      html.push('</div>');
    });
    if (i < c.stages.length - 1) {
      html.push('<div class="btn-row no-print"><button type="button" class="next" data-stage="' + i + '"' + (i < prog.stage ? ' hidden' : '') + '>Commit and continue to Stage ' + (i + 2) + '</button></div>');
    }
    html.push('</div></section>');
  });

  function section(title, body, open) {
    return '<details' + (open ? ' open' : '') + '><summary>' + Hub.escapeHtml(title) + '</summary><div class="body">' + body + '</div></details>';
  }
  var finished = prog.stage >= (c.stages || []).length - 1;
  html.push('<div id="wrapup"' + (finished ? '' : ' hidden') + '>');
  html.push('<h2>Wrap-up</h2>');
  if (c.topic) html.push('<p class="lead"><strong>Topic:</strong> ' + Hub.escapeHtml(c.topic) + '</p>');
  html.push(section('What this case set out to teach', '<ol>' + (c.objectives || []).map(function (o) { return '<li>' + Hub.inline(o) + '</li>'; }).join('') + '</ol>'));
  html.push(section('Key teaching points', Hub.md(c.teachingPoints), true));
  html.push(section('Common pitfalls', Hub.md(c.pitfalls)));
  html.push(section('Where experts disagree', Hub.md(c.controversies)));
  html.push(section('Discuss with your attending', '<ol>' + (c.discussWithAttending || []).map(function (d) { return '<li>' + Hub.inline(d) + '</li>'; }).join('') + '</ol>', true));
  html.push(section('References', '<ol>' + (c.references || []).map(function (r) {
    var st = r.status === 'verified' ? '' : ' <mark class="verify">VERIFY</mark>';
    return '<li>' + Hub.inline(r.citation) + st + (r.note ? ' <span class="muted small">' + Hub.inline(r.note) + '</span>' : '') + '</li>';
  }).join('') + '</ol>'));
  html.push('</div>');

  html.push('<section class="card"><h2>My notes</h2><p class="small muted">Stored only in this browser. Never include patient identifiers.</p>' +
    '<label for="notes" class="sr-only">Notes</label><textarea id="notes">' + Hub.escapeHtml(prog.notes || '') + '</textarea></section>');

  html.push('<section class="card no-print"><h2>Ask Dr. Giguere a question about this case</h2>' +
    '<p class="notice warn"><strong>Never include patient identifiers or real protected health information.</strong> Describe the clinical question in general terms.</p>' +
    '<form id="ask"><input type="hidden" name="case" value="' + Hub.escapeHtml(c.title) + '">' +
    '<label for="msg">Your question</label><textarea id="msg" name="message" required maxlength="4000"></textarea>' +
    '<label for="hp" class="hp">Leave this field empty</label><input type="text" id="hp" name="website" class="hp" tabindex="-1" autocomplete="off">' +
    '<div class="btn-row"><button type="submit">Send</button></div><p id="ask-status" aria-live="polite" class="small"></p></form></section>');

  root.innerHTML = html.join('\n');

  // Behaviour
  function refreshState() {
    var st = document.getElementById('state');
    var tb = document.getElementById('toggle-complete');
    st.textContent = prog.completed ? 'Completed' : ('Stage ' + Math.min(prog.stage + 1, c.stages.length) + ' of ' + c.stages.length);
    tb.textContent = prog.completed ? 'Mark as not completed' : 'Mark case complete';
  }
  refreshState();

  root.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.matches('textarea[data-q]')) { prog.answers[t.dataset.q] = t.value; save(); }
    if (t.id === 'notes') { prog.notes = t.value; save(); }
  });

  function submitResponse(qid) {
    var ta = document.getElementById('a-' + qid);
    var hint = document.getElementById('hint-' + qid);
    if (!ta.value.trim()) {
      hint.hidden = false; hint.textContent = ' You have not written anything yet. Commit to a response before the model answer opens.';
      ta.focus(); return;
    }
    prog.answers[qid] = ta.value; prog.revealed[qid] = true; save();
    ta.readOnly = true;
    var btn = root.querySelector('button.reveal[data-q="' + qid + '"]'); if (btn) btn.hidden = true;
    hint.hidden = true;
    var ma = document.getElementById('ma-' + qid); ma.hidden = false;
    ma.setAttribute('tabindex', '-1'); ma.focus();
  }

  root.addEventListener('keydown', function (ev) {
    var t = ev.target;
    if (t.matches('textarea[data-q]') && ev.key === 'Enter' && !ev.shiftKey && !t.readOnly) {
      ev.preventDefault(); submitResponse(t.dataset.q);
    }
  });

  root.addEventListener('click', function (ev) {
    var t = ev.target;
    if (t.classList.contains('reveal')) submitResponse(t.dataset.q);
    if (t.classList.contains('next')) {
      var i = +t.dataset.stage;
      // Every question in this stage must be answered before the next stage opens.
      var pending = (c.stages[i].questions || []).map(function (_, j) { return i + '-' + j; }).filter(function (q) { return !prog.revealed[q]; });
      if (pending.length) {
        var first = document.getElementById('a-' + pending[0]);
        document.getElementById('hint-' + pending[0]).hidden = false;
        first.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus();
        return;
      }
      prog.stage = Math.max(prog.stage, i + 1); save();
      var nxt = document.getElementById('stage-' + (i + 1));
      nxt.classList.remove('locked'); var lockPill = nxt.querySelector('.stage-head .pill'); if (lockPill) lockPill.remove();
      t.hidden = true;
      if (prog.stage >= c.stages.length - 1) document.getElementById('wrapup').hidden = false;
      nxt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nxt.querySelector('h2').setAttribute('tabindex', '-1'); nxt.querySelector('h2').focus();
      refreshState();
    }
    if (t.id === 'toggle-complete') { prog.completed = !prog.completed; save(); refreshState(); }
    if (t.id === 'print-view') {
      document.body.classList.add('print-view');
      document.querySelectorAll('details').forEach(function (d) { d.open = true; });
      document.querySelectorAll('.model-answer, .rationale').forEach(function (e) { e.hidden = false; });
      document.getElementById('wrapup').hidden = false;
      window.print();
    }
    if (t.id === 'reset') {
      if (t.dataset.armed) { Hub.storage.remove(key); location.reload(); }
      else { t.dataset.armed = '1'; t.textContent = 'Click again to clear this case'; setTimeout(function () { delete t.dataset.armed; t.textContent = 'Reset this case'; }, 4000); }
    }
  });

  // Contact form
  document.getElementById('ask').addEventListener('submit', async function (ev) {
    ev.preventDefault();
    var f = ev.target, status = document.getElementById('ask-status'), btn = f.querySelector('button[type=submit]');
    btn.disabled = true; status.textContent = 'Sending…';
    try {
      var r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseTitle: f.case.value, message: f.message.value, website: f.website.value, page: location.href }) });
      var j = await r.json().catch(function () { return {}; });
      if (r.ok) { status.textContent = 'Sent. You will get a reply by email.'; f.message.value = ''; }
      else status.textContent = j.error || 'Could not send. Try again later or email directly.';
    } catch (e) { status.textContent = 'Network error. Try again later.'; }
    btn.disabled = false;
  });
})();
