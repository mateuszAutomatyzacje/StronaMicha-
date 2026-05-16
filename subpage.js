/* Lightweight subpage JS — quote modal + copy buttons only */
(function () {
  'use strict';

  function openQuoteModal() {
    var modal = document.getElementById('quote-modal');
    var status = document.getElementById('quote-copy-status');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('quote-modal-open');
    if (status) status.textContent = '';
  }

  function closeQuoteModal() {
    var modal = document.getElementById('quote-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('quote-modal-open');
  }

  document.addEventListener('click', function (event) {
    var opener = event.target.closest('[data-quote-open]');
    if (opener) {
      event.preventDefault();
      openQuoteModal();
      return;
    }
    var closer = event.target.closest('[data-quote-close]');
    if (closer) {
      event.preventDefault();
      closeQuoteModal();
      return;
    }
    var copyBtn = event.target.closest('[data-copy]');
    if (copyBtn) {
      event.preventDefault();
      var value = copyBtn.getAttribute('data-copy') || '';
      var status = document.getElementById('quote-copy-status');
      var done = function () { if (status) { status.textContent = 'Copied: ' + value; setTimeout(function () { status.textContent = ''; }, 2200); } };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = value; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeQuoteModal();
  });
})();
