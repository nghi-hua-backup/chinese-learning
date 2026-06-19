#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const KB_PATH = path.join(ROOT, 'chinese-learning/knowledge-base/chinese-brain.md');
const OUT_PATH = path.join(ROOT, 'chinese-learning/grammar-reference.html');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─── Color / label mappings ───────────────────────────────────────────────────

const FC_PARTICLES = new Set(['了', '的', '吗', '嗎', '吧', '呢', '嘛', '啊', '呀']);

const ABBREV_CLASS = {
  CN: 'fc-subject', TN: 'fc-noun', DT: 'fc-noun',
  ĐT: 'fc-verb', HDT: 'fc-adjective', HĐT: 'fc-adjective',
  PT: 'fc-neutral', A: 'fc-subject', B: 'fc-noun', Câu: 'fc-neutral',
};

const ABBREV_VI = {
  CN: 'Chủ ngữ', TN: 'Tân ngữ', DT: 'Danh từ',
  ĐT: 'Động từ', HDT: 'Tính từ', HĐT: 'Tính từ',
  PT: 'Phó từ', A: 'A', B: 'B', Câu: 'Câu',
};

// Pinyin for key characters shown in the left panel
const PINYIN_MAP = {
  '很': 'hěn', '太': 'tài', '了': 'le', '最': 'zuì', '的': 'de',
  '吗': 'ma', '嗎': 'ma', '不': 'bù',
  '什么': 'shénme', '什麼': 'shénme',
  '哪': 'nǎ',
  '怎么': 'zěnme', '怎麼': 'zěnme',
  '怎么样': 'zěnmeyàng', '怎麼樣': 'zěnmeyàng',
  '觉得': 'juéde', '覺得': 'juéde',
  '有': 'yǒu', '没有': 'méiyǒu', '沒有': 'méiyǒu',
  '别': 'bié', '別': 'bié', '不用': 'búyòng', '是': 'shì',
  '还': 'hái', '還': 'hái',
  '给': 'gěi', '給': 'gěi',
  '跟': 'gēn',
  '请': 'qǐng', '請': 'qǐng',
  '快': 'kuài', '在': 'zài', '住在': 'zhùzài',
  '知道': 'zhīdào', '去': 'qù', '走': 'zǒu', '吧': 'ba',
  '零下': 'língxià',
  '分钟': 'fēnzhōng', '分鐘': 'fēnzhōng', '分': 'fēn',
  '两': 'liǎng', '兩': 'liǎng', '二': 'èr',
  '边': 'biān', '邊': 'biān', '面': 'miàn',
  '中间': 'zhōngjiān', '中間': 'zhōngjiān',
  '太…了': 'tài … le', '去…走': 'qù … zǒu',
  '一下儿': 'yíxiàr', '一会儿': 'yíhuìr',
  '离合词': 'lí hé cí',
};

// ─── Chip class lookup ────────────────────────────────────────────────────────

function chipClass(token) {
  if (ABBREV_CLASS[token]) return ABBREV_CLASS[token];
  if (FC_PARTICLES.has(token)) return 'fc-particle';
  if (/[一-鿿]/.test(token)) return 'fc-key';
  return 'fc-neutral';
}

// ─── Key character extraction from formula ────────────────────────────────────

function extractCJKRuns(text) {
  const runs = [];
  let run = '';
  for (const ch of text) {
    if (/[一-鿿]/.test(ch)) {
      run += ch;
    } else {
      if (run) { runs.push(run); run = ''; }
    }
  }
  if (run) runs.push(run);
  return runs;
}

function extractKeyChar(formula) {
  const runs = extractCJKRuns(formula);
  if (!runs.length) return '';
  if (runs.length === 1) return runs[0];
  // Two single-char CJK runs → show with ellipsis (e.g. 太…了, 去…走)
  if (runs.length === 2 && runs.every(r => r.length === 1)) {
    return runs[0] + '…' + runs[1];
  }
  return runs[0]; // take longest or first
}

// ─── Formula chip parsing ─────────────────────────────────────────────────────

function makeChips(structLine) {
  if (!structLine) return [];
  // Strip trailing Vietnamese explanation (everything after →)
  const clean = structLine.split('→')[0].trim();
  return clean
    .split(/\s*\+\s*/)
    .flatMap(part => {
      // Remove punctuation and bracketing
      const raw = part.trim().replace(/[？！。，（）()\[\]【】…]/g, '');
      if (!raw) return [];
      // When token contains /, take first form (simplified)
      const token = raw.split('/')[0].trim();
      if (!token) return [];
      return [{ text: token, cls: chipClass(token) }];
    });
}

