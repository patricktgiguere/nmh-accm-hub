/* Shared helpers: tiny Markdown renderer, review flags, nav state, local storage.
   No external libraries, no network calls beyond fetching the site's own content. */

window.Hub = (function () {
  'use strict';

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Inline formatting: bold, italic, code, links, and the three review flags.
  function inline(s) {
    s = escapeHtml(s);
    s = s.replace(/\[VERIFY\]/g, '<mark class="verify" title="Reference or value not yet verified by faculty">VERIFY</mark>');
    s = s.replace(/\[NMH protocol, insert(?::\s*([^\]]+))?\]/g, function (m, detail) {
      return '<mark class="nmh" title="Institution-specific content to be completed by faculty">NMH protocol, insert' + (detail ? ': ' + detail : '') + '</mark>';
    });
    s = s.replace(/\[REVIEW\]/g, '<mark class="review" title="Clinical claim flagged for faculty review">REVIEW</mark>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');
    return s;
  }

  // Block-level: headings (###), unordered and ordered lists, paragraphs, blank-line separation.
  function md(text, baseLevel) {
    if (!text) return '';
    baseLevel = baseLevel || 3; // '#' inside case sections renders as h3, beneath the page's own h2s
    var lines = String(text).replace(/\r\n/g, '\n').split('\n');
    var out = [], para = [], list = null, listType = null;

    function flushPara() {
      if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; }
    }
    function flushList() {
      if (list) { out.push('<' + listType + '>' + list.join('') + '</' + listType + '>'); list = null; listType = null; }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var h = line.match(/^(#{1,4})\s+(.*)$/);
      var ul = line.match(/^\s*[-*]\s+(.*)$/);
      var ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      if (h) {
        flushPara(); flushList();
        var level = Math.min(h[1].length - 1 + baseLevel, 6);
        out.push('<h' + level + '>' + inline(h[2]) + '</h' + level + '>');
      } else if (ul || ol) {
        flushPara();
        var type = ul ? 'ul' : 'ol';
        if (list && listType !== type) flushList();
        if (!list) { list = []; listType = type; }
        list.push('<li>' + inline((ul || ol)[1]) + '</li>');
      } else if (line.trim() === '') {
        flushPara(); flushList();
      } else {
        if (list) flushList();
        para.push(line.trim());
      }
    }
    flushPara(); flushList();
    return out.join('\n');
  }

  function markCurrentNav() {
    var path = location.pathname.replace(/\/index\.html$/, '/');
    document.querySelectorAll('nav.primary a').forEach(function (a) {
      var href = a.getAttribute('href');
      var match = href === path || (href !== '/' && path.indexOf(href.replace(/\.html$/, '')) === 0);
      if (match) a.setAttribute('aria-current', 'page');
    });
  }

  // Local-only storage. Nothing here leaves the browser.
  var storage = {
    key: function (id) { return 'accm-hub:' + id; },
    get: function (id, fallback) {
      try { var v = localStorage.getItem(this.key(id)); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set: function (id, value) {
      try { localStorage.setItem(this.key(id), JSON.stringify(value)); return true; }
      catch (e) { return false; }
    },
    remove: function (id) { try { localStorage.removeItem(this.key(id)); } catch (e) {} },
    allProgress: function () {
      var res = {};
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf('accm-hub:case:') === 0) res[k.replace('accm-hub:case:', '')] = JSON.parse(localStorage.getItem(k));
        }
      } catch (e) {}
      return res;
    }
  };

  async function getJSON(url) {
    var r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error('Could not load ' + url + ' (' + r.status + ')');
    return r.json();
  }
  async function getText(url) {
    var r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error('Could not load ' + url + ' (' + r.status + ')');
    return r.text();
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  document.addEventListener('DOMContentLoaded', markCurrentNav);

  return { md: md, inline: inline, escapeHtml: escapeHtml, storage: storage, getJSON: getJSON, getText: getText, qs: qs, el: el };
})();
