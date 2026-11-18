/* Eli's Yummy Kitchen — framework-free frontend, based on the supplied Figma exports. */
(() => {
  "use strict";
  const cfg = window.KITCHEN,
    STORE = "elis-yummy-kitchen-v1";
  const clone = (x) => JSON.parse(JSON.stringify(x));
  let state;
  try {
    state = JSON.parse(localStorage.getItem(STORE)) || clone(cfg.seed);
  } catch {
    state = clone(cfg.seed);
  }
  let current = "login",
    lastPage = "overview",
    selectedProduct = "PRD-001",
    selectedDispatch = "DSP-0087",
    selectedAccount = "ACC-005",
    dialogFrom = null;
  const $ = (s) => document.querySelector(s),
    esc = (s) =>
      String(s ?? "").replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );
  const money = (n) =>
    "₱" +
    Number(n || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const wholeMoney = (n) => "₱" + Number(n || 0).toLocaleString("en-PH");
  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify(state));
    } catch {
      toast("Browser storage is unavailable; changes last for this session.");
    }
  };
  const log = (type, detail) => {
    state.activity.push({ time: new Date().toISOString(), type, detail });
    save();
  };
  const product = (id) =>
    state.products.find((p) => p.id === id) || state.products[0];
  const material = (id) =>
    state.materials.find((p) => p.id === id) || state.materials[0];
  const dispatch = () =>
    state.dispatches.find((d) => d.id === selectedDispatch) ||
    state.dispatches[0];
  const paths = {
    chef: "M7 13a5 5 0 0 1-1-9 6 6 0 0 1 12 0 5 5 0 0 1-1 9v8H7z M7 17h10",
    grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
    sales: "M2 3h3l3 12h11l3-8H6 M9 20h.01 M18 20h.01",
    box: "M3 7l9-5 9 5v10l-9 5-9-5z M3 7l9 5 9-5 M12 12v10 M7.5 4.5l9 5",
    truck:
      "M2 4h12v13H2z M14 9h4l4 4v4h-8 M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4 M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
    leaf: "M20 3C7 2 2 8 4 15c3 8 18 4 16-12z M4 21L16 8",
    alert: "M12 3L2 21h20z M12 9v5 M12 18h.01",
    chart: "M3 3v18h18 M7 17V9 M12 17V5 M17 17v-7",
    users:
      "M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3 M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 21v-3a4 4 0 0 0-3-3.87 M16 2a4 4 0 0 1 0 8",
    bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
    arrow: "M5 12h14 M13 6l6 6-6 6",
    check: "M4 12l5 5L20 6",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7v5l3 2",
    menu: "M3 6h18 M3 12h18 M3 18h18",
    close: "M6 6l12 12 M18 6L6 18",
    download: "M12 3v12 M6 9l6 6 6-6 M3 17v4h18v-4",
  };
  function icon(name = "arrow") {
    return `<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${paths[name] || paths.arrow}"/></svg></span>`;
  }
  function btn(label, to, kind = "", action = "") {
    return `<button type="button" class="btn ${kind}" ${to ? `data-go="${to}"` : ""} ${action ? `data-action="${action}"` : ""}>${icon(kind === "destructive" ? "alert" : "arrow")}${esc(label)}</button>`;
  }
  function submit(label, kind = "") {
    return `<button type="submit" class="btn ${kind}">${icon()}${esc(label)}</button>`;
  }
  const actions = (items, distribute = false) =>
    `<div class="actions ${distribute ? "distribute" : ""}">${items.map((x) => (distribute ? `<div>${x}</div>` : x)).join("")}</div>`;
  const row = (...items) => `<div class="row">${items.join("")}</div>`;
  const stack = (...items) => `<div class="stack">${items.join("")}</div>`;
  const card = (title, body, cls = "") =>
    `<section class="card ${cls}">${title ? `<h2>${esc(title)}</h2>` : ""}${body}</section>`;
  function badge(text, type = "") {
    return `<span class="badge ${type}">${esc(text)}</span>`;
  }
  function notice(text, type = "") {
    return `<div class="notice ${type}">${icon(type ? "alert" : "check")}<span>${esc(text)}</span></div>`;
  }
  function metric(label, value, foot, ico = "box", color = "") {
    return `<section class="card metric"><div class="metric-head"><span>${esc(label)}</span>${icon(ico)}</div><p class="metric-value ${color}">${esc(value)}</p><p class="metric-foot ${color}">${esc(foot)}</p></section>`;
  }
  const metrics = (items) =>
    `<div class="metrics" style="--cols:${items.length}">${items.join("")}</div>`;
  function progress(title, value, total, caption, complete = false, unit = "") {
    let pct = Math.min(100, Math.round((Number(value) / Number(total)) * 100));
    return `<section class="card progress-card ${complete ? "complete" : ""}"><p class="progress-label">${esc(title)}</p><p class="progress-value">${esc(value)} / ${esc(total)}${unit ? " " + esc(unit) : ""}</p>${badge((complete ? "✓ Complete" : "In progress") + " · " + pct + "%", "")}<div class="progress-track" role="progressbar" aria-label="${esc(title)}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div><p class="progress-caption">${esc(caption)}</p></section>`;
  }
  function table(headers, rows, targets = []) {
    return `<div class="table-wrap"><table><thead><tr>${headers.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((r, i) => `<tr ${targets[i] ? `class="clickable" data-go="${targets[i]}" tabindex="0" aria-label="Open ${esc(String(r[0]).replace(/<[^>]*>/g, ""))}"` : ""}>${r.map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}" class="empty">No records match this view.</td></tr>`}</tbody></table></div>`;
  }
  function field(
    label,
    name,
    value = "",
    type = "text",
    opts = null,
    wide = false,
  ) {
    const id = "f-" + name;
    return `<div class="field ${wide ? "wide" : ""}"><label for="${id}">${esc(label)}</label>${
      type === "select"
        ? `<select id="${id}" name="${name}" required>${(opts || [])
            .map((o) => {
              const v = Array.isArray(o) ? o[0] : o,
                t = Array.isArray(o) ? o[1] : o;
              return `<option value="${esc(v)}" ${String(v) === String(value) ? "selected" : ""}>${esc(t)}</option>`;
            })
            .join("")}</select>`
        : type === "textarea"
          ? `<textarea id="${id}" name="${name}" required>${esc(value)}</textarea>`
          : `<input id="${id}" name="${name}" type="${type}" value="${esc(value)}" ${type === "number" ? 'min="0" step="any"' : ""} ${type === "password" ? 'minlength="6" autocomplete="new-password"' : type === "date" ? "" : `autocomplete="off"`} required>`
    }</div>`;
  }
  const fields = (items, three = false) =>
    `<div class="form-grid ${three ? "three" : ""}">${items.join("")}</div>`;
  const form = (name, body) =>
    `<form data-form="${name}" class="form-stack">${body}</form>`;
  const productOptions = () =>
    state.products.map((p) => [p.id, p.name + " · " + p.id]);
  const materialOptions = () =>
    state.materials.map((p) => [p.id, p.name + " · " + p.id]);
  const branches = ["Main hub", "Main Street", "Market Road", "Town Center"];
  const roles = [
    "Sales Staff",
    "Production Head",
    "Production Staff",
    "Inventory Staff",
    "Dispatch Staff",
    "Supply Tracking Staff",
    "Business Owner",
  ];
  function status(s) {
    return badge(
      (/Received|Synced|Matched|Healthy|Active|Resolved|Signed|Allowed|Complete/.test(
        s,
      )
        ? "✓ "
        : "! ") + s,
      /pending|transit|needed|Denied|Open|Awaiting|review|Restricted/i.test(s)
        ? "warning"
        : /Flag|alert|Low|Missing/i.test(s)
          ? "red"
          : "",
    );
  }
  function brand() {
    return `<div class="brand">${icon("chef")}<span>Eli’s Yummy Kitchen</span></div>`;
  }
  function group(route) {
    if (
      [
        "sales",
        "record-sale",
        "offline",
        "summary",
        "count",
        "closing",
      ].includes(route)
    )
      return "sales";
    if (
      [
        "inventory",
        "product",
        "product-edit",
        "production",
        "stock-in",
        "next-opening",
      ].includes(route)
    )
      return "inventory";
    if (
      [
        "dispatches",
        "dispatch-new",
        "dispatch-detail",
        "receive",
        "delivery-review",
      ].includes(route)
    )
      return "dispatches";
    if (
      [
        "supplies",
        "supply-new",
        "supply-stock",
        "usage",
        "alerts",
        "supply-opening",
      ].includes(route)
    )
      return "supplies";
    if (["discrepancies", "review"].includes(route)) return "discrepancies";
    if (["audits", "audit-detail", "audit-ready"].includes(route))
      return "audits";
    if (["accounts", "account-new", "permissions"].includes(route))
      return "accounts";
    if (route.includes("report")) return "reports";
    return "overview";
  }
  function roleFor(route) {
    if (group(route) === "sales") return "Sales Staff";
    if (["production", "usage", "supply-opening"].includes(route))
      return "Production Staff";
    if (group(route) === "supplies") return "Supply Tracking Staff";
    if (group(route) === "inventory") return "Production Head";
    return state.user.role;
  }
  function shell(route, body) {
    const s = cfg.screens[route],
      active = group(route);
    return `<aside class="sidebar" aria-label="Workspace navigation">${brand()}<p class="eyebrow">WORKSPACE</p><nav>${cfg.nav.map(([r, l, i]) => `<a href="#${r}" ${r === active ? 'class="active" aria-current="page"' : ""}>${icon(i)}<span>${esc(l)}</span></a>`).join("")}</nav><div class="sidebar-space"></div><div class="workspace-note"><span class="eyebrow">CONNECTED WORKSPACE</span>One workspace.<br>Every detail, in sync.</div><button type="button" class="inline-link user-name" data-go="shift" title="Choose workspace">${esc(state.user.name)}</button><span class="user-role">${esc(roleFor(route))}</span></aside><main class="main"><header class="topbar"><button class="mobile-menu" aria-label="Open navigation" data-action="menu">${icon("menu")}</button><p class="breadcrumb">${esc(s[2])} &nbsp; / &nbsp; ${esc(s[0])}</p>${badge(state.user.name + " · Owner")}<button class="bell" aria-label="View stock alerts" data-go="alerts">${icon("bell")}</button></header><div class="content"><div class="heading"><h1>${esc(s[0])}</h1>${s[1] ? `<p class="muted">${esc(s[1])}</p>` : ""}</div>${body}</div></main>`;
  }
  function productTable() {
    return table(
      [
        "Product / batch",
        "Location",
        "Qty",
        "Best before",
        "Threshold",
        "Status",
      ],
      state.products.map((p) => [
        esc(p.name) + " · " + esc(p.batch),
        esc(p.location),
        p.quantity,
        esc(formatDate(p.bestBefore)),
        p.threshold,
        status(p.quantity < p.threshold ? "Low stock" : "Healthy"),
      ]),
      state.products.map((p) => "product?item=" + p.id),
    );
  }
  function dispatchTable() {
    return table(
      ["Dispatch", "Branch", "Batch", "Qty", "Status"],
      state.dispatches.map((d) => [
        esc(d.id),
        esc(d.branch),
        esc(d.batch),
        d.quantity,
        status(d.status),
      ]),
      state.dispatches.map((d) => "dispatch-detail?item=" + d.id),
    );
  }
  function materialTable() {
    return table(
      ["Material", "On hand", "Unit", "Unit cost", "Threshold", "Status"],
      state.materials.map((m) => [
        esc(m.name),
        m.onHand,
        esc(m.unit),
        money(m.cost),
        m.threshold,
        status(m.onHand < m.threshold ? "Low stock" : "Healthy"),
      ]),
    );
  }
  function salesTable() {
    return table(
      ["Time", "Product", "Qty", "Line total", "Status"],
      state.sales
        .slice()
        .reverse()
        .slice(0, 8)
        .map((s) => [
          esc(s.time),
          esc(product(s.product).name),
          s.quantity,
          money(s.total),
          status(s.status),
        ]),
    );
  }
  function flagsTable() {
    return table(
      ["Discrepancy", "Type", "Expected", "Actual", "Variance", "Status"],
      state.discrepancies.map((d) => [
        esc(d.id),
        esc(d.type),
        d.expected,
        d.actual,
        `<span class="danger">${d.variance}</span>`,
        status(d.status),
      ]),
      state.discrepancies.map((d) =>
        d.id === "DISC-001" ? "review" : "delivery-review",
      ),
    );
  }
  function chart() {
    const vals = [9200, 11400, 10100, 13200, 14800, 16900, 14545];
    return `<div class="chart" role="img" aria-label="Weekly sales: Monday 9,200 pesos, Tuesday 11,400, Wednesday 10,100, Thursday 13,200, Friday 14,800, Saturday 16,900, Sunday 14,545">${vals.map((v, i) => `<div class="chart-col"><span class="chart-value">₱${v}</span><div class="bar" style="height:${(v / 16900) * 112}px"></div><span>${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</span></div>`).join("")}</div>`;
  }
  function closingTable() {
    return table(
      ["Product", "Expected", "Physical", "Variance", "Result"],
      state.products.map((p, i) => {
        const physical = Object.values(state.counts)[i] ?? p.branchQty,
          variance = physical - p.branchQty;
        return [
          esc(p.name),
          p.branchQty,
          physical,
          `<span class="${variance ? "danger" : "green"}">${variance > 0 ? "+" : ""}${variance}</span>`,
          status(variance ? "Flagged" : "Matched"),
        ];
      }),
    );
  }
  function auditTable(ready = false) {
    return table(
      ["Branch", "Confirmed days", "Sales", "Stock status", "Flags"],
      [
        [
          "Main Street",
          ready ? "7 / 7" : "6 / 7",
          money(34230),
          status(ready ? "Reconciled" : "Recount required"),
          ready ? 0 : 1,
        ],
        ["Market Road", "7 / 7", money(28135), status("Matched"), 0],
        [
          "Town Center",
          ready ? "7 / 7" : "6 / 7",
          money(27780),
          status(ready ? "Reconciled" : "Receipt review"),
          ready ? 0 : 1,
        ],
      ],
    );
  }
  function formatDate(d) {
    return new Date(d + "T12:00:00").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  const screens = {};
  screens.login = () =>
    `<div class="auth">${brand()}<p class="eyebrow">YOUR WORKSPACE, BEAUTIFULLY CONNECTED</p><div class="heading"><h1>Welcome back.</h1><p class="muted">Your kitchen, together in one place.</p></div>${row(card("Sign in to your workspace", form("login", stack(field("Username", "username", state.user.username), field("Password", "password", "", "password"), submit("Sign in to dashboard"), "<p>Sign in with your staff account.</p>", btn("Choose branch, role or shift", "shift", "ghost")))), card("Good food starts with good operations.", badge("ELI’S YUMMY KITCHEN") + "<p>Track every batch, every branch, and every sale in one thoughtfully organized workspace.</p>" + metrics([metric("Branches", "3", "Connected to the main hub", "box"), metric("Today’s focus", "Fresh", "Prepared with care", "leaf")]) + notice("From production to weekly sign-off, keep the whole kitchen in view.")))}</div>`;
  screens.shift = () =>
    `<div class="auth">${brand()}<p class="eyebrow">YOUR WORKSPACE, BEAUTIFULLY CONNECTED</p><div class="heading"><h1>Choose your workspace</h1><p class="muted">Choose the workspace that matches your role and shift.</p></div>${row(card("Sales staff", form("workspace-sales", stack(field("Branch", "branch", "Main Street", "select", branches.slice(1)), field("Shift", "shift", "Opening shift", "select", ["Opening shift", "Closing shift"]), submit("Open sales workspace")))), card("Production & product", form("workspace-production", stack(field("Location", "branch", "Main hub", "select", branches), field("Role", "role", "Production Head", "select", roles.slice(1)), actions([submit("Open product"), btn("Dispatch workspace", "dispatches", "secondary")], true)))))}${row(card("Material tracking staff", "<p>Register materials, receive stock and record opening / closing usage.</p>" + btn("Open material tracking", "supplies")), card("Business owner", "<p>See consolidated branch activity, approve adjustments and sign off weekly audits.</p>" + btn("Open owner dashboard", "overview")))}${row(card("Inventory / Dispatch staff", "<p>DFD actor workspaces. Use only the actions assigned to the staff role.</p>" + btn("Open product staff workspace", "inventory", "secondary") + btn("Open dispatch staff workspace", "dispatches", "secondary")), card("Production staff", "<p>Record shift opening counts, then closing and daily usage.</p>" + btn("Log material opening", "supply-opening", "secondary") + btn("Log material closing", "usage", "secondary")))}${btn("Back to sign in", "login", "ghost")}</div>`;
  screens.overview = () =>
    card(
      "A fresh start. Every day.",
      '<p style="font-size:18px">Less paperwork. More time for your kitchen. Your next task is just a tap away.</p>' +
        actions(
          [
            btn("Record a sale", "record-sale"),
            btn("Review alerts", "alerts", "secondary"),
          ],
          true,
        ),
      "glass",
    ) +
    metrics([
      metric(
        "Today’s sales",
        wholeMoney(14545 + state.saleOffset),
        "156 items sold · all branches",
        "sales",
      ),
      metric(
        "Available products",
        String(428 + state.products.reduce((s, p) => s + p.quantity, 0) - 296),
        "Across the hub and 3 branches",
      ),
      metric(
        "Dispatches in transit",
        String(state.dispatches.filter((d) => d.received === null).length + 1),
        "2 awaiting branch confirmation",
        "truck",
      ),
      metric(
        "Needs your attention",
        String(
          state.discrepancies.filter((d) => !d.resolved).length +
            state.materials.filter((m) => m.onHand < m.threshold).length,
        ),
        "2 stock flags · 2 low materials",
        "alert",
        "danger",
      ),
    ]) +
    row(
      card("Sales this week · PHP", chart()),
      card(
        "Today’s priorities",
        notice(
          "Branch 01: physical count differs from the expected stock by 2 items.",
          "error",
        ) +
          btn("Review discrepancy", "review") +
          notice(
            "All-purpose flour: 8 kg remaining. Restock threshold: 10 kg.",
            "error",
          ) +
          btn("View material alerts", "alerts", "secondary"),
        "glass",
      ),
    ) +
    row(
      card(
        "Branch activity",
        table(
          ["Branch", "Sales", "Closing"],
          [
            [
              "Main Street",
              money(4345 + state.saleOffset),
              status(state.closingSubmitted ? "Submitted" : "In progress"),
            ],
            ["Market Road", money(5260), status("Complete")],
            ["Town Center", money(4940), status("Complete")],
          ],
        ),
      ),
      card(
        "Keep the kitchen connected",
        '<p class="muted">Every product, delivery and material movement has a place.</p>' +
          btn("View weekly audit", "audits", "secondary") +
          btn("Open reports", "reports", "ghost"),
      ),
    );
  screens.sales = () =>
    metrics([
      metric(
        "Shift sales",
        wholeMoney(4345 + state.saleOffset),
        "68 items sold",
        "sales",
      ),
      metric(
        "Queued offline",
        String(state.queue.length),
        "Awaiting a connection",
        "clock",
        state.queue.length ? "warning-text" : "green",
      ),
      metric(
        "Expected on hand",
        String(product("PRD-001").branchQty),
        "Count at the end of your shift",
      ),
    ]) +
    card(
      "Shift closing checklist",
      progress(
        "Closing progress",
        state.closingSubmitted ? 3 : 1,
        3,
        "1. Review sales  →  2. Count stock  →  3. Submit closing",
        state.closingSubmitted,
      ) + btn("Continue to stock count", "count", "ghost"),
    ) +
    actions(
      [
        btn("Record a sale", "record-sale"),
        btn("Offline queue", "offline", "secondary"),
        btn("Daily summary", "summary", "secondary"),
      ],
      true,
    ) +
    card("Recent transactions", salesTable());
  screens["record-sale"] = () => {
    const p = product(selectedProduct);
    return (
      form(
        "sale",
        row(
          card(
            "Sale details",
            stack(
              field(
                "Product · productId",
                "product",
                p.id,
                "select",
                productOptions(),
              ),
              field("Quantity", "quantity", 3, "number"),
              field("Unit price", "price", p.price.toFixed(2), "number"),
              field("Staff / time", "staff", "Ana Reyes · 11:45"),
            ),
          ),
          card(
            "Transaction preview",
            metric(
              "Line total",
              money(p.price * 3),
              "3 × " + money(p.price),
              "sales",
            ) +
              '<p id="sale-movement">Branch stock movement: −3 units</p>' +
              badge("✓ Online · ready to sync") +
              actions(
                [
                  submit("Confirm sale"),
                  btn("Queue offline", null, "secondary", "queue-sale"),
                ],
                true,
              ),
          ),
        ),
      ) + btn("Back to sales", "sales", "ghost")
    );
  };
  screens.offline = () =>
    notice(
      "Offline mode keeps pending records separate until synchronization succeeds.",
      "warning",
    ) +
    progress(
      "Offline synchronization",
      0,
      Math.max(2, state.queue.length),
      "Two sample transactions update only once on synchronization.",
    ) +
    table(
      ["Local reference", "Product", "Qty", "Total", "Status"],
      state.queue.map((s) => [
        esc(s.id),
        esc(product(s.product).name),
        s.quantity,
        money(s.total),
        status(s.status),
      ]),
    ) +
    actions(
      [
        btn("Sync queued transactions", null, "", "sync"),
        btn("Back to sales", "sales", "secondary"),
      ],
      true,
    ) +
    '<p class="small muted">Confirmed local references prevent duplicate posting when synchronization is retried.</p>';
  screens.summary = () =>
    metrics([
      metric(
        "Sales total",
        wholeMoney(4345 + state.saleOffset),
        "68 items sold",
        "sales",
      ),
      metric(
        "Open discrepancies",
        String(state.discrepancies.filter((d) => !d.resolved).length - 1),
        "Owner review needed",
        "alert",
        "danger",
      ),
      metric(
        "Shift status",
        state.closingSubmitted ? "Submitted" : "In progress",
        "Closing not submitted yet",
        "clock",
      ),
    ]) +
    table(
      ["Product", "Opening + received", "Sold", "Expected", "Counted"],
      state.products.map((p, i) => [
        esc(p.name),
        [65, 80, 40][i],
        [23, 30, 15][i],
        p.branchQty,
        Object.values(state.counts)[i],
      ]),
    ) +
    actions(
      [
        btn("Enter physical count", "count"),
        btn("Review closing", "closing", "secondary"),
        btn("Owner audit", "audits", "secondary"),
      ],
      true,
    ) +
    btn("All reports", "reports", "ghost") +
    table(
      [
        "Date",
        "Sales quantity",
        "Flags reason",
        "Flags status",
        "Stock status",
      ],
      [
        [
          "08 Nov 2026",
          156,
          "2 units",
          status("Review pending"),
          status("Count variance −2"),
        ],
      ],
    );
  screens.count = () =>
    form(
      "count",
      progress(
        "Daily closing · step 2 of 3",
        2,
        3,
        "Each count opens further checking when different.",
      ) +
        card(
          "Physical count · Branch 01",
          fields(
            [
              field(
                "Chicken empanada · expected " + product("PRD-001").branchQty,
                "empanada",
                state.counts.empanada,
                "number",
              ),
              field(
                "Cheese roll · expected " + product("PRD-002").branchQty,
                "roll",
                state.counts.roll,
                "number",
              ),
              field(
                "Banana loaf · expected " + product("PRD-003").branchQty,
                "loaf",
                state.counts.loaf,
                "number",
              ),
            ],
            true,
          ) + field("Counted by", "countedBy", "Ana Reyes · Sales Staff"),
        ) +
        notice(
          "Sample variance: Chicken empanada is 2 units below expected. Submitting creates a discrepancy flag.",
          "error",
        ) +
        actions(
          [
            submit("Compare & review closing"),
            btn("Back to summary", "summary", "secondary"),
          ],
          true,
        ),
    );
  screens.closing = () =>
    form(
      "closing",
      card(
        "Daily closing · final review",
        progress(
          "Daily closing progress",
          2,
          3,
          "Confirm the count and report before submitting.",
        ),
      ) +
        closingTable() +
        card(
          "Closing note",
          field(
            "Reason / supporting note",
            "note",
            "Two units damaged during display. Please verify.",
          ) +
            notice(
              "A variance is a flag for review. It is not an approved stock adjustment.",
              "warning",
            ),
        ) +
        actions(
          [
            submit("Submit daily closing"),
            btn("Edit count", "count", "secondary"),
          ],
          true,
        ),
    );
  screens.inventory = () =>
    metrics([
      metric(
        "Main hub stock",
        String(311 + state.products.reduce((s, p) => s + p.quantity, 0) - 296),
        "Finished product units",
      ),
      metric(
        "Branch stock",
        String(state.products.reduce((s, p) => s + p.branchQty, 0)),
        "Across three branches",
      ),
      metric(
        "Low-stock products",
        String(
          state.products.filter((p) => p.quantity < p.threshold).length + 1,
        ),
        "Review reorder thresholds",
        "alert",
        "danger",
      ),
    ]) +
    actions(
      [
        btn("Record production output", "production"),
        btn("Register product", "product-edit", "secondary"),
        btn("Receive stock / set baseline", "stock-in", "secondary"),
      ],
      true,
    ) +
    productTable() +
    btn("View product & ledger", "product", "ghost");
  screens.product = () => {
    const p = product(selectedProduct);
    return (
      metrics([
        metric("On hand", p.quantity + " units", "Available for sale"),
        metric("Unit price", money(p.price), "Finished product", "sales"),
        metric(
          "Best before",
          formatDate(p.bestBefore).slice(0, 6),
          "Batch " + p.batch,
          "clock",
        ),
      ]) +
      card(
        "Product information",
        `<p>${esc(p.description)}</p>` +
          actions(
            [
              btn("Edit product details", "product-edit"),
              btn("Create dispatch", "dispatch-new", "secondary"),
            ],
            true,
          ),
      ) +
      table(
        ["Time", "Movement", "Qty", "Staff", "Reference"],
        [
          ["09:00", "Opening baseline", "+60", "Marvin Santos", "OPEN-1108"],
          ["10:00", "Production output", "+100", "Marvin Santos", "PROD-008"],
          ["10:10", "Dispatch to branches", "−60", "Marvin Santos", "DSP-0087"],
          ...state.movements
            .filter((m) => m.product === p.id)
            .map((m) => [
              esc(m.time),
              esc(m.type),
              esc(m.quantity),
              esc(m.staff),
              esc(m.reference),
            ]),
        ],
      ) +
      btn("Back to product", "inventory", "ghost")
    );
  };
  screens["product-edit"] = () => {
    const p = product(selectedProduct);
    return form(
      "product",
      card(
        "Product details",
        fields([
          field("Product ID", "id", p.id),
          field("Name", "name", p.name),
          field(
            "Description",
            "description",
            p.description,
            "text",
            null,
            true,
          ),
          field("Unit price", "price", p.price, "number"),
          field("Low stock threshold", "threshold", p.threshold, "number"),
          field("Supply batch number", "batch", p.batch),
          field("Best before", "bestBefore", p.bestBefore, "date"),
          field(
            "Branch location",
            "location",
            p.location,
            "select",
            branches,
            null,
          ),
        ]),
      ) +
        actions(
          [submit("Save product"), btn("Cancel", "inventory", "secondary")],
          true,
        ),
    );
  };
  screens.production = () =>
    form(
      "production",
      card(
        "Production batch",
        fields([
          field(
            "Product",
            "product",
            selectedProduct,
            "select",
            productOptions(),
          ),
          field("Quantity produced", "quantity", 100, "number"),
          field("Batch number", "batch", "B-1108"),
          field("Best before", "bestBefore", "2026-11-10", "date"),
          field(
            "Recorded by",
            "staff",
            "Marvin Santos · Production Head",
            "text",
            null,
            true,
          ),
        ]),
      ) +
        notice(
          "Saving adds 100 units and records the batch in the product ledger.",
        ) +
        actions(
          [
            submit("Save production output"),
            btn("Cancel", "inventory", "secondary"),
          ],
          true,
        ),
    );
  screens["stock-in"] = () =>
    form(
      "stock",
      card(
        "Stock entry",
        fields([
          field("Entry type", "type", "Opening baseline", "select", [
            "Opening baseline",
            "Received stock",
          ]),
          field("Location", "location", "Main hub", "select", branches),
          field(
            "Product / batch",
            "product",
            selectedProduct,
            "select",
            productOptions(),
          ),
          field("Quantity", "quantity", 160, "number"),
          field(
            "Reason / reference",
            "reference",
            "Opening stock baseline · BASE-1108",
            "text",
            null,
            true,
          ),
        ]),
      ) +
        actions(
          [
            submit("Save stock movement"),
            btn("Cancel", "inventory", "secondary"),
          ],
          true,
        ),
    );
  screens.dispatches = () =>
    metrics([
      metric(
        "In transit",
        String(state.dispatches.filter((d) => d.received === null).length + 1),
        "Awaiting branch receipt",
        "truck",
      ),
      metric(
        "Received today",
        String(state.dispatches.filter((d) => d.received !== null).length + 5),
        "Receipts confirmed",
        "check",
        "green",
      ),
      metric(
        "Delivery flags",
        String(
          state.discrepancies.filter(
            (d) => d.type === "Receipt count" && !d.resolved,
          ).length,
        ),
        "Review required",
        "alert",
        "danger",
      ),
    ]) +
    btn("Create dispatch", "dispatch-new") +
    dispatchTable() +
    actions(
      [
        btn("View DSP-0087", "dispatch-detail", "ghost"),
        btn("Confirm a receipt", "receive", "secondary"),
      ],
      true,
    );
  screens["dispatch-new"] = () =>
    form(
      "dispatch",
      card(
        "Dispatch details",
        fields([
          field("Dispatch date", "date", "2026-11-08", "date"),
          field(
            "Destination branch",
            "branch",
            "Main Street",
            "select",
            branches.slice(1),
          ),
          field("Batch number", "batch", "B-1108"),
          field("Prepared by", "staff", "Marvin Santos"),
          field(
            "Product",
            "product",
            selectedProduct,
            "select",
            productOptions(),
          ),
          field("Quantity dispatched", "quantity", 60, "number"),
        ]),
      ) +
        notice(
          "Dispatch reduces main hub stock. Branch stock is updated only after receipt confirmation.",
          "warning",
        ) +
        actions(
          [submit("Save & dispatch"), btn("Cancel", "dispatches", "secondary")],
          true,
        ),
    );
  screens["dispatch-detail"] = () => {
    const d = dispatch();
    return (
      badge(d.status, /Received/.test(d.status) ? "" : "warning") +
      metrics([
        metric("Dispatched", d.quantity + " units", "Dispatch movement"),
        metric(
          "Received",
          d.received === null ? "Awaiting" : d.received + " units",
          "Branch confirmation",
          "clock",
        ),
      ]) +
      table(
        ["Product", "Batch", "Dispatched", "Received", "Difference"],
        [
          [
            esc(product(d.product).name),
            esc(d.batch),
            d.quantity,
            d.received ?? "—",
            d.received === null ? "—" : d.received - d.quantity,
          ],
        ],
      ) +
      card(
        "Dispatch timeline",
        `<p>10:00 · Created by ${esc(d.staff)}<br>10:10 · Sent from main warehouse<br>${d.received === null ? "Pending · Branch physical receipt confirmation" : "Received · Branch receipt recorded"}</p>`,
      ) +
      actions(
        [
          btn("Confirm branch receipt", "receive"),
          btn("All dispatches", "dispatches", "secondary"),
        ],
        true,
      )
    );
  };
  screens.receive = () => {
    const d = dispatch();
    return form(
      "receive",
      card(
        "Receipt · " + d.id,
        fields([
          field(
            "Product / batch",
            "product",
            d.product,
            "select",
            productOptions(),
          ),
          field("Dispatched quantity", "dispatched", d.quantity, "number"),
          field("Actual received", "received", d.received ?? 58, "number"),
          field("Received by", "staff", "Ana Reyes"),
          field(
            "Delivery note",
            "note",
            "Two units missing from counted delivery.",
            "text",
            null,
            true,
          ),
        ]),
      ) +
        notice(
          "58 received versus 60 dispatched: a delivery discrepancy of −2 will be flagged. The branch receives the actual quantity.",
          "error",
        ) +
        actions(
          [
            submit("Confirm actual receipt"),
            btn("Cancel", "dispatch-detail", "secondary"),
          ],
          true,
        ),
    );
  };
  screens.supplies = () =>
    metrics([
      metric(
        "Registered materials",
        String(24 + state.materials.length - 4),
        "Supply master items",
        "leaf",
      ),
      metric(
        "Low stock materials",
        String(state.materials.filter((m) => m.onHand < m.threshold).length),
        "Below their set thresholds",
        "alert",
        "danger",
      ),
      metric(
        "Stock received today",
        "5",
        "Receipts confirmed",
        "truck",
        "green",
      ),
    ]) +
    actions(
      [
        btn("Register material", "supply-new"),
        btn("Record stock-in", "supply-stock", "secondary"),
        btn("Opening / closing usage", "usage", "secondary"),
      ],
      true,
    ) +
    actions(
      [
        btn("Log shift opening", "supply-opening", "ghost"),
        btn("Log closing & usage", "usage", "ghost"),
      ],
      true,
    ) +
    materialTable() +
    btn("View low-stock alerts", "alerts", "ghost");
  screens["supply-new"] = () =>
    form(
      "material",
      card(
        "Material details",
        fields([
          field(
            "Material ID",
            "id",
            "MAT-" + String(state.materials.length + 1).padStart(3, "0"),
          ),
          field("Name", "name", "All-purpose flour"),
          field(
            "Description",
            "description",
            "Baking flour · food grade",
            "text",
            null,
            true,
          ),
          field("Unit of measurement", "unit", "kg", "select", [
            "kg",
            "g",
            "L",
            "mL",
            "pcs",
            "pack",
          ]),
          field("Supplier / source", "supplier", "Local Milling Co."),
          field("Unit cost", "cost", 62, "number"),
          field("Low stock threshold", "threshold", 10, "number"),
        ]),
      ) +
        actions(
          [
            submit("Save material & threshold"),
            btn("Cancel", "supplies", "secondary"),
          ],
          true,
        ),
    );
  screens["supply-stock"] = () =>
    form(
      "material-stock",
      card(
        "Stock-in details",
        fields([
          field("Material", "material", "MAT-001", "select", materialOptions()),
          field("Quantity received", "quantity", 25, "number"),
          field("Date received", "date", "2026-11-08", "date"),
          field("Supplier / source", "supplier", "Local Milling Co."),
          field("Unit cost", "cost", 62, "number"),
          field("Receipt reference", "reference", "SUP-0134"),
        ]),
      ) +
        notice("Saving adds the received quantity to main hub materials.") +
        actions(
          [submit("Save stock-in"), btn("Cancel", "supplies", "secondary")],
          true,
        ),
    );
  screens.usage = () => {
    const m = material("MAT-001");
    return form(
      "usage",
      card(
        "Material count",
        field("Material", "material", m.id, "select", materialOptions()) +
          fields(
            [
              field("Opening count", "opening", m.opening, "number"),
              field("Received during shift", "received", m.received, "number"),
              field("Closing count", "closing", m.closing, "number"),
            ],
            true,
          ) +
          field("Recorded by", "staff", "Mia Choi · Production Staff"),
      ) +
        metrics([
          metric(
            "Computed daily usage",
            m.usage + " kg",
            "Opening + received − closing",
            "leaf",
          ),
          metric(
            "Remaining stock",
            m.closing + " kg",
            "Below the 10 kg threshold",
            "alert",
            "danger",
          ),
        ]) +
        row(
          progress(
            "Usage / opening",
            m.usage,
            m.opening,
            "Opening + received − closing = daily usage.",
            false,
            "kg",
          ),
          progress(
            "Flour remaining vs target",
            m.closing,
            40,
            "Restock to at least 10 kg; remaining target is 40 kg.",
            false,
            "kg",
          ),
        ) +
        actions(
          [submit("Save daily usage"), btn("Cancel", "supplies", "secondary")],
          true,
        ),
    );
  };
  screens["supply-opening"] = () =>
    form(
      "opening",
      notice(
        "Previous verified closing values are prefilled. Check physical stock before saving.",
        "warning",
      ) +
        field("Date / shift", "dateShift", "08 Nov 2026 · Morning shift") +
        field("Location", "location", "Main hub", "select", branches) +
        field("Material", "material", "MAT-001", "select", materialOptions()) +
        field("Opening quantity", "quantity", 20, "number") +
        field("Counted by", "staff", "Mia Choi · Production Staff") +
        submit("Save opening inventory") +
        btn("Cancel", "supplies", "secondary"),
    );
  screens.alerts = () =>
    card(
      "White sugar · production materials",
      progress(
        "Restock trigger reached",
        19.2,
        20,
        "96% used · only 0.8 kg remains. Request replenishment.",
        false,
        "kg",
      ) + btn("Replenish sugar supply", "supply-stock"),
    ) +
    card(
      "All-purpose flour",
      badge("Below threshold", "red") +
        progress(
          "Flour remaining",
          material("MAT-001").onHand,
          40,
          "Below the 10 kg restock threshold.",
          false,
          "kg",
        ) +
        '<p class="small muted">8 kg remaining. Threshold: 10 kg · Supplier: Local Milling Co.</p>' +
        btn("Receive material stock", "supply-stock", "secondary"),
    ) +
    card(
      "Delivery exceptions",
      notice("DSP-0087 has a two-unit delivery variance.", "error") +
        btn("Review delivery", "delivery-review", "secondary"),
    ) +
    btn("Back to materials", "supplies", "ghost");
  screens.discrepancies = () =>
    metrics([
      metric(
        "Open flags",
        String(state.discrepancies.filter((d) => !d.resolved).length),
        "1 count · 1 delivery",
        "alert",
        "danger",
      ),
      metric(
        "Adjustments approved",
        String(3 + state.discrepancies.filter((d) => d.resolved).length),
        "This week",
        "check",
        "green",
      ),
      metric("Awaiting recount", "1", "Branch follow-up", "clock"),
    ]) +
    flagsTable() +
    btn("Review DISC-001", "review") +
    btn("Review DISC-002 · delivery", "delivery-review", "ghost");
  screens.review = () =>
    badge(
      state.discrepancies[0].resolved
        ? "Resolved"
        : "! Awaiting Business Owner review",
      state.discrepancies[0].resolved ? "" : "warning",
    ) +
    metrics([
      metric(
        "Expected",
        state.discrepancies[0].expected + " units",
        "From the daily ledger",
      ),
      metric(
        "Physical count",
        state.discrepancies[0].actual + " units",
        "Submitted by Ana Reyes",
      ),
      metric(
        "Variance",
        state.discrepancies[0].variance + " units",
        "Owner approval",
        "alert",
        "danger",
      ),
    ]) +
    card(
      "Evidence & notes",
      "<p>Closing note: “Two units damaged during display. Please verify.”<br>Reason proposed: damaged goods.<br>Source record: daily closing CLOSE-1108.</p>" +
        notice(
          "Expected remains the same. A physical count alone does not change the ledger.",
          "warning",
        ),
    ) +
    actions(
      [
        btn("Review stock adjustment", "adjust"),
        btn("Request recount", null, "secondary", "recount"),
        btn("Back to flags", "discrepancies", "secondary"),
      ],
      true,
    );
  screens["delivery-review"] = () =>
    badge("! Delivery mismatch · owner review", "warning") +
    metrics([
      metric("Dispatched", "60 units", "DSP-0087 · B-1108"),
      metric(
        "Actual received",
        String(dispatch().received ?? 58) + " units",
        "Counted by Ana Reyes",
        "truck",
      ),
      metric(
        "Variance",
        "−2 units",
        "Actual minus dispatched",
        "alert",
        "danger",
      ),
    ]) +
    table(
      ["Record", "Product / location", "Quantity / status"],
      [
        [
          "DSP-0087",
          "Empanada · Main hub → Main Street",
          "60 dispatched; 58 received",
        ],
        [
          "RECV-0087",
          "Main Street · received 08 Nov, 11:00",
          "Branch ledger credited +58",
        ],
        [
          "DISC-002",
          "Delivery note: two units missing",
          status(
            state.discrepancies[1].resolved
              ? "Resolved"
              : "Open · unaccounted 2 units",
          ),
        ],
      ],
    ) +
    notice(
      "Main hub deduction is already recorded. Receipt added the actual 58 units. Do not credit the missing 2 units or deduct the hub stock a second time.",
      "error",
    ) +
    btn("Review delivery resolution", "delivery-resolve") +
    btn("Recount delivery", null, "ghost", "delivery-recount") +
    btn("Back to discrepancies", "discrepancies", "ghost");
  screens.audits = () =>
    metrics([
      metric(
        "Weekly sales",
        wholeMoney(90145 + state.saleOffset),
        "All branches",
        "sales",
      ),
      metric(
        "Confirmed closings",
        state.weekSigned ? "21 / 21" : "19 / 21",
        "3 branches monitored",
        "box",
      ),
      metric(
        "Open flags",
        String(state.discrepancies.filter((d) => !d.resolved).length),
        "Resolve before sign-off",
        "alert",
        "danger",
      ),
    ]) +
    progress(
      "Confirmed daily closings",
      state.weekSigned ? 21 : 19,
      21,
      "3 pending checks · review before weekly sign-off.",
      state.weekSigned,
    ) +
    table(
      ["Week", "Branches", "Sales", "Flags", "Audit status"],
      [
        [
          "02–08 Nov 2026",
          3,
          money(90145 + state.saleOffset),
          state.weekSigned ? 0 : 2,
          status(state.weekSigned ? "Signed off" : "Open"),
        ],
        ["26 Oct–01 Nov 2026", 3, money(86220), 0, status("Signed off")],
      ],
      ["audit-detail", "audit-detail"],
    ) +
    actions(
      [
        btn("Review current weekly audit", "audit-detail"),
        btn("Daily summaries", "summary", "secondary"),
      ],
      true,
    ) +
    btn("All reports", "reports", "ghost");
  screens["audit-detail"] = () =>
    notice(
      "Illustrative review state: 2 closing records and 2 flags remain pending. Resolve them before using the ready-for-sign-off screen.",
      "warning",
    ) +
    progress(
      "Weekly audit completion",
      state.weekSigned ? 21 : 19,
      21,
      "Pending records remain visible; sign-off follows reconciliation.",
      state.weekSigned,
    ) +
    auditTable(state.weekSigned) +
    card(
      "Owner review",
      "<p>The primary path returns to discrepancy review. A separate preview demonstrates sign-off after every record is confirmed.</p>" +
        actions(
          [
            btn("Resolve outstanding exceptions", "discrepancies"),
            btn("Preview ready-to-sign state", "audit-ready", "secondary"),
          ],
          true,
        ),
    ) +
    btn("Back to weekly audits", "audits", "ghost");
  screens["audit-ready"] = () =>
    card(
      "Audit readiness",
      progress(
        "Audit readiness",
        21,
        21,
        "All daily closings are confirmed; all open flags are resolved.",
        true,
      ),
    ) +
    badge("✓ 21 / 21 closings confirmed") +
    badge("✓ 0 unresolved flags") +
    notice("All closing records and adjustments have been reviewed.") +
    auditTable(true) +
    form(
      "signoff",
      field(
        "Owner sign-off note",
        "note",
        "Reviewed daily summaries, variances and approved adjustments.",
      ) + submit("Sign off weekly audit"),
    ) +
    btn("Back to weekly audit", "audit-detail", "ghost");
  screens.accounts = () =>
    btn("Create staff account", "account-new") +
    table(
      ["Account", "Name", "Role", "Location", "Status"],
      state.accounts.map((a) => [
        esc(a.id),
        esc(a.name),
        esc(a.role),
        esc(a.branch),
        status(a.status),
      ]),
      state.accounts.map((a) => "permissions?item=" + a.id),
    ) +
    actions(
      [
        btn("Configure permissions", "permissions", "ghost"),
        btn("Delete sample account", "delete-account", "destructive"),
      ],
      true,
    );
  screens["account-new"] = () =>
    form(
      "account",
      card(
        "Account details",
        fields([
          field(
            "Account ID",
            "id",
            "ACC-" + String(state.accounts.length + 1).padStart(3, "0"),
          ),
          field("Username", "username", "new.staff"),
          field("First name", "firstName", "Jamie"),
          field("Surname", "surname", "Cruz"),
          field(
            "Temporary password",
            "password",
            "demo123",
            "password",
            null,
            true,
          ),
          field("Role", "role", "Sales Staff", "select", roles),
          field(
            "Branch / location",
            "branch",
            "Main Street",
            "select",
            branches,
          ),
        ]),
      ) +
        notice(
          "Keep the temporary password private. Assign only the permissions needed for the role.",
          "warning",
        ) +
        actions(
          [
            submit("Continue to permissions"),
            btn("Cancel", "accounts", "secondary"),
          ],
          true,
        ),
    );
  screens.permissions = () => {
    const a = state.accounts.find((a) => a.id === selectedAccount) || {
      id: "ACC-005",
      name: "Jamie Cruz",
      role: "Sales Staff",
    };
    const perms = [
      "Record sales and queue offline",
      "Confirm physical receipt",
      "Count stock and submit closing",
      "Approve inventory adjustments",
      "Weekly audit sign-off",
      "Create or delete accounts",
    ];
    const own = a.role === "Business Owner";
    return form(
      "permissions",
      card(
        a.role + " · " + a.name,
        table(
          ["Capability", "Access"],
          perms.map((p, i) => [
            esc(p),
            status(own || i < 3 ? "Allowed" : "Owner only"),
          ]),
        ) +
          fields(
            perms.map(
              (p, i) =>
                `<label class="check-row"><input type="checkbox" name="perm${i}" ${(state.permissions[a.id]?.[i] ?? (own || i < 3)) ? "checked" : ""}><span>${esc(p)}</span></label>`,
            ),
          ),
      ) +
        field("Assigned role", "role", a.role, "select", roles) +
        actions(
          [
            submit("Save account & permissions"),
            btn("Back to account details", "accounts", "secondary"),
          ],
          true,
        ) +
        '<p class="small muted">Review the assigned location and permissions before saving. Demo role selection is not server-side access control.</p>',
    );
  };
  screens.reports = () =>
    card(
      "Kitchen performance",
      metrics([
        metric(
          "Today’s sales",
          wholeMoney(14545 + state.saleOffset),
          "156 items sold",
          "sales",
        ),
        metric(
          "Week-to-date",
          wholeMoney(90145 + state.saleOffset),
          "02–08 Nov 2026",
          "sales",
        ),
        metric(
          "Open flags",
          String(state.discrepancies.filter((d) => !d.resolved).length),
          "Owner review required",
          "alert",
          "danger",
        ),
      ]) + btn("Choose report scope", "report-filters", "ghost"),
    ) +
    `<div class="report-grid">${[
      [
        "Daily sales & closing",
        "Sales quantity, totals, expected stock, physical counts and closing status.",
        "Open daily summary",
        "summary",
      ],
      [
        "Weekly audit",
        "Confirmed summaries, branch stock status, exceptions and owner sign-off.",
        "Open weekly audit",
        "audits",
      ],
      [
        "Stock & reconciliation",
        "Product quantities, batch best-before dates and reorder exceptions.",
        "Open stock report",
        "inventory-report",
      ],
      [
        "Dispatch status",
        "Dispatched versus received quantities and unresolved delivery alerts.",
        "Open dispatch report",
        "dispatch-report",
      ],
      [
        "Material usage & restock",
        "Opening, received, closing and daily usage with material thresholds.",
        "Open material report",
        "supply-report",
      ],
    ]
      .map(([t, d, b, r], i) =>
        card(
          t,
          `<p class="small muted">${d}</p>` + btn(b, r, i ? "secondary" : ""),
          "report-tile",
        ),
      )
      .join("")}</div>`;
  screens["inventory-report"] = () =>
    metrics([
      metric(
        "Main hub stock",
        String(311 + state.products.reduce((s, p) => s + p.quantity, 0) - 296),
        "Finished product units",
      ),
      metric(
        "Branch stock",
        String(state.products.reduce((s, p) => s + p.branchQty, 0)),
        "Across three branches",
      ),
      metric(
        "Count variance",
        "−2",
        "DISC-001 awaiting review",
        "alert",
        "danger",
      ),
    ]) +
    productTable() +
    row(
      progress(
        "Banana loaf stock",
        25,
        80,
        "Below the 80-unit reorder threshold.",
        false,
        "units",
      ),
      card(
        "Reconciliation required",
        notice(
          "Chicken empanada expected 42, counted 40; variance −2.",
          "error",
        ) + btn("Review count discrepancy", "review"),
      ),
    ) +
    actions(
      [
        btn("View product ledger", "product", "ghost"),
        btn("Back to reports", "reports", "secondary"),
      ],
      true,
    ) +
    exportButtons("inventory");
  screens["dispatch-report"] = () =>
    metrics([
      metric("In transit", "3", "Awaiting delivery", "truck"),
      metric("Received today", "6", "Confirmed deliveries", "check", "green"),
      metric(
        "Delivery flags",
        String(state.discrepancies[1].resolved ? 0 : 1),
        "DSP-0087 needs review",
        "alert",
        "danger",
      ),
    ]) +
    table(
      ["Dispatch", "Branch", "Sent", "Received", "Variance", "Status"],
      state.dispatches.map((d) => [
        esc(d.id),
        esc(d.branch),
        d.quantity,
        d.received ?? status("Pending"),
        d.received === null ? "—" : d.received - d.quantity,
        status(d.status),
      ]),
      state.dispatches.map((d) => "dispatch-detail?item=" + d.id),
    ) +
    notice(
      "DSP-0087: 2 units are unaccounted for. Verify actual receipt before resolving the alert.",
      "error",
    ) +
    actions(
      [
        btn("Review DSP-0087", "dispatch-detail"),
        btn("Review discrepancy", "delivery-review", "secondary"),
        btn("Back to reports", "reports", "secondary"),
      ],
      true,
    ) +
    exportButtons("dispatch");
  screens["supply-report"] = () =>
    metrics([
      metric(
        "Low-stock materials",
        String(state.materials.filter((m) => m.onHand < m.threshold).length),
        "Restock alerts require action",
        "alert",
        "danger",
      ),
      metric(
        "Flour usage",
        material("MAT-001").usage + " kg",
        "Opening + received − closing",
        "leaf",
      ),
      metric(
        "Sugar used",
        "19.2 kg",
        "96% of available stock",
        "leaf",
        "danger",
      ),
    ]) +
    table(
      ["Material", "Opening", "Received", "Used", "Remaining", "Threshold"],
      state.materials
        .filter((m) => m.id !== "MAT-003")
        .map((m) => [
          esc(m.name),
          m.opening + " " + esc(m.unit),
          m.received + " " + esc(m.unit),
          m.usage + " " + esc(m.unit),
          m.onHand + " " + esc(m.unit),
          m.threshold + " " + esc(m.unit),
        ]),
    ) +
    row(
      progress(
        "Sugar usage / opening",
        19.2,
        20,
        "Current stock remaining: only 0.8 kg available.",
        false,
        "kg",
      ),
      progress(
        "Flour remaining",
        material("MAT-001").onHand,
        40,
        "Restock required when below the 10 kg threshold.",
        false,
        "kg",
      ),
    ) +
    actions(
      [
        btn("Record replenishment", "supply-stock"),
        btn("Review daily usage", "usage", "secondary"),
        btn("Back to reports", "reports", "secondary"),
      ],
      true,
    ) +
    exportButtons("material");
  screens["next-opening"] = () =>
    form(
      "baseline",
      notice(
        "Use verified branch closing stock from the signed week. This is a next-day opening snapshot, not a second physical stock receipt.",
      ) +
        field("Branch / date", "scope", "Main Street · 09 Nov 2026") +
        table(
          ["Product", "Verified closing", "Next opening"],
          state.products.map((p, i) => [
            esc(p.name),
            Object.values(state.counts)[i],
            Object.values(state.counts)[i],
          ]),
        ) +
        field(
          "Reference",
          "reference",
          "Signed week AUD-2026-W45 · reviewed DISC-001",
        ) +
        submit("Confirm next opening") +
        btn("Back to audit", "audits", "secondary"),
    );
  function exportButtons(type) {
    return `<div class="export-actions">${btn("Export CSV", null, "secondary", "export-" + type)}${btn("Print report", null, "ghost", "print")}</div>`;
  }
  // Scope filtering is performed on local illustrative records; no unseen branch data is invented.
  const baseReports = {
    summary: screens.summary,
    "inventory-report": screens["inventory-report"],
    "dispatch-report": screens["dispatch-report"],
    "supply-report": screens["supply-report"],
  };
  const scopeBranch = () => state.reportScope.branch.split(" · ")[0];
  const scopeActive = (route) =>
    state.scopeApplied && state.activeReportRoute === route;
  const inSnapshot = () => state.reportScope.date === "2026-11-08";
  for (const route of Object.keys(baseReports)) {
    screens[route] = () => {
      if (!scopeActive(route)) return baseReports[route]();
      const branch = scopeBranch(),
        all = branch === "All branches";
      if (route === "dispatch-report") {
        const ds = state.dispatches.filter(
          (d) =>
            d.date === state.reportScope.date && (all || d.branch === branch),
        );
        return (
          metrics([
            metric(
              "In transit",
              String(ds.filter((d) => d.received === null).length),
              "Selected report scope",
              "truck",
            ),
            metric(
              "Received",
              String(ds.filter((d) => d.received !== null).length),
              "Confirmed deliveries",
              "check",
              "green",
            ),
            metric(
              "Delivery flags",
              String(ds.filter((d) => d.status === "Flagged").length),
              "Selected report scope",
              "alert",
              "danger",
            ),
          ]) +
          table(
            ["Dispatch", "Branch", "Sent", "Received", "Variance", "Status"],
            ds.map((d) => [
              esc(d.id),
              esc(d.branch),
              d.quantity,
              d.received ?? "—",
              d.received === null ? "—" : d.received - d.quantity,
              status(d.status),
            ]),
            ds.map((d) => "dispatch-detail?item=" + d.id),
          ) +
          btn("Back to reports", "reports", "secondary") +
          exportButtons("dispatch")
        );
      }
      if (
        !inSnapshot() ||
        (route === "summary" && !all && branch !== "Main Street") ||
        (route === "supply-report" && !all && branch !== "Main hub")
      )
        return (
          notice(
            "No illustrative records are available for this date and branch. Choose 08 Nov 2026 and the relevant demo location.",
          ) +
          table(["Record", "Date", "Branch"], []) +
          btn("Choose another scope", "report-filters", "secondary") +
          btn("Back to reports", "reports", "ghost")
        );
      if (route === "inventory-report" && !all) {
        const ps =
          branch === "Main hub"
            ? state.products.filter((p) => p.location === "Main hub")
            : branch === "Main Street"
              ? state.products
              : [];
        return (
          metrics([
            metric(
              "Selected stock",
              String(
                ps.reduce(
                  (n, p) =>
                    n + (branch === "Main hub" ? p.quantity : p.branchQty),
                  0,
                ),
              ),
              "Units in " + branch,
            ),
            metric(
              "Product records",
              String(ps.length),
              "Illustrative snapshot",
            ),
            metric(
              "Below threshold",
              String(
                ps.filter(
                  (p) =>
                    (branch === "Main hub" ? p.quantity : p.branchQty) <
                    p.threshold,
                ).length,
              ),
              "Selected branch",
              "alert",
              "danger",
            ),
          ]) +
          table(
            ["Product", "Batch", "Location", "Quantity", "Threshold"],
            ps.map((p) => [
              esc(p.name),
              esc(p.batch),
              esc(branch),
              branch === "Main hub" ? p.quantity : p.branchQty,
              p.threshold,
            ]),
          ) +
          btn("Back to reports", "reports", "secondary") +
          exportButtons("inventory")
        );
      }
      return baseReports[route]();
    };
  }
  function dialogBody(route) {
    const p = product("PRD-001"),
      sale = state.lastSale || cfg.seed.sales[0],
      d = dispatch(),
      acct = state.accounts.find((a) => a.id === selectedAccount);
    switch (route) {
      case "sale-done":
        return (
          `<p class="muted">Transaction ${esc(sale.id)} has been added to the sample ledger.</p>` +
          badge("✓ Synced") +
          metric(
            "Line total",
            money(sale.total),
            product(sale.product).name + " · " + sale.quantity + " units",
            "sales",
          ) +
          `<p>Branch stock updated: ${esc(state.lastSaleBefore ?? 45)} → ${esc(state.lastSaleAfter ?? 42)} units.</p>` +
          btn("Done", "sales") +
          btn("View sales workspace", "sales", "ghost")
        );
      case "sync-done":
        return (
          `<p class="muted">Both sample transactions have synced successfully.</p>` +
          badge(
            "✓ " +
              (state.lastSyncCount ?? 2) +
              " / " +
              (state.lastSyncCount ?? 2) +
              " synchronized",
          ) +
          progress(
            "Synchronization complete",
            state.lastSyncCount || 2,
            state.lastSyncCount || 2,
            "Both records are confirmed.",
            true,
          ) +
          "<p>Local references are matched to confirmed transaction records to prevent duplicate posting in the intended application.</p>" +
          btn("Back to sales", "sales", "ghost")
        );
      case "closing-done":
        return (
          '<p class="muted">Your shift has been sent for owner review.</p>' +
          badge("Awaiting owner review", "warning") +
          progress(
            "Closing submitted",
            3,
            3,
            "Your owner can now review the closing record.",
            true,
          ) +
          "<p>The count and discrepancy remain available in the daily summary. Only an approved adjustment changes the reconciled ledger.</p>" +
          btn("View daily summary", "summary")
        );
      case "receipt-done":
        return (
          `<p class="muted">${esc(d.id)} · ${esc(d.branch)}</p>` +
          badge("✓ " + (d.received ?? 58) + " units received") +
          notice(
            "Delivery variance: " +
              ((d.received ?? 58) - d.quantity) +
              " units. Owner alert created.",
            "warning",
          ) +
          `<p>Sample branch-ledger movement: +${d.received ?? 58} units. Hub dispatch record remains ${d.quantity} units.</p>` +
          btn("View discrepancy", "delivery-review") +
          btn("Close", "dispatches", "ghost")
        );
      case "usage-done":
        return (
          '<p class="muted">Daily material closing is complete.</p>' +
          badge("✓ " + (state.lastUsage?.usage ?? 12) + " kg used") +
          notice(
            "All-purpose flour: " +
              material("MAT-001").onHand +
              " kg remaining. Restock threshold: 10 kg.",
            "error",
          ) +
          "<p>The Owner and Production Head can review the low-stock alert.</p>" +
          btn("View alerts", "alerts") +
          btn("Close", "supplies", "ghost")
        );
      case "adjust":
        return (
          '<p class="muted">Only the Business Owner approves a reconciled ledger adjustment.</p>' +
          form(
            "adjust",
            stack(
              field(
                "Adjustment",
                "adjustment",
                state.discrepancies[0].variance + " units · Chicken empanada",
              ),
              field("Reason", "reason", "Verified damaged goods"),
              field(
                "Approved by",
                "approvedBy",
                state.user.name + " · Business Owner",
              ),
              notice(
                "The approved adjustment changes the ledger by " +
                  state.discrepancies[0].variance +
                  " units.",
                "warning",
              ),
              submit("Approve adjustment"),
              btn("Cancel", "review", "ghost"),
            ),
          )
        );
      case "adjusted":
        return (
          '<p class="muted">The discrepancy is resolved in this sample state.</p>' +
          badge("✓ Owner approved") +
          "<p>Ledger: " +
          (state.lastAdjustment?.before ?? 42) +
          " " +
          (state.lastAdjustment?.delta ?? -2) +
          " = " +
          (state.lastAdjustment?.after ?? 40) +
          " units.<br>Audit trail: " +
          esc(state.user.name) +
          " · 08 Nov 2026 · Verified damaged goods.</p>" +
          btn("Return to review queue", "discrepancies") +
          btn("Close", "discrepancies", "ghost")
        );
      case "signed":
        return (
          '<p class="muted">Audit AUD-2026-W45 · 02–08 Nov 2026</p>' +
          badge("✓ Closed by Business Owner") +
          progress("Week complete", 21, 21, "Owner sign-off recorded.", true) +
          `<p>Confirmed sales: ${wholeMoney(90145 + state.saleOffset)}<br>All discrepancy flags resolved in this preview scenario.<br>Verified closing stock carries into the next opening baseline.</p>` +
          btn("Set next opening baseline", "next-opening")
        );
      case "delete-account":
        return (
          `<p class="muted">${esc(acct?.id || "ACC-005")} · ${esc(acct?.name || "Jamie Cruz")} · ${esc(acct?.role || "Sales Staff")}</p>` +
          notice(
            "Check the account name and role before confirming deletion.",
            "warning",
          ) +
          field(
            "Account to delete",
            "accountToDelete",
            acct ? acct.username + " · " + acct.id : "new.staff · ACC-005",
          ) +
          actions([
            btn("Delete account", null, "destructive", "delete-account"),
            btn("Cancel", "accounts", "secondary"),
          ])
        );
      case "account-deleted":
        return (
          `<p class="muted">${esc(state.lastDeleted || "ACC-005")} is removed in this preview outcome.</p>` +
          badge("✓ Deletion complete") +
          "<p>The selected account has been removed from this review state.</p>" +
          btn("Back to accounts", "accounts") +
          btn("Close", "accounts", "ghost")
        );
      case "report-filters":
        return (
          '<p class="muted">Select the daily view for the report you want to inspect.</p>' +
          form(
            "report-filter",
            stack(
              field("Report date", "date", state.reportScope.date, "date"),
              field("Branch", "branch", state.reportScope.branch, "select", [
                "Main Street · Branch 01",
                "Market Road · Branch 02",
                "Town Center · Branch 03",
                "Main hub",
                "All branches",
              ]),
              field("Report type", "type", state.reportScope.type, "select", [
                "Daily sales & stock summary",
                "Stock & reconciliation",
                "Dispatch status",
                "Material usage & restock",
                "Weekly audit",
              ]),
              submit("View branch daily report"),
              btn("Cancel", "reports", "ghost"),
            ),
          )
        );
      case "delivery-resolve":
        return form(
          "delivery-resolve",
          stack(
            field("Source record", "source", "DISC-002 · DSP-0087"),
            field(
              "Verified received quantity",
              "received",
              d.received ?? 58,
              "number",
            ),
            field(
              "Resolution reason",
              "reason",
              "Verified 2-unit shortage; actual receipt retained",
            ),
            field(
              "Reviewed by",
              "reviewedBy",
              state.user.name + " · Business Owner",
            ),
            notice(
              "Resolving this verified shortage keeps the branch credit at 58. It records the reason and owner decision; it does not add the missing units.",
              "warning",
            ),
            submit("Confirm delivery resolution"),
          ),
        );
      case "delivery-resolved":
        return (
          badge("✓ Resolved · owner verified") +
          notice(
            "DISC-002 resolved. Branch credit remains +" +
              (d.received ?? 58) +
              " units; hub deduction remains −" +
              d.quantity +
              " units.",
          ) +
          `<p>Audit trail: ${esc(state.user.name)} · 08 Nov 2026 · Verified −2 unit shortage.</p>` +
          btn("Review weekly audit", "audit-detail") +
          btn("Close", "discrepancies", "ghost")
        );
      case "supply-opened":
        return (
          badge("✓ Opening saved · " + (state.lastOpening ?? 20) + " kg") +
          progress(
            "Opening record saved",
            1,
            1,
            "Opening record OPEN-1108 is available for this shift’s closing.",
            true,
          ) +
          btn("Continue to closing & usage", "usage") +
          btn("Close", "supplies", "ghost")
        );
      case "baseline-saved":
        return (
          badge(
            "✓ Baseline confirmed · " +
              Object.values(state.counts).reduce((s, n) => s + Number(n), 0) +
              " units",
          ) +
          `<p>${state.counts.empanada} empanadas + ${state.counts.roll} cheese rolls + ${state.counts.loaf} banana loaves = ${Object.values(state.counts).reduce((s, n) => s + Number(n), 0)} units. Opening values carry forward the verified closing; no stock is added twice.</p>` +
          btn("Open product", "inventory") +
          btn("Close", "inventory", "ghost")
        );
      default:
        return "";
    }
  }
  function parseRoute() {
    const raw = location.hash.slice(1) || "login",
      parts = raw.split("?");
    const route = cfg.screens[parts[0]] ? parts[0] : "login",
      params = new URLSearchParams(parts[1] || "");
    if (params.get("item")) {
      const item = params.get("item");
      if (item.startsWith("PRD")) selectedProduct = item;
      if (item.startsWith("DSP")) selectedDispatch = item;
      if (item.startsWith("ACC")) selectedAccount = item;
    }
    return route;
  }
  function navigate(to) {
    if (!to) return;
    location.hash = to;
  }
  function render() {
    const route = parseRoute(),
      isDialog = cfg.dialogs.includes(route);
    current = route;
    document.title = cfg.screens[route][0] + " · Eli’s Yummy Kitchen";
    let markup = "";
    if (isDialog) {
      const title = cfg.screens[route][0],
        dialog = `<section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><h1 id="dialog-title">${esc(title)}</h1>${dialogBody(route)}</section>`;
      if (dialogFrom && screens[dialogFrom])
        markup =
          shell(dialogFrom, screens[dialogFrom]()) +
          `<div class="modal-backdrop" data-backdrop>${dialog}</div>`;
      else markup = `<main class="dialog-page">${dialog}</main>`;
    } else {
      dialogFrom = null;
      lastPage = route;
      if (route === "login" || route === "shift") markup = screens[route]();
      else markup = shell(route, screens[route]());
    }
    $("#app").innerHTML = markup;
    if (route === "receive") {
      const expected = document.getElementById("f-dispatched");
      if (expected) expected.readOnly = true;
    }
    if (route === "product") {
      const h = $("h1");
      if (h) h.textContent = product(selectedProduct).name;
    }
    if (route === "dispatch-detail") {
      const h = $("h1");
      if (h) h.textContent = "Dispatch " + dispatch().id;
    }
    if (route === "permissions") {
      const a = state.accounts.find((a) => a.id === selectedAccount);
      if (a) {
        const p = $(".heading .muted");
        if (p)
          p.textContent = "Use role permissions · " + a.id + " · " + a.name;
      }
    }
    if (
      [
        "summary",
        "inventory-report",
        "dispatch-report",
        "supply-report",
      ].includes(route) &&
      state.scopeApplied
    ) {
      const p = $(".heading .muted");
      if (p)
        p.textContent =
          formatDate(state.reportScope.date) +
          " · " +
          state.reportScope.branch +
          " · Illustrative records";
    }
    if (isDialog)
      requestAnimationFrame(() =>
        ($(".dialog input") || $(".dialog button"))?.focus({
          preventScroll: true,
        }),
      );
    window.scrollTo(0, 0);
  }
  function go(to) {
    const route = to.split("?")[0];
    if (
      cfg.dialogs.includes(route) &&
      !cfg.dialogs.includes(current) &&
      !["login", "shift"].includes(current)
    )
      dialogFrom = current;
    navigate(to);
  }
  function toast(text) {
    const t = $("#toast");
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("show"), 3600);
  }
  const readForm = (f) => Object.fromEntries(new FormData(f).entries());
  const integer = (v, label, allowZero = false) => {
    const n = Number(v);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < (allowZero ? 0 : 1))
      throw Error(
        label +
          " must be " +
          (allowZero ? "a nonnegative" : "a positive") +
          " whole number.",
      );
    return n;
  };
  const number = (v, label, allowZero = false) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < (allowZero ? 0 : 0.000001))
      throw Error(
        label +
          " must be " +
          (allowZero ? "zero or greater." : "greater than zero."),
      );
    return n;
  };
  function commitSale(data, queued = false) {
    const p = product(data.product),
      qty = integer(data.quantity, "Quantity"),
      price = number(data.price, "Unit price", true);
    const reserved = state.queue
      .filter((s) => s.product === p.id)
      .reduce((n, s) => n + s.quantity, 0);
    if (qty > p.branchQty - reserved)
      throw Error(
        "Only " +
          Math.max(0, p.branchQty - reserved) +
          " unreserved units of " +
          p.name +
          " are available in this branch.",
      );
    const sale = {
      id: queued
        ? "LOCAL-" + String(Date.now()).slice(-7)
        : "TXN-" + String(146 + state.sales.length - 3).padStart(4, "0"),
      product: p.id,
      quantity: qty,
      price,
      total: Math.round(qty * price * 100) / 100,
      time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: queued ? "Pending" : "Synced",
      staff: data.staff,
    };
    if (queued) {
      state.queue.push(sale);
      log("Queued sale", sale.id);
      navigate("offline");
      toast("Sale saved to this browser’s offline queue.");
    } else {
      state.lastSaleBefore = p.branchQty;
      p.branchQty -= qty;
      state.lastSaleAfter = p.branchQty;
      state.lastSale = sale;
      state.sales.push(sale);
      state.saleOffset += sale.total;
      log("Confirmed sale", sale.id);
      go("sale-done");
    }
  }
  const handlers = {
    login: async (d) => {
      try {
        const { token, user } = await api.login(d.username.trim(), d.password);
        api.setToken(token);
        state.user.name = user.name;
        state.user.username = user.username;
        state.user.role = user.role;
        state.user.branch = user.branch;
        save();
        navigate("overview");
      } catch (err) {
        toast(err.message);
      }
    },
    "workspace-sales": (d) => {
      state.user.branch = d.branch;
      state.user.shift = d.shift;
      state.user.role = "Sales Staff";
      save();
      navigate("sales");
    },
    "workspace-production": (d) => {
      state.user.branch = d.branch;
      state.user.role = d.role;
      save();
      navigate("inventory");
    },
    sale: (d) => commitSale(d),
    count: (d) => {
      state.counts = {
        empanada: integer(d.empanada, "Empanada count", true),
        roll: integer(d.roll, "Cheese roll count", true),
        loaf: integer(d.loaf, "Banana loaf count", true),
      };
      const q = state.counts.empanada,
        flag = state.discrepancies[0];
      flag.expected = product("PRD-001").branchQty;
      flag.actual = q;
      flag.variance = q - flag.expected;
      flag.resolved = flag.variance === 0;
      flag.status = flag.resolved ? "Matched" : "Owner pending";
      log("Physical count", JSON.stringify(state.counts));
      navigate("closing");
    },
    closing: (d) => {
      state.closingSubmitted = true;
      state.closingNote = d.note;
      log("Daily closing submitted", "CLOSE-1108");
      go("closing-done");
    },
    product: (d) => {
      const price = number(d.price, "Unit price", true),
        threshold = integer(d.threshold, "Threshold", true);
      const existing = state.products.find((p) => p.id === d.id),
        p = {
          ...existing,
          id: d.id.trim(),
          name: d.name.trim(),
          description: d.description,
          price,
          threshold,
          batch: d.batch,
          location: d.location,
          bestBefore: d.bestBefore,
        };
      if (existing) Object.assign(existing, p);
      else state.products.push({ ...p, quantity: 0, branchQty: 0, cost: 0 });
      selectedProduct = p.id;
      log("Product saved", p.id);
      navigate("inventory");
      toast("Product details saved.");
    },
    production: (d) => {
      const p = product(d.product),
        qty = integer(d.quantity, "Production quantity");
      p.quantity += qty;
      p.batch = d.batch;
      p.bestBefore = d.bestBefore;
      state.movements.push({
        time: "Now",
        type: "Production output",
        quantity: "+" + qty,
        product: p.id,
        staff: d.staff,
        reference:
          "PROD-" + String(state.movements.length + 9).padStart(3, "0"),
      });
      log("Production output", p.id + " +" + qty);
      navigate("inventory");
      toast(qty + " units added to main hub stock.");
    },
    stock: (d) => {
      const p = product(d.product),
        qty = integer(d.quantity, "Quantity", true),
        key = d.location === "Main hub" ? "quantity" : "branchQty";
      if (d.type === "Opening baseline") p[key] = qty;
      else p[key] += qty;
      state.movements.push({
        time: "Now",
        type: d.type,
        quantity: d.type === "Opening baseline" ? "Set " + qty : "+" + qty,
        product: p.id,
        staff: state.user.name,
        reference: d.reference,
      });
      log("Stock movement", d.reference);
      navigate("inventory");
      toast("Stock movement saved.");
    },
    dispatch: (d) => {
      const p = product(d.product),
        qty = integer(d.quantity, "Dispatch quantity");
      if (qty > p.quantity)
        throw Error(
          "Dispatch quantity exceeds available main hub stock (" +
            p.quantity +
            " units).",
        );
      const item = {
        id: "DSP-" + String(88 + state.dispatches.length - 3).padStart(4, "0"),
        branch: d.branch,
        batch: d.batch,
        product: p.id,
        quantity: qty,
        received: null,
        status: "In transit",
        date: d.date,
        staff: d.staff,
      };
      p.quantity -= qty;
      state.dispatches.unshift(item);
      selectedDispatch = item.id;
      state.movements.push({
        time: "Now",
        type: "Dispatch to " + d.branch,
        quantity: "−" + qty,
        product: p.id,
        staff: d.staff,
        reference: item.id,
      });
      log("Dispatch created", item.id);
      navigate("dispatch-detail?item=" + item.id);
    },
    receive: (d) => {
      const item = dispatch(),
        qty = integer(d.received, "Received quantity", true);
      if (item.received !== null)
        throw Error(
          "This dispatch already has a confirmed receipt. A second stock credit is prevented.",
        );
      if (qty > item.quantity)
        throw Error(
          "Received quantity cannot exceed dispatched quantity in this receipt flow.",
        );
      item.received = qty;
      item.status = qty === item.quantity ? "Received" : "Flagged";
      item.receiver = d.staff;
      item.note = d.note;
      product(item.product).branchQty += qty;
      const delta = qty - item.quantity;
      if (delta) {
        let flag = state.discrepancies.find((f) => f.id === "DISC-002");
        Object.assign(flag, {
          expected: item.quantity,
          actual: qty,
          variance: delta,
          status: "Delivery alert",
          resolved: false,
        });
      }
      log("Branch receipt confirmed", item.id + " +" + qty);
      go("receipt-done");
    },
    material: (d) => {
      if (state.materials.some((m) => m.id === d.id))
        throw Error("This material ID already exists. Use a unique ID.");
      const m = {
        id: d.id.trim(),
        name: d.name.trim(),
        description: d.description,
        unit: d.unit,
        supplier: d.supplier,
        cost: number(d.cost, "Unit cost", true),
        threshold: number(d.threshold, "Threshold", true),
        onHand: 0,
        opening: 0,
        received: 0,
        closing: 0,
        usage: 0,
      };
      state.materials.push(m);
      log("Material registered", m.id);
      navigate("supplies");
      toast("Material and threshold saved.");
    },
    "material-stock": (d) => {
      const m = material(d.material),
        qty = number(d.quantity, "Received quantity");
      m.onHand += qty;
      m.received += qty;
      m.cost = number(d.cost, "Unit cost", true);
      m.supplier = d.supplier;
      m.date = d.date;
      log("Material stock received", d.reference + " +" + qty + " " + m.unit);
      navigate("supplies");
      toast("Material delivery recorded.");
    },
    opening: (d) => {
      const m = material(d.material),
        qty = number(d.quantity, "Opening quantity", true);
      m.opening = qty;
      state.lastOpening = qty;
      log("Material shift opening", m.id + " " + qty);
      go("supply-opened");
    },
    usage: (d) => {
      const m = material(d.material),
        opening = number(d.opening, "Opening count", true),
        received = number(d.received, "Received count", true),
        closing = number(d.closing, "Closing count", true);
      if (closing > opening + received)
        throw Error(
          "Closing quantity cannot exceed opening plus received quantity.",
        );
      m.opening = opening;
      m.received = received;
      m.closing = closing;
      m.onHand = closing;
      m.usage = Math.round((opening + received - closing) * 1000) / 1000;
      state.lastUsage = { id: m.id, usage: m.usage };
      log("Material usage recorded", m.id + " " + m.usage);
      go("usage-done");
    },
    adjust: (d) => {
      const flag = state.discrepancies[0];
      if (flag.resolved)
        throw Error(
          "This discrepancy has already been resolved. A second adjustment is prevented.",
        );
      state.lastAdjustment = {
        before: product("PRD-001").branchQty,
        delta: flag.variance,
        after: Math.max(0, product("PRD-001").branchQty + flag.variance),
      };
      product("PRD-001").branchQty = state.lastAdjustment.after;
      flag.resolved = true;
      flag.status = "Resolved";
      flag.reason = d.reason;
      log(
        "Owner approved stock adjustment",
        flag.id + " " + flag.variance + " " + d.reason,
      );
      go("adjusted");
    },
    "delivery-resolve": (d) => {
      const item = dispatch(),
        qty = integer(d.received, "Verified received quantity", true);
      if (qty !== (item.received ?? 58))
        throw Error(
          "Verified quantity must match the recorded actual receipt. Use recount review to investigate a different quantity.",
        );
      const flag = state.discrepancies[1];
      flag.resolved = true;
      flag.status = "Resolved";
      flag.reason = d.reason;
      if (item.received !== null) item.status = "Received";
      log("Delivery discrepancy resolved", flag.id + " " + d.reason);
      go("delivery-resolved");
    },
    signoff: (d) => {
      if (state.discrepancies.some((f) => !f.resolved))
        throw Error(
          "Resolve all count and delivery discrepancies before weekly sign-off.",
        );
      if (!state.closingSubmitted)
        throw Error("Submit the daily closing before weekly sign-off.");
      state.weekSigned = true;
      state.signoffNote = d.note;
      log("Illustrative weekly audit sign-off", "AUD-2026-W45");
      go("signed");
    },
    baseline: (d) => {
      state.baseline = {
        ...state.counts,
        reference: d.reference,
        scope: d.scope,
      };
      log("Next opening baseline set", d.reference);
      go("baseline-saved");
    },
    account: (d) => {
      if (
        state.accounts.some((a) => a.id === d.id || a.username === d.username)
      )
        throw Error("Account ID or username already exists.");
      const a = {
        id: d.id.trim(),
        username: d.username.trim(),
        name: d.firstName.trim() + " " + d.surname.trim(),
        role: d.role,
        branch: d.branch,
        status: "Active",
      };
      state.accounts.push(a);
      selectedAccount = a.id;
      log("Demo account created", a.id);
      navigate("permissions?item=" + a.id);
    },
    permissions: (d) => {
      const a = state.accounts.find((a) => a.id === selectedAccount);
      if (a) a.role = d.role;
      state.permissions[selectedAccount] = Array.from(
        { length: 6 },
        (_, i) => d["perm" + i] === "on",
      );
      log("Demo account permissions saved", selectedAccount);
      navigate("accounts");
      toast("Account permissions saved.");
    },
    "report-filter": (d) => {
      state.reportScope = { date: d.date, branch: d.branch, type: d.type };
      state.scopeApplied = true;
      const route = {
        "Daily sales & stock summary": "summary",
        "Stock & reconciliation": "inventory-report",
        "Dispatch status": "dispatch-report",
        "Material usage & restock": "supply-report",
        "Weekly audit": "audits",
      }[d.type];
      state.activeReportRoute = route;
      save();
      navigate(route);
    },
  };
  function syncQueue() {
    if (!state.queue.length) {
      toast("No queued transactions remain.");
      return;
    }
    const totals = {};
    for (const s of state.queue)
      totals[s.product] = (totals[s.product] || 0) + s.quantity;
    for (const [id, qty] of Object.entries(totals))
      if (product(id).branchQty < qty)
        throw Error(
          "Insufficient branch stock to sync " +
            product(id).name +
            ". Review the queue.",
        );
    let count = 0;
    for (const s of state.queue) {
      if (state.sales.some((t) => t.localId === s.id)) continue;
      product(s.product).branchQty -= s.quantity;
      state.sales.push({
        ...s,
        localId: s.id,
        id: "TXN-" + String(146 + state.sales.length - 3).padStart(4, "0"),
        status: "Synced",
      });
      state.saleOffset += s.total;
      count++;
    }
    state.queue = [];
    state.lastSyncCount = count;
    log("Offline queue synchronized", count + " transactions");
    go("sync-done");
  }
  function exportCSV(type) {
    const scoped = scopeActive(current),
      branch = scopeBranch(),
      all = branch === "All branches";
    const ps = scoped
      ? !inSnapshot()
        ? []
        : all
          ? state.products
          : branch === "Main hub"
            ? state.products.filter((p) => p.location === "Main hub")
            : branch === "Main Street"
              ? state.products
              : []
      : state.products;
    const ds = scoped
      ? state.dispatches.filter(
          (d) =>
            d.date === state.reportScope.date && (all || d.branch === branch),
        )
      : state.dispatches;
    const ms =
      scoped && (!inSnapshot() || (!all && branch !== "Main hub"))
        ? []
        : state.materials;
    let rows;
    if (type === "inventory")
      rows = [
        [
          "Product",
          "Batch",
          "Location",
          "Quantity",
          "Branch quantity",
          "Threshold",
          "Best before",
        ],
        ...ps.map((p) => [
          p.name,
          p.batch,
          p.location,
          p.quantity,
          p.branchQty,
          p.threshold,
          p.bestBefore,
        ]),
      ];
    else if (type === "dispatch")
      rows = [
        ["Dispatch", "Branch", "Product", "Dispatched", "Received", "Status"],
        ...ds.map((d) => [
          d.id,
          d.branch,
          product(d.product).name,
          d.quantity,
          d.received ?? "",
          d.status,
        ]),
      ];
    else
      rows = [
        [
          "Material",
          "Opening",
          "Received",
          "Used",
          "Remaining",
          "Unit",
          "Threshold",
        ],
        ...ms.map((m) => [
          m.name,
          m.opening,
          m.received,
          m.usage,
          m.onHand,
          m.unit,
          m.threshold,
        ]),
      ];
    const safe = (v) => {
      let s = String(v ?? "");
      if (/^[=+@\t\r]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const csv = "\ufeff" + rows.map((r) => r.map(safe).join(",")).join("\r\n"),
      url = URL.createObjectURL(
        new Blob([csv], { type: "text/csv;charset=utf-8;" }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = "Elis-Kitchen-" + type + "-report.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("CSV report exported.");
  }
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("form[data-form]");
    if (!f) return;
    e.preventDefault();
    if (!f.reportValidity()) return;
    try {
      handlers[f.dataset.form]?.(readForm(f));
    } catch (err) {
      toast(err.message);
    }
  });
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-go]");
    if (link) {
      e.preventDefault();
      go(link.dataset.go);
      return;
    }
    const a = e.target.closest("[data-action]");
    if (!a) return;
    try {
      const name = a.dataset.action;
      if (name === "menu") {
        $(".sidebar")?.classList.toggle("open");
        return;
      }
      if (name === "queue-sale") {
        const f = a.closest("form");
        if (f.reportValidity()) commitSale(readForm(f), true);
      } else if (name === "sync") syncQueue();
      else if (name === "recount") {
        log("Recount requested", "DISC-001");
        toast("Recount requested. Enter the verified physical count.");
        navigate("count");
      } else if (name === "delivery-recount") {
        toast(
          "Check the original receipt and counted delivery before resolving.",
        );
        navigate("receive");
      } else if (name === "delete-account") {
        const account = state.accounts.find((a) => a.id === selectedAccount);
        if (account?.role === "Business Owner")
          throw Error(
            "The Business Owner account cannot be deleted from the staff account flow.",
          );
        state.accounts = state.accounts.filter((a) => a.id !== selectedAccount);
        state.lastDeleted = selectedAccount;
        delete state.permissions[selectedAccount];
        log("Demo account deleted", selectedAccount);
        go("account-deleted");
      } else if (name === "print") window.print();
      else if (name.startsWith("export-")) exportCSV(name.slice(7));
    } catch (err) {
      toast(err.message);
    }
  });
  document.addEventListener("input", (e) => {
    const f = e.target.closest("form");
    if (!f) return;
    if (f.dataset.form === "sale") {
      const d = readForm(f),
        p = product(d.product);
      if (e.target.name === "product")
        f.elements.price.value = p.price.toFixed(2);
      const qty = Number(f.elements.quantity.value) || 0,
        price = Number(f.elements.price.value) || 0;
      const v = f.querySelector(".metric-value");
      if (v) v.textContent = money(qty * price);
      const foot = f.querySelector(".metric-foot");
      if (foot) foot.textContent = qty + " × " + money(price);
      const m = $("#sale-movement");
      if (m) m.textContent = "Branch stock movement: −" + qty + " units";
    }
    if (f.dataset.form === "usage") {
      const d = readForm(f),
        used = Math.max(
          0,
          Number(d.opening) + Number(d.received) - Number(d.closing),
        );
      const vals = f.querySelectorAll(".metric-value");
      if (vals[0]) vals[0].textContent = used + " kg";
      if (vals[1]) vals[1].textContent = (Number(d.closing) || 0) + " kg";
    }
  });
  document.addEventListener("change", (e) => {
    const f = e.target.closest("form");
    if (f?.dataset.form === "usage" && e.target.name === "material") {
      const m = material(e.target.value);
      f.elements.opening.value = m.opening;
      f.elements.received.value = m.received;
      f.elements.closing.value = m.closing;
      f.elements.closing.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (cfg.dialogs.includes(current)) {
        navigate(dialogFrom || lastPage || "overview");
      }
      $(".sidebar")?.classList.remove("open");
    }
    if (e.key === "Enter" && e.target.matches("tr[data-go]"))
      go(e.target.dataset.go);
    if (e.key === "Tab" && cfg.dialogs.includes(current)) {
      const items = [
        ...document.querySelectorAll(
          ".dialog button,.dialog input,.dialog select,.dialog textarea,.dialog a",
        ),
      ].filter((x) => !x.disabled);
      if (items.length) {
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
  window.addEventListener("hashchange", render);
  // Explicit reset helper is available for development and the README's demo reset steps.
  window.resetKitchenDemo = () => {
    localStorage.removeItem(STORE);
    api.clearToken();
    state = clone(cfg.seed);
    navigate("login");
    render();
  };
  window.kitchenScreens = Object.keys(cfg.screens);
  render();
})();