function makeFormulaVi(chips) {
  return chips.map(chip => {
    const vi = ABBREV_VI[chip.text];
    if (vi) return vi;
    if (/[一-鿿]/.test(chip.text)) {
      return `<strong>${esc(chip.text)}</strong>`;
    }
    return esc(chip.text);
  }).join(' + ');
}

// ─── Keyword highlighting in example sentences ────────────────────────────────

function highlightKey(chinese, keyChar) {
  if (!keyChar || keyChar === '—') return esc(chinese);
  // Split ellipsis pattern into individual parts to highlight each
  const parts = keyChar.includes('…') ? keyChar.split('…') : [keyChar];
  let result = esc(chinese);
  for (const ch of parts) {
    if (!ch) continue;
    const safe = ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(safe, 'g'), `<span class="kw">${esc(ch)}</span>`);
  }
  return result;
}

// ─── Example bullet parsing ───────────────────────────────────────────────────

// Matches: - <Chinese> /pinyin/ — <Vietnamese>
// The lazy (.+?) before space+/ is needed so the optional "simp / trad" separator
// (which uses bare /) does not confuse the pinyin delimiter
const EXAMPLE_RE = /^- (.+?) \/([^/]+)\/ — (.+)$/;

function parseExamples(patternText) {
  const examples = [];
  for (const line of patternText.split('\n')) {
    const m = line.match(EXAMPLE_RE);
    if (!m) continue;

    let chineseRaw = m[1].trim();
    const pinyin = m[2].trim();
    const vietnamese = m[3].trim();

    // "original → derived" format (离合词 section): take after →
    if (chineseRaw.includes('→')) {
      chineseRaw = chineseRaw.split('→').pop().trim();
    }

    // Split simplified / traditional on " / "
    const cparts = chineseRaw.split(/\s*\/\s*/);
    const simp = cparts[0].trim();
    const tradRaw = cparts.length > 1 ? cparts[cparts.length - 1].trim() : simp;
    // "—" placeholder means trad == simp
    const trad = (!tradRaw || tradRaw === '—' || tradRaw === '-') ? simp : tradRaw;

    examples.push({ simp, trad, pinyin, vietnamese });
  }
  return examples;
}

// ─── Pattern parsing ──────────────────────────────────────────────────────────

function extractStructLine(patternText) {
  // Match **Cấu trúc:** or **Cấu trúc hỏi:** or **Cấu trúc 1 (...):**  etc.
  const m = patternText.match(/\*\*Cấu trúc[^:]*:\*\*[ ]*(.*)/);
  if (!m) return null;
  let content = m[1].trim();
  if (!content) {
    // Multi-line variant: grab first sub-bullet
    const pos = patternText.indexOf(m[0]);
    const after = patternText.slice(pos + m[0].length);
    const bm = after.match(/\n- ([^\n]+)/);
    if (bm) content = bm[1].split('→')[0].trim();
  }
  return content || null;
}

function parsePattern(text, groupNum, patNum) {
  const nl = text.indexOf('\n');
  const headingLine = (nl >= 0 ? text.slice(0, nl) : text).trim();

  // Split "formula — subtitle"
  const dashIdx = headingLine.indexOf(' — ');
  const formula = (dashIdx >= 0 ? headingLine.slice(0, dashIdx) : headingLine).trim();
  const subtitle = (dashIdx >= 0 ? headingLine.slice(dashIdx + 3) : '').trim();

  // Structure line → formula chips
  const structLine = extractStructLine(text);
  const chips = makeChips(structLine || formula);
  const formulaVi = chips.length ? makeFormulaVi(chips) : esc(subtitle);

  // Giải thích: take first sentence, strip markdown bold
  const giaiThichM = text.match(/\*\*Giải thích:\*\*[ ]*([^\n]+)/);
  let giaiThich = giaiThichM ? giaiThichM[1].trim() : '';
  // Convert **text** → text
  giaiThich = giaiThich.replace(/\*\*([^*]+)\*\*/g, '$1');
  // Limit to first sentence (stop at first period/semicolon followed by space or end)
  const sentEnd = giaiThich.search(/[.；。][  ]|[.；。]$/);
  if (sentEnd > 10) giaiThich = giaiThich.slice(0, sentEnd + 1).trim();
  // Hard cap at 160 chars
  if (giaiThich.length > 160) giaiThich = giaiThich.slice(0, 160).trimEnd() + '…';

  const examples = parseExamples(text);

  // Key character for the left panel
  let keyChar = extractKeyChar(formula);
  if (!keyChar && structLine) keyChar = extractKeyChar(structLine);

  return {
    meta: `Ngữ pháp ${groupNum}.${patNum}`,
    formula,
    subtitle,
    giaiThich,
    examples,
    keyChar: keyChar || '—',
    keyPinyin: PINYIN_MAP[keyChar] || '',
    keyMeaning: subtitle,
    chips,
    formulaVi,
  };
}

