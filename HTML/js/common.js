/* Shared helpers for the landing page and role pages (no dependencies). */
(function () {
  'use strict';

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** Escape text for safe HTML interpolation. */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ESC[c]);
  }

  /** Simulated network latency so loading states are visible. */
  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms == null ? 250 : ms));
  }

  /** Deep clone of plain JSON-able data. */
  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  /** Persist small bits of state (safe if storage is blocked). */
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('dpdp.' + key);
        return v == null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('dpdp.' + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
  };

  /**
   * Open a modal. `html` is the inner markup (use .modal-head etc.).
   * Returns { close, root }. Closes on backdrop click, Escape, or any [data-close].
   */
  function openModal(html, opts) {
    const root = document.createElement('div');
    root.className = 'modal-backdrop';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.innerHTML = '<div class="modal' + (opts && opts.wide ? ' wide' : '') + '">' + html + '</div>';
    document.body.appendChild(root);
    const prevFocus = document.activeElement;
    function close() {
      document.removeEventListener('keydown', onKey);
      root.remove();
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    root.addEventListener('click', (e) => {
      if (e.target === root || e.target.closest('[data-close]')) close();
    });
    const first = root.querySelector('button, input, select, textarea, a[href]');
    if (first) first.focus();
    return { close, root };
  }

  /** Trigger a client-side download of a JSON/text blob. */
  function download(filename, text, mime) {
    const blob = new Blob([text], { type: mime || 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /** Hex SHA-256 of a string (falls back to a simple hash if SubtleCrypto is unavailable). */
  async function sha256(text) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      let h = 5381;
      for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
      return (h >>> 0).toString(16).padStart(8, '0').repeat(8);
    }
  }

  function fmtDate(d) {
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }

  window.DPDP = { esc, delay, clone, store, openModal, download, sha256, fmtDate };
})();
