/* The contact payload is randomized by tools/set-contact.mjs. */
(() => {
  'use strict';
  // CONTACT_PAYLOAD_START
  const contactPayload = {"key":[254,202,145,79,137,128,222,128,240,117,120,236,40,40,104,98,155,153,62,160,239,205,250],"value":[144,163,250,39,224,236,187,243,152,53,27,131,69,88,29,14,242,254,86,212,193,174,149]};
  // CONTACT_PAYLOAD_END

  const dialog = document.querySelector('#contact-dialog');
  const emailField = document.querySelector('#email-address');
  const emailLink = document.querySelector('#open-email');
  const copyButton = document.querySelector('#copy-email');
  const status = document.querySelector('#contact-status');
  let opener;
  let pendingCopy = 0;

  function decodeEmail() {
    return String.fromCharCode(...contactPayload.value.map((byte, i) => byte ^ contactPayload.key[i]));
  }

  function openContact(event) {
    opener = event.currentTarget;
    const address = decodeEmail();
    emailField.value = address;
    emailLink.href = `mailto:${address}?subject=${encodeURIComponent('Hello Compulight')}`;
    status.textContent = '';
    copyButton.textContent = 'Copy email address';
    dialog.showModal();
    copyButton.focus();
  }

  document.querySelectorAll('[data-contact]').forEach(button => {
    button.addEventListener('click', openContact);
    button.hidden = false;
  });
  document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button, input, a[href]')];
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    // Ignore a queued close event if the visitor has already reopened the dialog.
    if (dialog.open) return;
    pendingCopy++;
    emailField.value = '';
    emailLink.removeAttribute('href');
    status.textContent = '';
    opener?.focus();
  });

  copyButton.addEventListener('click', async () => {
    const copyId = ++pendingCopy;
    const address = emailField.value;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(address);
      if (copyId !== pendingCopy || !dialog.open) return;
      copyButton.textContent = 'Copied!';
      status.textContent = 'Email address copied. Paste it into your preferred email app.';
    } catch {
      if (copyId !== pendingCopy || !dialog.open) return;
      emailField.focus();
      emailField.select();
      status.textContent = 'Select and copy the address above, or choose “Open email app”.';
    }
  });
  emailLink.addEventListener('click', () => {
    status.textContent = 'Your device will open its configured email app. You can also copy the address.';
  });
  document.querySelector('#year').textContent = String(new Date().getFullYear());
})();