function parseKB(kbText) {
  const start = kbText.indexOf('\n## 5. Ngữ pháp');
  const end = kbText.indexOf('\n## 6.', start);
  const section = kbText.slice(start + 1, end > 0 ? end : undefined);

  return section.split(/\n### Nhóm /).slice(1).map((chunk, gi) => {
    const nl = chunk.indexOf('\n');
    const groupName = 'Nhóm ' + chunk.slice(0, nl).trim();
    const body = chunk.slice(nl);
    const patterns = body
      .split(/\n#### /)
      .slice(1)
      .map((p, pi) => parsePattern(p, gi + 1, pi + 1));
    return { name: groupName, patterns };
  });
}

// ─── HTML generation ──────────────────────────────────────────────────────────

function exampleRowHtml(ex, keyChar) {
  const simp = highlightKey(ex.simp, keyChar);
  const sameScript = ex.simp === ex.trad;
  const tradHtml = sameScript
    ? ''
    : `\n              <span class="trad">${highlightKey(ex.trad, keyChar)}</span>`;
  return `
          <div class="example-row">
            <div class="pinyin">${esc(ex.pinyin)}</div>
            <div class="chinese">
              <span class="simp">${simp}</span>${tradHtml}
            </div>
            <div class="translation">${esc(ex.vietnamese)}</div>
          </div>`;
}

function patternCardHtml(p) {
  const keyLen = [...p.keyChar].length; // Unicode-aware length for font sizing
  const keyLenAttr = keyLen >= 3 ? ` data-len="${keyLen}"` : '';

  const chipsHtml = p.chips.length
    ? p.chips
        .map((chip, i) =>
          (i === 0 ? '' : '<span class="fc-op">+</span>') +
          `<span class="fc ${chip.cls}">${esc(chip.text)}</span>`)
        .join('')
    : `<span class="fc fc-neutral">${esc(p.formula)}</span>`;

  const examplesHtml = p.examples.length
    ? p.examples.map(ex => exampleRowHtml(ex, p.keyChar)).join('')
    : `\n          <div class="no-examples">—</div>`;

  return `    <div class="pattern-card">
      <div class="formula-header">
        <div class="formula-meta">${esc(p.meta)}</div>
        <div class="formula-row">${chipsHtml}</div>
        <div class="formula-vi">${p.formulaVi}</div>${p.giaiThich ? `
        <div class="formula-note">${esc(p.giaiThich)}</div>` : ''}
      </div>
      <div class="card-body">
        <div class="left-panel">${p.keyPinyin ? `
          <div class="key-pinyin">${esc(p.keyPinyin)}</div>` : ''}
          <div class="key-char"${keyLenAttr}>${esc(p.keyChar)}</div>${p.keyMeaning ? `
          <div class="key-meaning">${esc(p.keyMeaning)}</div>` : ''}
        </div>
        <div class="examples-panel">${examplesHtml}
        </div>
      </div>
    </div>`;
}

function groupSectionHtml(group) {
  return `  <div class="lesson-section">
    <div class="group-title">${esc(group.name)}</div>
${group.patterns.map(patternCardHtml).join('\n')}
  </div>`;
}

// ─── Embedded CSS (from agreed prototype design) ──────────────────────────────

