(function () {
  var cfg = window.SITE_CONFIG;
  var venues = cfg.venues;
  var cards = {};      // card id -> { el, data, body }
  var setVenue = function () {};

  // ---------- helpers ----------
  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function list(s) {
    return s ? s.split(',').map(function (v) { return v.trim(); }).filter(Boolean) : [];
  }

  function venueNames() {
    return venues.map(function (v) { return v.name; });
  }

  // Split a Markdown file into its `key: value` header and body.
  function parse(text) {
    var m = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) return { data: {}, body: text };
    var data = {};
    m[1].split('\n').forEach(function (line) {
      var i = line.indexOf(':');
      if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    });
    return { data: data, body: m[2] };
  }

  // ---------- loading ----------
  function loadPositions() {
    return fetch('positions/index.json').then(function (r) {
      if (!r.ok) throw new Error('positions/index.json not found');
      return r.json();
    }).then(function (files) {
      return Promise.all(files.map(function (f) {
        return fetch('positions/' + f).then(function (r) {
          if (!r.ok) { console.warn('Missing position file: ' + f); return null; }
          return r.text();
        }).then(function (t) {
          if (!t) return null;
          var p = parse(t);
          p.file = f;
          return p;
        });
      }));
    }).then(function (all) { return all.filter(Boolean); });
  }

  // ---------- photo / video ----------
  function videoEmbedUrl(url) {
    var m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (m) return 'https://www.youtube-nocookie.com/embed/' + m[1];
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return 'https://player.vimeo.com/video/' + m[1];
    return null;
  }

  function buildMedia(d) {
    if (d.video) {
      var wrap = el('div', 'media media-video');
      var embed = videoEmbedUrl(d.video);
      if (embed) {
        var f = document.createElement('iframe');
        f.src = embed;
        f.title = (d.title || 'Position') + ' video';
        f.loading = 'lazy';
        f.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        f.setAttribute('allowfullscreen', '');
        wrap.appendChild(f);
      } else {
        var v = document.createElement('video');
        v.src = d.video;
        v.controls = true;
        v.playsInline = true;
        v.preload = 'metadata';
        if (d.image) v.poster = d.image;
        wrap.appendChild(v);
      }
      return wrap;
    }
    if (d.image) {
      var img = document.createElement('img');
      img.className = 'media media-image';
      img.src = d.image;
      img.alt = d.alt || d.title || '';
      img.loading = 'lazy';
      return img;
    }
    return null;
  }

  // ---------- card sections built from config.js ----------
  // Anything with data-scope="slug slug" is hidden when a venue outside that list is picked.
  function section(title, scope) {
    var w = el('div', 'card-section');
    w.dataset.scope = scope;
    w.appendChild(el('h2', null, title));
    return w;
  }

  // front matter `gear: Students Venue: dot2 | Auditorium: grandMA2`
  function buildGear(d, inCard) {
    if (!d.gear) return null;
    var entries = d.gear.split('|').map(function (s) { return s.trim(); }).filter(Boolean);
    var ul = el('ul');
    var all = {};
    entries.forEach(function (entry) {
      var i = entry.indexOf(':');
      var room = entry.slice(0, i).trim();
      var what = entry.slice(i + 1).trim();
      var scope = inCard.filter(function (v) { return v.room.toLowerCase() === room.toLowerCase(); })
        .map(function (v) { return slug(v.name); });
      if (!scope.length) {
        console.warn('"' + d.title + '": no venue in "' + room + '" for this position');
        scope = inCard.map(function (v) { return slug(v.name); });
      }
      scope.forEach(function (s) { all[s] = true; });
      var li = el('li');
      li.dataset.scope = scope.join(' ');
      li.appendChild(el('strong', null, room + ': '));
      li.appendChild(document.createTextNode(what));
      ul.appendChild(li);
    });
    var sec = section("What you'll use", Object.keys(all).join(' '));
    sec.appendChild(ul);
    return sec;
  }

  function buildWeekend(inCard) {
    var sec = section('A typical weekend', inCard.map(function (v) { return slug(v.name); }).join(' '));
    inCard.forEach(function (v) {
      var block = el('div', 'sched');
      block.dataset.scope = slug(v.name);
      block.appendChild(el('p', 'sched-venue', v.name + (v.room ? ' (' + v.room + ')' : '')));
      var ul = el('ul');
      v.schedule.forEach(function (line) { ul.appendChild(el('li', null, line)); });
      block.appendChild(ul);
      sec.appendChild(block);
    });
    return sec;
  }

  // Group venues that share a lead, so one lead isn't listed twice.
  function leadGroups(vs) {
    var groups = [];
    vs.forEach(function (v) {
      var g = groups.filter(function (x) { return x.email === v.leadEmail; })[0];
      if (!g) {
        g = { name: v.leadName, role: v.leadRole, email: v.leadEmail, venues: [] };
        groups.push(g);
      }
      g.venues.push(v.name);
    });
    return groups;
  }

  function buildLeads(inCard) {
    var sec = section('Who you serve with', inCard.map(function (v) { return slug(v.name); }).join(' '));
    var ul = el('ul');
    leadGroups(inCard).forEach(function (g) {
      var li = el('li');
      li.dataset.scope = g.venues.map(slug).join(' ');
      var a = el('a', null, g.name);
      a.href = 'mailto:' + g.email;
      li.appendChild(a);
      li.appendChild(document.createTextNode((g.role ? ', ' + g.role : '') + ' (' + g.venues.join(', ') + ')'));
      ul.appendChild(li);
    });
    sec.appendChild(ul);
    return sec;
  }

  // ---------- cards ----------
  function buildCard(p) {
    var d = p.data;
    var names = d.venues ? list(d.venues) : venueNames();
    names.forEach(function (n) {
      if (venueNames().indexOf(n) === -1) console.warn('"' + d.title + '": unknown venue "' + n + '"');
    });
    var inCard = venues.filter(function (v) { return names.indexOf(v.name) !== -1; });

    var card = el('details', 'card');
    card.id = slug(p.file.replace(/\.md$/, ''));
    card.dataset.venues = inCard.map(function (v) { return slug(v.name); }).join(' ');

    var sum = el('summary');
    sum.appendChild(el('span', 'card-title', d.title));
    sum.appendChild(el('span', 'card-summary', d.summary));
    var tags = el('span', 'card-venues');
    inCard.forEach(function (v) { tags.appendChild(el('span', 'tag', v.name)); });
    sum.appendChild(tags);
    var more = el('span', 'card-more');
    more.setAttribute('aria-hidden', 'true');
    sum.appendChild(more);
    card.appendChild(sum);

    var body = el('div', 'card-body');
    var media = buildMedia(d);
    if (media) body.appendChild(media);

    // Markdown: "What you do" first, then the generated sections, then "Skills & training" onward.
    var text = el('div', 'card-text');
    text.innerHTML = marked.parse(p.body);
    var tail = null;
    var skills = Array.prototype.filter.call(text.children, function (n) {
      return n.tagName === 'H2' && /skills/i.test(n.textContent);
    })[0];
    if (skills) {
      tail = el('div', 'card-text');
      var moving = [];
      for (var n = skills; n; n = n.nextSibling) moving.push(n);
      moving.forEach(function (n) { tail.appendChild(n); });
    }
    body.appendChild(text);
    var gear = buildGear(d, inCard);
    if (gear) body.appendChild(gear);
    body.appendChild(buildWeekend(inCard));
    if (tail) body.appendChild(tail);
    body.appendChild(buildLeads(inCard));
    card.appendChild(body);

    cards[card.id] = { el: card, data: d, body: body };
    p.id = card.id;
    return card;
  }

  function renderCards(positions) {
    var groups = {};
    positions.forEach(function (p) {
      var t = p.data.team || '';
      (groups[t] = groups[t] || []).push(p);
    });
    var root = document.getElementById('teams');
    root.textContent = '';
    Object.keys(groups).sort().forEach(function (name) {
      var section = el('section', 'team');
      section.dataset.team = '';
      if (name) section.appendChild(el('h2', null, name));
      var grid = el('div', 'grid');
      groups[name].sort(function (a, b) { return (+a.data.order || 99) - (+b.data.order || 99); })
        .forEach(function (p) { grid.appendChild(buildCard(p)); });
      section.appendChild(grid);
      root.appendChild(section);
    });
  }

  function openCard(id) {
    var c = cards[id];
    if (!c) return;
    if (c.el.hidden) setVenue('all');
    c.el.open = true;
    c.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    c.el.querySelector('summary').focus({ preventScroll: true });
  }

  // ---------- venue filter ----------
  function renderVenues() {
    var nav = document.getElementById('venues');
    nav.appendChild(el('span', 'venues-label', 'Where do you want to serve?'));
    [['all', 'All venues']].concat(venues.map(function (v) { return [slug(v.name), v.name]; }))
      .forEach(function (v) {
        var b = el('button', 'chip', v[1]);
        b.type = 'button';
        b.dataset.venue = v[0];
        b.setAttribute('aria-pressed', 'false');
        nav.appendChild(b);
      });
  }

  function renderVenueInfo(venue) {
    var box = document.getElementById('venue-info');
    var v = venues.filter(function (x) { return slug(x.name) === venue; })[0];
    if (!v) { box.hidden = true; return; }
    box.textContent = v.name + (v.room ? ' meets in the ' + v.room + '.' : '.') +
      (v.minAge ? ' Minimum age to serve: ' + v.minAge + '.' : '');
    box.hidden = false;
  }

  function setupFilter() {
    var chips = document.querySelectorAll('.chip');
    var cardEls = document.querySelectorAll('.card');
    var teams = document.querySelectorAll('[data-team]');
    var scoped = document.querySelectorAll('.card [data-scope]');

    setVenue = function (venue) {
      cardEls.forEach(function (c) {
        c.hidden = venue !== 'all' && c.dataset.venues.split(' ').indexOf(venue) === -1;
      });
      scoped.forEach(function (e) {
        e.hidden = venue !== 'all' && e.dataset.scope.split(' ').indexOf(venue) === -1;
      });
      teams.forEach(function (t) { t.hidden = !t.querySelector('.card:not([hidden])'); });
      chips.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.venue === venue)); });
      renderVenueInfo(venue);
      renderContact(venue);
      try {
        var url = venue === 'all' ? location.pathname : '?venue=' + venue;
        history.replaceState(null, '', url + location.hash);
      } catch (e) {}
    };

    chips.forEach(function (b) {
      b.addEventListener('click', function () { setVenue(b.dataset.venue); });
    });

    var q = new URLSearchParams(location.search).get('venue');
    var ok = Array.prototype.some.call(chips, function (b) { return b.dataset.venue === q; });
    setVenue(ok ? q : 'all');
  }

  // ---------- "Find your fit" quiz ----------
  function setupQuiz(positions) {
    var steps = cfg.quiz || [];
    var section = document.getElementById('quiz');
    if (!steps.length) return;
    section.hidden = false;

    var startBtn = document.getElementById('quiz-start');
    var body = document.getElementById('quiz-body');
    var picks = [];

    function focusHeading() {
      var h = body.querySelector('[data-focus]');
      if (h) h.focus({ preventScroll: true });
    }

    function showQuestion(i) {
      body.textContent = '';
      var s = steps[i];
      body.appendChild(el('p', 'quiz-progress', 'Question ' + (i + 1) + ' of ' + steps.length));
      var q = el('h3', 'quiz-question', s.question);
      q.tabIndex = -1;
      q.dataset.focus = '';
      body.appendChild(q);
      var opts = el('div', 'quiz-options');
      s.options.forEach(function (o) {
        var b = el('button', 'option', o.label);
        b.type = 'button';
        b.addEventListener('click', function () {
          picks[i] = o.tags;
          if (i + 1 < steps.length) showQuestion(i + 1); else showResults();
        });
        opts.appendChild(b);
      });
      body.appendChild(opts);
      var nav = el('div', 'quiz-nav');
      if (i > 0) {
        var back = el('button', 'link-btn', 'Back');
        back.type = 'button';
        back.addEventListener('click', function () { showQuestion(i - 1); });
        nav.appendChild(back);
      }
      var close = el('button', 'link-btn', 'Close');
      close.type = 'button';
      close.addEventListener('click', closeQuiz);
      nav.appendChild(close);
      body.appendChild(nav);
      focusHeading();
    }

    function showResults() {
      var wanted = [].concat.apply([], picks);
      var beginner = wanted.indexOf('beginner') !== -1;
      // Only positions in the venue currently picked (all of them if none is), and no
      // experienced-only positions (`level: experienced`) for someone who is brand new.
      var eligible = positions.filter(function (p) {
        return !cards[p.id].el.hidden && !(beginner && p.data.level === 'experienced');
      });
      var scored = eligible.map(function (p, idx) {
        var fit = list(p.data.fit);
        var score = fit.filter(function (t) { return wanted.indexOf(t) !== -1; }).length;
        return { p: p, score: score, share: fit.length ? score / fit.length : 0, idx: idx };
      }).filter(function (r) { return r.score > 0; })
        // more matching tags first; then the more specific position (higher share of its tags); then page order
        .sort(function (a, b) {
          return b.score - a.score || b.share - a.share ||
            (+a.p.data.order || 99) - (+b.p.data.order || 99) || a.idx - b.idx;
        })
        .slice(0, 3);
      var fallback = false;
      if (!scored.length) {
        // Nothing matched: show where to start instead of an empty result.
        fallback = true;
        scored = eligible.slice().sort(function (a, b) { return (+a.data.order || 99) - (+b.data.order || 99); })
          .slice(0, 3).map(function (p) { return { p: p }; });
      }

      body.textContent = '';
      var h = el('h3', 'quiz-question', !scored.length ? "We couldn't narrow it down" : fallback ? "Here are some places to start" : "Here's where you might fit");
      h.tabIndex = -1;
      h.dataset.focus = '';
      body.appendChild(h);
      if (!scored.length) {
        body.appendChild(el('p', null, 'Browse all the positions below, or reach out and we\'ll help you find a spot.'));
      }
      var results = el('div', 'quiz-results');
      scored.forEach(function (r) {
        var d = r.p.data;
        var item = el('div', 'result');
        var info = el('div', 'result-info');
        info.appendChild(el('strong', null, d.title));
        info.appendChild(el('span', null, d.summary));
        item.appendChild(info);
        var go = el('button', 'btn btn-small', 'See position');
        go.type = 'button';
        go.addEventListener('click', function () { openCard(r.p.id); });
        item.appendChild(go);
        results.appendChild(item);
      });
      body.appendChild(results);
      var nav = el('div', 'quiz-nav');
      var again = el('button', 'link-btn', 'Start over');
      again.type = 'button';
      again.addEventListener('click', function () { picks = []; showQuestion(0); });
      nav.appendChild(again);
      var close = el('button', 'link-btn', 'Close');
      close.type = 'button';
      close.addEventListener('click', closeQuiz);
      nav.appendChild(close);
      body.appendChild(nav);
      focusHeading();
    }

    function closeQuiz() {
      body.hidden = true;
      body.textContent = '';
      startBtn.hidden = false;
      startBtn.focus();
    }

    startBtn.addEventListener('click', function () {
      picks = [];
      body.hidden = false;
      startBtn.hidden = true;
      showQuestion(0);
    });
  }

  // ---------- glossary ----------
  function setupGlossary() {
    var g = cfg.glossary || {};
    var terms = Object.keys(g);
    if (!terms.length) return;

    var lookup = {};
    terms.forEach(function (t) { lookup[t.toLowerCase()] = g[t]; });

    // list at the bottom of the page
    var dl = document.getElementById('glossary-list');
    terms.slice().sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; })
      .forEach(function (t) {
        dl.appendChild(el('dt', null, t));
        dl.appendChild(el('dd', null, g[t]));
      });
    document.getElementById('glossary').hidden = false;

    // underline the first mention of each term in every card (once per venue section)
    var alt = terms.slice().sort(function (a, b) { return b.length - a.length; })
      .map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|');
    var re = new RegExp('\\b(' + alt + ')(?:s)?\\b', 'gi');

    Object.keys(cards).forEach(function (id) {
      var root = cards[id].body;
      var used = {};
      var nodes = [];
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        if (node.parentNode.closest('a, button, code')) return;
        var scopeEl = node.parentNode.closest('[data-scope]');
        var scopeKey = scopeEl ? scopeEl.dataset.scope : '';
        var text = node.nodeValue, last = 0, frag = null, m;
        re.lastIndex = 0;
        while ((m = re.exec(text))) {
          var key = m[1].toLowerCase();
          var usedKey = scopeKey + '|' + key;
          if (used[usedKey]) continue;
          used[usedKey] = true;
          frag = frag || document.createDocumentFragment();
          frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          var b = el('button', 'term', m[0]);
          b.type = 'button';
          b.dataset.term = key;
          b.setAttribute('aria-expanded', 'false');
          frag.appendChild(b);
          last = m.index + m[0].length;
        }
        if (frag) {
          frag.appendChild(document.createTextNode(text.slice(last)));
          node.parentNode.replaceChild(frag, node);
        }
      });
    });

    // one shared popover
    var pop = el('div', 'term-pop');
    pop.id = 'term-pop';
    pop.setAttribute('role', 'note');
    pop.hidden = true;
    document.body.appendChild(pop);
    var current = null;

    function hide() {
      pop.hidden = true;
      if (current) current.setAttribute('aria-expanded', 'false');
      current = null;
    }

    function show(btn) {
      if (current) current.setAttribute('aria-expanded', 'false');
      current = btn;
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-describedby', 'term-pop');
      pop.textContent = lookup[btn.dataset.term];
      pop.hidden = false;
      var r = btn.getBoundingClientRect();
      var w = pop.offsetWidth;
      var left = Math.max(12, Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - w - 12));
      pop.style.left = left + 'px';
      pop.style.top = (r.bottom + window.scrollY + 8) + 'px';
    }

    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.term');
      if (btn) { btn === current ? hide() : show(btn); } else { hide(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && current) { var b = current; hide(); b.focus(); }
    });
    window.addEventListener('resize', hide);
  }

  // ---------- call-to-action: sign-up button plus the lead for the chosen venue ----------
  function renderSignup() {
    var signup = document.querySelector('[data-signup]');
    var actions = document.getElementById('cta-actions');
    if (!cfg.signupUrl) return;
    signup.href = cfg.signupUrl;
    signup.textContent = cfg.signupLabel;
    signup.hidden = false;
    var a = el('a', 'btn', cfg.signupLabel);
    a.href = cfg.signupUrl;
    actions.appendChild(a);
  }

  function renderContact(venue) {
    var vs = venue === 'all' ? venues : venues.filter(function (v) { return slug(v.name) === venue; });
    var groups = leadGroups(vs);
    var many = groups.length > 1;
    var who = document.getElementById('cta-contact');
    var actions = document.getElementById('cta-actions');

    Array.prototype.slice.call(actions.querySelectorAll('[data-email]')).forEach(function (n) { n.remove(); });
    if (!groups.length) { who.hidden = true; return; }

    // One lead: say who they are. Several leads: the buttons below name each one, so keep the line short.
    var g0 = groups[0];
    who.textContent = many
      ? "Questions? Reach out to your venue's lead."
      : 'Questions? Reach out to ' + g0.name + ', ' + (g0.role || g0.venues.join(' and ') + ' lead') + '.';
    who.hidden = false;

    groups.forEach(function (g) {
      var subject = (cfg.contactSubject || '') + ' (' + g.venues.join(', ') + ')';
      var b = el('a', 'btn btn-ghost-dark', 'Email ' + g.name + (many ? ' (' + g.venues.join(', ') + ')' : ''));
      b.href = 'mailto:' + g.email + (cfg.contactSubject ? '?subject=' + encodeURIComponent(subject) : '');
      b.dataset.email = '';
      actions.appendChild(b);
    });
  }

  // ---------- go ----------
  renderSignup();
  renderContact('all');
  renderVenues();
  loadPositions().then(function (positions) {
    renderCards(positions);
    setupFilter();
    setupQuiz(positions);
    setupGlossary();
  }).catch(function (err) {
    console.error(err);
    document.getElementById('teams').textContent =
      'Could not load positions. If you opened this file directly, use a local server (e.g. VS Code Live Server).';
  });
})();
