(function () {
  const CARD_GRADIENTS = [
    { bar: "linear-gradient(90deg,#6366f1,#ec4899)", text: "linear-gradient(90deg,#6366f1,#ec4899)", ring: "rgba(236,72,153,0.35)" },
    { bar: "linear-gradient(90deg,#0ea5e9,#22d3ee)", text: "linear-gradient(90deg,#0ea5e9,#22d3ee)", ring: "rgba(14,165,233,0.35)" },
    { bar: "linear-gradient(90deg,#f59e0b,#ef4444)", text: "linear-gradient(90deg,#f59e0b,#ef4444)", ring: "rgba(239,68,68,0.35)" },
    { bar: "linear-gradient(90deg,#10b981,#06b6d4)", text: "linear-gradient(90deg,#10b981,#06b6d4)", ring: "rgba(16,185,129,0.35)" },
    { bar: "linear-gradient(90deg,#8b5cf6,#3b82f6)", text: "linear-gradient(90deg,#8b5cf6,#3b82f6)", ring: "rgba(139,92,246,0.35)" },
    { bar: "linear-gradient(90deg,#f43f5e,#f97316)", text: "linear-gradient(90deg,#f43f5e,#f97316)", ring: "rgba(244,63,94,0.35)" },
    { bar: "linear-gradient(90deg,#14b8a6,#84cc16)", text: "linear-gradient(90deg,#14b8a6,#84cc16)", ring: "rgba(20,184,166,0.35)" },
    { bar: "linear-gradient(90deg,#d946ef,#6366f1)", text: "linear-gradient(90deg,#d946ef,#6366f1)", ring: "rgba(217,70,239,0.35)" },
    { bar: "linear-gradient(90deg,#0891b2,#7c3aed)", text: "linear-gradient(90deg,#0891b2,#7c3aed)", ring: "rgba(124,58,237,0.35)" },
    { bar: "linear-gradient(90deg,#eab308,#16a34a)", text: "linear-gradient(90deg,#eab308,#16a34a)", ring: "rgba(234,179,8,0.35)" },
  ];

  function gradientFor(key) {
    const s = String(key);
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
    return CARD_GRADIENTS[h % CARD_GRADIENTS.length];
  }

  const TRACKS = ["business", "enterprise", "engineering"];
  const TRACK_STYLE = {
    business: "track-business",
    enterprise: "track-enterprise",
    engineering: "track-engineering",
  };
  const PAGE_SIZES = [12, 24, 48, 96];

  const PROJECTS = window.PROJECTS_DATA || [];
  const TODAY = new Date().toISOString().slice(0, 10);

  const PRIMARY_CATEGORIES = Array.from(new Set(PROJECTS.map(p => p.primaryCategory))).sort();
  const SECONDARY_CATEGORIES = Array.from(new Set(PROJECTS.flatMap(p => p.secondaryCategories || []))).sort();
  const ALL_TAGS = Array.from(new Set([...PRIMARY_CATEGORIES, ...SECONDARY_CATEGORIES])).sort();

  const state = {
    query: "",
    selectedTags: [],
    track: "all",
    view: "card",
    page: 1,
    pageSize: 24,
    open: null,
    _totalPages: 1,
  };

  const icons = {
    sparkles: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M12 3v18"/><path d="M5.6 7.6C5 8.2 5 9.2 5 11v2c0 1.8 0 2.8.6 3.4"/><path d="M18.4 7.6C19 8.2 19 9.2 19 11v2c0 1.8 0 2.8-.6 3.4"/><path d="M8.6 5C8 5.6 8 6.5 8 8v8c0 1.5 0 2.4.6 3"/><path d="M15.4 5C16 5.6 16 6.5 16 8v8c0 1.5 0 2.4-.6 3"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>',
    calendarSm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>',
    tag: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-2.5 w-2.5"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
    tagSm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
    arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    users: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    building2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
    shieldCheck: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    listChecks: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>',
    coins: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',
    leaf: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
    cpu: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
    chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chev h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  };

  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === "class") e.className = attrs[k];
        else if (k === "style" && typeof attrs[k] === "object") Object.assign(e.style, attrs[k]);
        else if (k === "style" && typeof attrs[k] === "string") e.setAttribute("style", attrs[k]);
        else if (k.startsWith("on") && typeof attrs[k] === "function") e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        else if (k === "html") e.innerHTML = attrs[k];
        else if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      const list = Array.isArray(children) ? children : [children];
      for (const c of list) {
        if (c == null || c === false) continue;
        if (typeof c === "string") e.appendChild(document.createTextNode(c));
        else e.appendChild(c);
      }
    }
    return e;
  }

  function badge(text, variant, extraClass) {
    const cls = "badge badge-" + (variant || "outline") + (extraClass ? " " + extraClass : "");
    return el("span", { class: cls }, text);
  }

  function getTokens(query) {
    return query
      .toLowerCase()
      .split(/\s+/)
      .map(t => t.trim())
      .filter(Boolean)
      .map(t => t.split(",").map(s => s.trim()).filter(Boolean));
  }

  function getFiltered() {
    const tokens = getTokens(state.query);
    return PROJECTS.filter(p => {
      if (state.track !== "all" && p.track !== state.track) return false;
      if (state.selectedTags.length) {
        const tags = [p.primaryCategory, ...(p.secondaryCategories || [])];
        if (!state.selectedTags.every(t => tags.includes(t))) return false;
      }
      if (!tokens.length) return true;
      const blob = [
        p.name, p.shortDescription, p.primaryCategory, p.track,
        ...(p.secondaryCategories || []),
        ...(p.features || []),
        ...(p.requirements?.stakeholders || []),
        ...(p.requirements?.endUsers || []),
        ...(p.requirements?.operational || []),
        ...(p.requirements?.regulatory || []),
        p.impact?.social || "", p.impact?.economic || "",
        p.impact?.environmental || "", p.impact?.technological || "",
      ].join(" ").toLowerCase();
      return tokens.every(alts => alts.some(a => blob.includes(a)));
    });
  }

  function renderTrackButtons() {
    const container = document.getElementById("track-buttons");
    container.innerHTML = "";
    const items = ["all", ...TRACKS];
    items.forEach(t => {
      const active = state.track === t;
      const btn = el("button", {
        class: "track-btn" + (active ? " track-btn-active" : ""),
        "data-track": t,
      }, t);
      container.appendChild(btn);
    });
  }

  function renderAllTags() {
    const container = document.getElementById("all-tags-list");
    container.innerHTML = "";
    ALL_TAGS.forEach(t => {
      const active = state.selectedTags.includes(t);
      const btn = el("button", {
        class: "tag-btn" + (active ? " active" : ""),
        "data-tag-toggle": t,
      }, t);
      container.appendChild(btn);
    });
  }

  function renderActiveTags() {
    const container = document.getElementById("active-tags");
    const countEl = document.getElementById("tags-count");
    container.innerHTML = "";
    if (state.selectedTags.length === 0) {
      container.classList.add("hidden");
      countEl.classList.add("hidden");
      return;
    }
    container.classList.remove("hidden");
    countEl.classList.remove("hidden");
    countEl.textContent = state.selectedTags.length;
    state.selectedTags.forEach(t => {
      const btn = el("button", {
        class: "active-tag",
        "data-active-tag": t,
      }, [t, el("span", { html: icons.close })]);
      container.appendChild(btn);
    });
  }

  function toggleTag(t) {
    state.page = 1;
    const i = state.selectedTags.indexOf(t);
    if (i >= 0) state.selectedTags.splice(i, 1);
    else state.selectedTags.push(t);
    renderAllTags();
    renderActiveTags();
    renderClearAll();
    renderResults();
  }

  function renderClearAll() {
    const hasFilter = state.selectedTags.length > 0 || state.query || state.track !== "all";
    const el1 = document.getElementById("clear-all");
    const el2 = document.getElementById("clear-empty");
    if (hasFilter) {
      el1.classList.remove("hidden");
    } else {
      el1.classList.add("hidden");
    }
  }

  function clearAll() {
    state.query = "";
    state.selectedTags = [];
    state.track = "all";
    state.page = 1;
    const inp = document.getElementById("search-input");
    if (inp) inp.value = "";
    const clearBtn = document.getElementById("search-clear");
    if (clearBtn) clearBtn.classList.add("hidden");
    renderTrackButtons();
    renderAllTags();
    renderActiveTags();
    renderClearAll();
    renderResults();
  }

  function renderPager(pagerId, page, totalPages) {
    const container = document.getElementById(pagerId);
    container.innerHTML = "";
    if (totalPages <= 1) return;
    const around = 1;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= around) pages.push(i);
      else if (pages[pages.length - 1] !== "…") pages.push("…");
    }
    const prev = el("button", {
      class: "pager-btn",
      "data-pager-action": "prev",
      disabled: page <= 1,
    }, "Prev");
    container.appendChild(prev);

    pages.forEach((pageNum, i) => {
      if (pageNum === "…") {
        container.appendChild(el("span", { class: "pager-ellipsis" }, "…"));
      } else {
        const active = pageNum === page;
        container.appendChild(el("button", {
          class: "pager-btn" + (active ? " pager-btn-active" : ""),
          "data-pager-action": "goto",
          "data-page-number": String(pageNum),
        }, String(pageNum)));
      }
    });

    const next = el("button", {
      class: "pager-btn",
      "data-pager-action": "next",
      disabled: page >= totalPages,
    }, "Next");
    container.appendChild(next);
  }

  function renderProjectCard(p) {
    const g = gradientFor(p.id || p.name);
    const trackClass = TRACK_STYLE[p.track] || "";

    const secTags = [];
    (p.secondaryCategories || []).slice(0, 4).forEach(s => {
      secTags.push(el("span", { class: "tag-secondary", "data-tag": s }, [
        el("span", { html: icons.tag }),
        s,
      ]));
    });

    const featuresCount = p.features?.length || 0;
    const stakeholdersCount = p.requirements?.stakeholders?.length || 0;

    const viewBtn = el("button", {
      class: "card-btn-inner group",
      style: { backgroundImage: g.bar },
      onclick: (e) => { e.stopPropagation(); openProject(p); },
    }, ["View details", el("span", { html: icons.arrowRight })]);

    const dateEl = el("div", { class: "card-date" }, [
      el("span", { html: icons.calendar }),
      p.dateAdded || TODAY,
    ]);

    const card = el("div", {
      class: "card card-surface hover-lift",
      style: {
        borderColor: "transparent",
        backgroundImage: `linear-gradient(var(--card),var(--card)), ${g.bar}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        boxShadow: `0 8px 30px -12px ${g.ring}`,
      },
      onclick: () => openProject(p),
    }, [
      el("div", { class: "card-top-bar", style: { background: g.bar } }),
      el("div", { class: "flex items-start justify-between gap-3 mb-3" }, [
        el("div", { class: "min-w-0 flex-1" }, [
          el("h3", {
            class: "font-semibold tracking-tight text-lg",
            style: {
              backgroundImage: g.text,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            },
          }, p.name),
          el("div", { class: "mt-1.5 flex flex-wrap gap-1.5" }, [
            badge(p.track, "outline", trackClass),
            badge(p.primaryCategory, "secondary", "capitalize"),
          ]),
        ]),
        dateEl,
      ]),
      el("p", { class: "card-desc line-clamp-3" }, p.shortDescription),
      secTags.length ? el("div", { class: "flex flex-wrap gap-1" }, secTags) : null,
      el("div", { class: "card-meta" }, [
        el("span", { html: icons.sparkles }),
        `${featuresCount} features · ${stakeholdersCount} stakeholders`,
      ]),
      el("div", { class: "card-btn" }, viewBtn),
    ]);
    return card;
  }

  function renderTableRow(p) {
    const g = gradientFor(p.id || p.name);
    const trackClass = TRACK_STYLE[p.track] || "";

    const secTags = [];
    (p.secondaryCategories || []).slice(0, 3).forEach(s => {
      secTags.push(el("span", { class: "tag-secondary" }, s));
    });
    const remaining = (p.secondaryCategories?.length || 0) - 3;
    if (remaining > 0) {
      secTags.push(el("span", { style: { fontSize: "10px", color: "var(--muted-foreground)" } }, `+${remaining}`));
    }

    const titleEl = el("div", {
      class: "table-title",
      style: {
        backgroundImage: g.text,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      },
    }, p.name);

    const bar = el("span", { class: "table-row-bar", style: { background: g.bar } });

    const viewBtn = el("button", {
      class: "table-btn",
      style: { backgroundImage: g.bar },
      onclick: (e) => { e.stopPropagation(); openProject(p); },
    }, [el("span", { html: icons.eye }), " View"]);

    const featuresCount = p.features?.length || 0;
    const stakeholdersCount = p.requirements?.stakeholders?.length || 0;

    return el("tr", {
      onclick: () => openProject(p),
    }, [
      el("td", null, el("div", { class: "flex gap-3" }, [
        bar,
        el("div", { class: "min-w-0" }, [
          titleEl,
          el("div", { class: "table-desc" }, p.shortDescription),
        ]),
      ])),
      el("td", null, badge(p.track, "outline", trackClass + " capitalize")),
      el("td", { class: "capitalize text-sm" }, p.primaryCategory),
      el("td", { class: "hidden lg:table-cell" }, el("div", { class: "flex flex-wrap gap-1" }, secTags)),
      el("td", { class: "text-center hidden md:table-cell tabular-nums text-sm" }, String(featuresCount)),
      el("td", { class: "text-center hidden md:table-cell tabular-nums text-sm" }, String(stakeholdersCount)),
      el("td", { class: "text-right" }, viewBtn),
    ]);
  }

  function renderResults() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    state._totalPages = totalPages;
    const safePage = Math.min(state.page, totalPages);
    const slice = filtered.slice((safePage - 1) * state.pageSize, safePage * state.pageSize);

    const empty = document.getElementById("empty-state");
    const cardView = document.getElementById("card-view");
    const tableView = document.getElementById("table-view");

    if (filtered.length === 0) {
      empty.classList.remove("hidden");
      cardView.classList.add("hidden");
      tableView.classList.add("hidden");
      return;
    } else {
      empty.classList.add("hidden");
    }

    if (state.view === "card") {
      cardView.classList.remove("hidden");
      tableView.classList.add("hidden");
      const grid = document.getElementById("cards-grid");
      grid.innerHTML = "";
      slice.forEach(p => grid.appendChild(renderProjectCard(p)));
      renderPager("pager-card", safePage, totalPages);
    } else {
      cardView.classList.add("hidden");
      tableView.classList.remove("hidden");
      const tbody = document.getElementById("table-body");
      tbody.innerHTML = "";
      slice.forEach(p => tbody.appendChild(renderTableRow(p)));
      renderPager("pager-table", safePage, totalPages);
    }
  }

  function renderViewTabs() {
    document.querySelectorAll(".view-tab").forEach(tab => {
      const v = tab.getAttribute("data-view");
      if (v === state.view) tab.classList.add("view-tab-active");
      else tab.classList.remove("view-tab-active");
    });
  }

  function openProject(p) {
    state.open = p;
    const dialog = document.getElementById("dialog");
    const overlay = document.getElementById("dialog-overlay");
    renderProjectDetails(p);
    dialog.classList.remove("hidden");
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeProject() {
    state.open = null;
    const dialog = document.getElementById("dialog");
    const overlay = document.getElementById("dialog-overlay");
    dialog.classList.add("hidden");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function renderReqItem(id, icon, title, items) {
    if (!items || !items.length) return null;
    const item = el("div", { class: "accordion-item", "data-acc-id": id }, [
      el("button", {
        class: "accordion-trigger" + (id === "stakeholders" || id === "endUsers" ? " open" : ""),
        "data-acc-trigger": id,
        onclick: () => toggleAccordion(id),
      }, [
        el("span", { class: "flex items-center gap-2 text-sm font-semibold" }, [
          el("span", { html: icon }),
          title,
          el("span", { class: "badge badge-secondary ml-2" }, String(items.length)),
        ]),
        el("span", { html: icons.chevronDown }),
      ]),
      el("div", {
        class: "accordion-content" + (id === "stakeholders" || id === "endUsers" ? " open" : ""),
        "data-acc-content": id,
      }, el("div", { class: "accordion-content-inner" }, el("ul", { class: "accordion-list" },
        items.map(it => el("li", null, it))
      ))),
    ]);
    return item;
  }

  function toggleAccordion(id) {
    const trigger = document.querySelector(`[data-acc-trigger="${id}"]`);
    const content = document.querySelector(`[data-acc-content="${id}"]`);
    if (!trigger || !content) return;
    trigger.classList.toggle("open");
    content.classList.toggle("open");
  }

  function renderProjectDetails(p) {
    const g = gradientFor(p.id || p.name);
    const trackClass = TRACK_STYLE[p.track] || "";
    const container = document.getElementById("dialog-content");
    container.innerHTML = "";

    const impactIcons = {
      social: icons.heart,
      economic: icons.coins,
      environmental: icons.leaf,
      technological: icons.cpu,
    };

    const impacts = [];
    ["social", "economic", "environmental", "technological"].forEach(k => {
      const text = p.impact?.[k];
      if (!text) return;
      impacts.push(el("div", { class: "impact-card" }, [
        el("div", { class: "flex items-center gap-2 text-xs font-semibold capitalize text-foreground/80 mb-1.5" }, [
          el("span", { class: "text-primary", html: impactIcons[k] }),
          " " + k,
        ]),
        el("div", { class: "text-sm text-muted-foreground leading-snug" }, text),
      ]));
    });

    const features = (p.features || []).map((f, i) => {
      const num = el("span", {
        class: "detail-feature-num",
        style: { backgroundImage: g.bar, animationDelay: `${i * 40}ms` },
      }, String(i + 1));
      return el("li", {
        class: "detail-feature-item",
        style: { animationDelay: `${i * 40}ms` },
      }, [num, el("span", { class: "text-sm leading-snug" }, f)]);
    });

    const footerTags = [];
    if ((p.secondaryCategories || []).length) {
      footerTags.push(el("span", { class: "text-xs text-muted-foreground flex items-center gap-1 mr-1" }, [
        el("span", { html: icons.tagSm }),
        " Tags:",
      ]));
      [p.primaryCategory, ...(p.secondaryCategories || [])].forEach(t => {
        footerTags.push(badge(t, "outline", "capitalize text-[10px]"));
      });
      footerTags.push(badge(p.track, "outline", trackClass + " capitalize text-[10px]"));
    }

    const headerTags = [];
    headerTags.push(badge(p.track, null, "bg-white/20 text-white border-white/30 capitalize"));
    headerTags.push(badge(p.primaryCategory, null, "bg-white/20 text-white border-white/30 capitalize"));
    (p.secondaryCategories || []).forEach(s => {
      headerTags.push(badge(s, null, "bg-white/10 text-white border-white/20 capitalize"));
    });

    const content = el("div", { class: "space-y-6" }, [
      el("div", { class: "detail-header", style: { backgroundImage: g.bar } }, [
        el("div", { class: "detail-header-blob" }),
        el("h2", { class: "text-3xl font-bold tracking-tight" }, p.name),
        el("div", { class: "mt-3 flex flex-wrap gap-1.5" }, headerTags),
        el("p", { class: "mt-4 text-white/90 leading-relaxed text-[15px]" }, p.shortDescription),
        el("div", { class: "mt-3 text-[11px] text-white/70 flex items-center gap-1" }, [
          el("span", { html: icons.calendar }),
          " Added " + (p.dateAdded || TODAY),
        ]),
      ]),
      el("section", { class: "detail-section" }, [
        el("h3", { class: "feature-title" }, [
          el("span", { class: "text-primary", html: icons.sparkles }),
          " Differentiating Features",
          el("span", { class: "badge badge-secondary ml-auto" }, String(p.features.length)),
        ]),
        el("ol", { class: "space-y-2" }, features),
      ]),
      el("section", null, el("div", { class: "accordion-space" }, [
        renderReqItem("stakeholders", icons.building2, "Stakeholders", p.requirements?.stakeholders),
        renderReqItem("endUsers", icons.users, "End Users", p.requirements?.endUsers),
        renderReqItem("operational", icons.listChecks, "Operational Requirements", p.requirements?.operational),
        renderReqItem("regulatory", icons.shieldCheck, "Regulatory Requirements", p.requirements?.regulatory),
      ].filter(Boolean))),
      el("section", null, [
        el("h3", { class: "text-sm font-semibold mb-3 flex items-center gap-2" }, [
          el("span", { class: "text-primary", html: icons.heart }),
          " Impact",
        ]),
        el("div", { class: "impact-grid" }, impacts),
      ]),
      footerTags.length ? el("div", { class: "detail-footer" }, footerTags) : null,
    ]);

    container.appendChild(content);
  }

  function startRotatingBackdrop() {
    const slides = document.querySelectorAll(".slide-bg");
    let i = 0;
    slides.forEach((s, idx) => {
      if (idx === 0) s.classList.add("active");
    });
    setInterval(() => {
      slides.forEach(s => s.classList.remove("active"));
      i = (i + 1) % slides.length;
      slides[i].classList.add("active");
    }, 5500);
  }

  function setupSearch() {
    const input = document.getElementById("search-input");
    const clearBtn = document.getElementById("search-clear");
    input.addEventListener("input", e => {
      state.query = e.target.value;
      state.page = 1;
      clearBtn.classList.toggle("hidden", !state.query);
      renderClearAll();
      renderResults();
    });
    clearBtn.addEventListener("click", () => {
      state.query = "";
      state.page = 1;
      input.value = "";
      clearBtn.classList.add("hidden");
      renderClearAll();
      renderResults();
    });
    document.querySelectorAll(".quick-search").forEach(b => {
      b.addEventListener("click", () => {
        const q = b.getAttribute("data-quick");
        state.query = q;
        state.page = 1;
        input.value = q;
        clearBtn.classList.remove("hidden");
        renderClearAll();
        renderResults();
        document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function setupTagsPopover() {
    const toggle = document.getElementById("tags-toggle");
    const popover = document.getElementById("tags-popover");
    toggle.addEventListener("click", e => {
      e.stopPropagation();
      popover.classList.toggle("hidden");
    });
    document.addEventListener("click", e => {
      if (!popover.contains(e.target) && !toggle.contains(e.target)) {
        popover.classList.add("hidden");
      }
    });
  }

  function setupViewTabs() {
    document.querySelectorAll(".view-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        state.view = tab.getAttribute("data-view");
        renderViewTabs();
        renderResults();
      });
    });
  }

  function setupPageSize() {
    const sel = document.getElementById("page-size");
    sel.addEventListener("change", () => {
      state.pageSize = Number(sel.value);
      state.page = 1;
      renderResults();
    });
  }

  function setupDialog() {
    const overlay = document.getElementById("dialog-overlay");
    const closeBtn = document.getElementById("dialog-close");
    overlay.addEventListener("click", closeProject);
    closeBtn.addEventListener("click", closeProject);
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && state.open) closeProject();
    });
  }

  function setupClearButtons() {
    document.getElementById("clear-all").addEventListener("click", clearAll);
    document.getElementById("clear-empty").addEventListener("click", clearAll);
  }

  function setupDelegatedEvents() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;

      const pagerAction = btn.getAttribute("data-pager-action");
      if (pagerAction) {
        e.preventDefault();
        if (btn.hasAttribute("disabled")) return;
        if (pagerAction === "prev") {
          state.page = Math.max(1, state.page - 1);
        } else if (pagerAction === "next") {
          state.page = Math.min(state._totalPages, state.page + 1);
        } else if (pagerAction === "goto") {
          const n = parseInt(btn.getAttribute("data-page-number"), 10);
          if (!isNaN(n)) state.page = Math.min(Math.max(1, n), state._totalPages);
        }
        renderResults();
        document.getElementById("explore").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const track = btn.getAttribute("data-track");
      if (track) {
        state.track = track;
        state.page = 1;
        renderAll();
        return;
      }

      const tagToggle = btn.getAttribute("data-tag-toggle");
      if (tagToggle) {
        toggleTag(tagToggle);
        return;
      }

      const activeTagRemove = btn.getAttribute("data-active-tag");
      if (activeTagRemove) {
        toggleTag(activeTagRemove);
        return;
      }

      const view = btn.getAttribute("data-view");
      if (view) {
        state.view = view;
        renderViewTabs();
        renderResults();
        return;
      }

      const projectId = btn.getAttribute("data-project-id");
      if (projectId !== null) {
        const p = PROJECTS.find(x => x.id === projectId);
        if (p) openProject(p);
        return;
      }
    });
  }

  function renderAll() {
    renderTrackButtons();
    renderAllTags();
    renderActiveTags();
    renderClearAll();
    renderViewTabs();
    renderResults();
  }

  function init() {
    setupDelegatedEvents();
    setupSearch();
    setupTagsPopover();
    setupViewTabs();
    setupPageSize();
    setupDialog();
    setupClearButtons();
    startRotatingBackdrop();
    renderAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
