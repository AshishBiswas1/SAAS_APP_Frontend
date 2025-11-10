let _handler = null;

export function setToastHandler(fn) {
  _handler = fn;
}

export function showToast(message, type = 'info', opts = {}) {
  if (_handler) {
    try {
      _handler(message, type, opts);
    } catch (e) {
      // swallow
      // eslint-disable-next-line no-console
      console.warn('Toast handler error', e);
    }
  } else {
    // fallback to window alert if no handler
    try {
      window.alert(message);
    } catch (e) {
      // ignore
    }
  }
}

export default { setToastHandler, showToast };