const CSS = `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
      background: #f5f3ef;
      color: #1a1a1a;
      padding: 36px 32px;
      max-width: 1000px;
      margin: 0 auto;
    }

    /* ── Header ── */
    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 40px;
      padding-bottom: 18px;
      border-bottom: 2px solid #ddd9d2;
    }

    .title-zh {
      font-size: 32px;
      font-weight: 800;
      color: #111;
      letter-spacing: -0.5px;
    }

    .title-vi {
      font-size: 14px;
      color: #999;
      margin-top: 5px;
      font-weight: 400;
    }

    .toggle-btn {
      background: white;
      border: 1.5px solid #c9c4bc;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      color: #555;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .toggle-btn:hover {
      border-color: #7c3aed;
      color: #7c3aed;
      background: #faf8ff;
    }

    /* ── Group header ── */
    .group-title {
      font-size: 20px;
      font-weight: 700;
      color: #4b5563;
      margin-bottom: 20px;
      padding: 10px 16px;
      background: linear-gradient(90deg, #ede9fe 0%, transparent 100%);
      border-left: 4px solid #7c3aed;
      border-radius: 4px;
    }

    .lesson-section { margin-bottom: 48px; }

    /* ── Pattern card ── */
    .pattern-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.04);
      margin-bottom: 28px;
      overflow: hidden;
    }

    /* ── Formula header ── */
    .formula-header {
      padding: 24px 32px 20px;
      border-bottom: 2px solid #f0ede8;
      background: #fefefe;
    }

    .formula-meta {
      font-size: 11px;
      font-weight: 700;
      color: #bbb5ad;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .formula-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }

    .fc {
      font-size: 28px;
      font-weight: 800;
      line-height: 1;
    }

    .fc-subject   { color: #2563eb; }
    .fc-key       { color: #dc2626; }
    .fc-adjective { color: #92400e; }
    .fc-particle  { color: #1d4ed8; }
    .fc-noun      { color: #16a34a; }
    .fc-verb      { color: #0d9488; }
    .fc-place     { color: #d97706; }
    .fc-neutral   { color: #374151; }

    .fc-op {
      font-size: 24px;
      font-weight: 700;
      color: #ccc5bb;
      line-height: 1;
    }

    .formula-vi {
      font-size: 18px;
      color: #6d28d9;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .formula-note {
      font-size: 18px;
      color: #b45309;
      font-style: italic;
    }

    /* ── Card body ── */
    .card-body {
      display: flex;
      position: relative;
      min-height: 200px;
    }

    /* ── Left panel ── */
    .left-panel {
      width: 200px;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      background: #fdfcfb;
      border-right: 2px solid #f0ede8;
      position: relative;
      z-index: 1;
      gap: 8px;
    }

    .key-pinyin {
      font-size: 13px;
      color: #a0998e;
      font-style: italic;
      text-align: center;
      letter-spacing: 0.5px;
    }

    .key-char {
      font-size: 56px;
      font-weight: 900;
      color: #dc2626;
      text-align: center;
      line-height: 1;
      letter-spacing: -2px;
    }

    /* Smaller font for 3-char key elements (e.g. 太…了) */
    .key-char[data-len="3"] { font-size: 42px; }
    .key-char[data-len="4"] { font-size: 34px; }
    .key-char[data-len="5"],
    .key-char[data-len="6"] { font-size: 26px; }

    .key-meaning {
      font-size: 13px;
      color: #6b6560;
      text-align: center;
      font-weight: 600;
    }

    /* ── Examples panel ── */
    .examples-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 52px; /* room for SVG fan arrows */
      position: relative;
      z-index: 1;
    }

    .example-row {
      padding: 18px 28px 18px 0;
      border-bottom: 1px solid #f7f5f3;
    }

    .example-row:last-child { border-bottom: none; }

    .no-examples {
      padding: 32px;
      color: #ccc5bb;
      font-size: 24px;
      text-align: center;
    }

    .pinyin {
      font-size: 14px;
      color: #b8b0a6;
      margin-bottom: 2px;
      font-style: italic;
      letter-spacing: 0.4px;
    }

    .chinese {
      font-size: 36px;
      font-weight: 600;
      color: #111827;
      line-height: 1.25;
      margin-bottom: 4px;
    }

    /* Keyword spans in examples */
    .kw      { color: #dc2626; font-weight: 900; }
    .kw-blue { color: #1d4ed8; font-weight: 900; }
    .kw-subj { color: #2563eb; font-weight: 700; }
    .kw-noun { color: #16a34a; font-weight: 700; }

    .translation {
      font-size: 15px;
      color: #6b6560;
    }

    /* ── Script toggle ── */
    .trad { display: none; }
    body.traditional .simp { display: none; }
    body.traditional .trad { display: inline; }

    /* ── SVG arrow canvas ── */
    svg.arrows {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: visible;
      z-index: 0;
    }
`;

