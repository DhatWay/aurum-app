// AURUM auth guard — include on every page BEFORE the page's own script.
//
// Blocks the page until a valid Supabase session exists. This is not a
// cosmetic lock: after lock_database_auth.sql runs, Postgres itself refuses
// unauthenticated requests, so bypassing this screen in the browser gains
// nothing — every query would come back empty.
//
// Usage, immediately after the supabase CDN tag:
//   <script src="auth-guard.js"></script>

(function () {
  const SUPABASE_URL = 'https://zpcbbwynvvyldavxzjng.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_K80lcfk8LsQNqo5enznRRA_lrzf2U9K';

  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.error('AURUM auth guard: Supabase library not loaded.');
    return;
  }

  // Shared client so pages don't each open their own session
  window.aurumAuth = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  function renderLogin(message) {
    document.documentElement.style.background = '#080808';
    document.body.innerHTML =
      '<div style="position:fixed;inset:0;background:#080808;display:flex;align-items:center;justify-content:center;padding:1.5rem;z-index:9999;">' +
        '<div style="width:100%;max-width:360px;">' +
          '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:2.4rem;font-weight:300;color:#F0EDE6;letter-spacing:0.02em;margin-bottom:0.2rem;">AURUM</div>' +
          '<div style="font-family:\'IBM Plex Mono\',monospace;font-size:0.6rem;letter-spacing:0.3em;color:#C9A84C;margin-bottom:2.5rem;">PRIVATE INTELLIGENCE</div>' +
          '<input id="au-email" type="email" inputmode="email" autocomplete="username" placeholder="Email" ' +
            'style="width:100%;box-sizing:border-box;background:#0d0d0d;border:1px solid rgba(201,168,76,0.25);color:#F0EDE6;font-family:\'DM Sans\',sans-serif;font-size:0.95rem;padding:0.9rem 1rem;margin-bottom:0.7rem;outline:none;">' +
          '<input id="au-pass" type="password" autocomplete="current-password" placeholder="Password" ' +
            'style="width:100%;box-sizing:border-box;background:#0d0d0d;border:1px solid rgba(201,168,76,0.25);color:#F0EDE6;font-family:\'DM Sans\',sans-serif;font-size:0.95rem;padding:0.9rem 1rem;margin-bottom:1.2rem;outline:none;">' +
          '<button id="au-go" ' +
            'style="width:100%;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;font-family:\'DM Sans\',sans-serif;font-size:0.8rem;letter-spacing:0.2em;padding:0.9rem;cursor:pointer;">SIGN IN</button>' +
          '<div id="au-msg" style="font-family:\'IBM Plex Mono\',monospace;font-size:0.72rem;color:#8B3A3A;margin-top:1rem;min-height:1.2rem;line-height:1.5;">' + (message || '') + '</div>' +
        '</div>' +
      '</div>';

    const email = document.getElementById('au-email');
    const pass  = document.getElementById('au-pass');
    const btn   = document.getElementById('au-go');
    const msg   = document.getElementById('au-msg');

    async function attempt() {
      const e = email.value.trim();
      const p = pass.value;
      if (!e || !p) { msg.textContent = 'Enter your email and password.'; return; }

      btn.disabled = true;
      btn.textContent = 'SIGNING IN...';
      msg.textContent = '';

      try {
        const { error } = await window.aurumAuth.auth.signInWithPassword({ email: e, password: p });
        if (error) {
          msg.textContent = error.message || 'Sign in failed.';
          btn.disabled = false;
          btn.textContent = 'SIGN IN';
          return;
        }
        // Session is stored by the client; reload so the page boots normally
        location.reload();
      } catch (err) {
        msg.textContent = 'Sign in threw: ' + ((err && err.message) ? err.message : String(err));
        btn.disabled = false;
        btn.textContent = 'SIGN IN';
      }
    }

    btn.addEventListener('click', attempt);
    pass.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') attempt(); });
    email.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') pass.focus(); });
    setTimeout(() => email.focus(), 100);
  }

  // Hide content while the session is checked, so a protected page never
  // flashes on screen before the login replaces it.
  const style = document.createElement('style');
  style.id = 'au-hide';
  style.textContent = 'body{visibility:hidden;}';
  document.head.appendChild(style);

  function reveal() {
    const s = document.getElementById('au-hide');
    if (s) s.remove();
    document.body.style.visibility = 'visible';
  }

  window.aurumSignOut = async function () {
    try { await window.aurumAuth.auth.signOut(); } catch (e) {}
    location.reload();
  };

  // localStorage is where the session lives. Some PWA and private-browsing
  // contexts throw on access, which would break getSession() before any
  // network call happens — so check it explicitly and report it plainly.
  let storageOK = true;
  let storageErr = '';
  try {
    localStorage.setItem('__aurum_test', '1');
    localStorage.removeItem('__aurum_test');
  } catch (e) {
    storageOK = false;
    storageErr = e && e.message ? e.message : 'blocked';
  }

  function boot(msg) {
    const show = () => { reveal(); renderLogin(msg || ''); };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', show);
    } else {
      show();
    }
  }

  if (!storageOK) {
    boot('Browser storage is blocked (' + storageErr + '). A login cannot persist. '
       + 'If this is a private/incognito window or an in-app browser, open the site in normal Chrome.');
  } else {
    window.aurumAuth.auth.getSession().then((res) => {
      if (res && res.error) {
        boot('Session check failed: ' + (res.error.message || 'unknown'));
      } else if (res && res.data && res.data.session) {
        reveal();
      } else {
        boot('');
      }
    }).catch((err) => {
      boot('Session check threw: ' + ((err && err.message) ? err.message : String(err)));
    });
  }
})();
