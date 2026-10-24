(function () {
  var cfg = window.SITE_CONFIG;

  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
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

  function loadPositions() {
    return fetch('positions/index.json').then(function (r) {
      if (!r.ok) throw new Error('positions/index.json not found');
      return r.json();
    }).then(function (files) {
      return Promise.all(files.map(function (f) {
        return fetch('positions/' + f).then(function (r) {
          if (!r.ok) { console.warn('Missing position file: ' + f); return null; }
          return r.text();
        }).then(function (t) { return t && parse(t); });
      }));
    }).then(function (list) { return list.filter(Boolean); });
  }

  function buildCard(p) {
    var d = p.data;
    var names = d.venues ? d.venues.split(',').map(function (v) { return v.trim(); }).filter(Boolean) : cfg.venues;
    names.forEach(function (n) {
      if (cfg.venues.indexOf(n) === -1) console.warn('"' + d.title + '": unknown venue "' + n + '"');
    });

    var card = el('details', 'card');
    card.id = slug(d.title || '');
    card.dataset.venues = names.map(slug).join(' ');

    var sum = el('summary');
    sum.appendChild(el('span', 'card-title', d.title));
    sum.appendChild(el('span', 'card-summary', d.summary));
    var tags = el('span', 'card-venues');
    names.forEach(function (n) { tags.appendChild(el('span', 'tag', n)); });
    sum.appendChild(tags);
    var more = el('span', 'card-more');
    more.setAttribute('aria-hidden', 'true');
    sum.appendChild(more);
    card.appendChild(sum);

    var body = el('div', 'card-body');
    body.innerHTML = marked.parse(p.body);
    card.appendChild(body);
    return card;
  }

  function renderTeams(positions) {
    var teams = {};
    positions.forEach(function (p) {
      var t = p.data.team || 'Other';
      (teams[t] = teams[t] || []).push(p);
    });
    var root = document.getElementById('teams');
    root.textContent = '';
    Object.keys(teams).sort().forEach(function (name) {
      var section = el('section', 'team');
      section.dataset.team = '';
      section.appendChild(el('h2', null, name));
      var grid = el('div', 'grid');
      teams[name].sort(function (a, b) { return (+a.data.order || 99) - (+b.data.order || 99); })
        .forEach(function (p) { grid.appendChild(buildCard(p)); });
      section.appendChild(grid);
      root.appendChild(section);
    });
  }

  function renderVenues() {
    var nav = document.getElementById('venues');
    nav.appendChild(el('span', 'venues-label', 'Where do you want to serve?'));
    [['all', 'All venues']].concat(cfg.venues.map(function (v) { return [slug(v), v]; }))
      .forEach(function (v) {
        var b = el('button', 'chip', v[1]);
        b.type = 'button';
        b.dataset.venue = v[0];
        b.setAttribute('aria-pressed', 'false');
        nav.appendChild(b);
      });
  }

  function setupFilter() {
    var chips = document.querySelectorAll('.chip');
    var cards = document.querySelectorAll('.card');
    var teams = document.querySelectorAll('[data-team]');

    function show(venue) {
      cards.forEach(function (c) {
        c.hidden = venue !== 'all' && c.dataset.venues.split(' ').indexOf(venue) === -1;
      });
      teams.forEach(function (t) { t.hidden = !t.querySelector('.card:not([hidden])'); });
      chips.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.venue === venue)); });
    }

    chips.forEach(function (b) {
      b.addEventListener('click', function () {
        show(b.dataset.venue);
        try {
          var url = b.dataset.venue === 'all' ? location.pathname : '?venue=' + b.dataset.venue;
          history.replaceState(null, '', url + location.hash);
        } catch (e) {}
      });
    });

    var q = new URLSearchParams(location.search).get('venue');
    var ok = Array.prototype.some.call(chips, function (b) { return b.dataset.venue === q; });
    show(ok ? q : 'all');
  }

  function renderButtons() {
    var signup = document.querySelector('[data-signup]');
    var actions = document.getElementById('cta-actions');
    if (cfg.signupUrl) {
      signup.href = cfg.signupUrl;
      signup.textContent = cfg.signupLabel;
      signup.hidden = false;
      var a = el('a', 'btn', cfg.signupLabel);
      a.href = cfg.signupUrl;
      actions.appendChild(a);
    }
    if (cfg.contactEmail) {
      var m = el('a', 'btn btn-ghost-dark', 'Email ' + cfg.contactName);
      m.href = 'mailto:' + cfg.contactEmail;
      actions.appendChild(m);
    }
    if (cfg.contactPhone) {
      var t = el('a', 'btn btn-ghost-dark', 'Text ' + cfg.contactName);
      t.href = 'sms:' + cfg.contactPhone;
      actions.appendChild(t);
    }
  }

  renderButtons();
  renderVenues();
  loadPositions().then(function (positions) {
    renderTeams(positions);
    setupFilter();
  }).catch(function (err) {
    console.error(err);
    document.getElementById('teams').textContent =
      'Could not load positions. If you opened this file directly, use a local server (e.g. VS Code Live Server).';
  });
})();