// ─── Embedded JS (SVG fan arrows + script toggle) ─────────────────────────────

const JS = `
    let arrowCounter = 0;

    function drawArrows() {
      document.querySelectorAll('.card-body').forEach(body => {
        body.querySelectorAll('svg.arrows').forEach(s => s.remove());

        const leftPanel = body.querySelector('.left-panel');
        const rows = body.querySelectorAll('.example-row');
        if (!rows.length) return;

        const bodyRect = body.getBoundingClientRect();
        const leftRect = leftPanel.getBoundingClientRect();

        const srcX = leftRect.width;
        const srcY = (leftRect.top - bodyRect.top) + leftRect.height / 2;

        const markerId = 'arrowhead-' + (arrowCounter++);

        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.classList.add('arrows');
        svg.setAttribute('width', body.offsetWidth);
        svg.setAttribute('height', body.offsetHeight);

        const defs = document.createElementNS(svgNS, 'defs');
        const marker = document.createElementNS(svgNS, 'marker');
        marker.setAttribute('id', markerId);
        marker.setAttribute('markerWidth', '8');
        marker.setAttribute('markerHeight', '8');
        marker.setAttribute('refX', '6');
        marker.setAttribute('refY', '4');
        marker.setAttribute('orient', 'auto');
        const tip = document.createElementNS(svgNS, 'polygon');
        tip.setAttribute('points', '0 0, 8 4, 0 8');
        tip.setAttribute('fill', '#c8bfb4');
        marker.appendChild(tip);
        defs.appendChild(marker);
        svg.appendChild(defs);

        rows.forEach(row => {
          const rowRect = row.getBoundingClientRect();
          const dstX = leftRect.width + 30;
          const dstY = (rowRect.top - bodyRect.top) + rowRect.height / 2;

          const line = document.createElementNS(svgNS, 'line');
          line.setAttribute('x1', srcX);
          line.setAttribute('y1', srcY);
          line.setAttribute('x2', dstX);
          line.setAttribute('y2', dstY);
          line.setAttribute('stroke', '#c8bfb4');
          line.setAttribute('stroke-width', '1.5');
          line.setAttribute('marker-end', 'url(#' + markerId + ')');
          svg.appendChild(line);
        });

        body.appendChild(svg);
      });
    }

    function toggleScript(btn) {
      document.body.classList.toggle('traditional');
      const isTraditional = document.body.classList.contains('traditional');
      btn.textContent = isTraditional ? 'Giản thể ⇄ Phồn thể' : 'Phồn thể ⇄ Giản thể';
    }

    window.addEventListener('load', drawArrows);
    window.addEventListener('resize', drawArrows);
`;

// ─── Full HTML assembly ───────────────────────────────────────────────────────

function buildHtml(groups) {
  const totalPatterns = groups.reduce((s, g) => s + g.patterns.length, 0);
  const generatedAt = new Date().toISOString().slice(0, 10);
  const body = groups.map(groupSectionHtml).join('\n\n');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ngữ pháp Tiếng Trung — Tài liệu tham khảo</title>
  <!-- Generated ${generatedAt} by scripts/generate-grammar-html.js — ${totalPatterns} patterns — do not edit by hand -->
  <style>${CSS}
  </style>
</head>
<body>

  <header>
    <div>
      <div class="title-zh">语法参考</div>
      <div class="title-vi">Tài liệu tham khảo Ngữ pháp Tiếng Trung</div>
    </div>
    <button class="toggle-btn" onclick="toggleScript(this)">Phồn thể ⇄ Giản thể</button>
  </header>

${body}

  <script>${JS}
  </script>

</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const kbText = fs.readFileSync(KB_PATH, 'utf8');
const groups = parseKB(kbText);
const html = buildHtml(groups);
fs.writeFileSync(OUT_PATH, html, 'utf8');

const totalPatterns = groups.reduce((s, g) => s + g.patterns.length, 0);
console.log(`✓ Generated ${path.relative(process.cwd(), OUT_PATH)}`);
console.log(`  ${groups.length} groups, ${totalPatterns} patterns`);
groups.forEach(g => console.log(`  ${g.name}: ${g.patterns.length} patterns`));
