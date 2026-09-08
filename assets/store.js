/* Content layer.
   Reading: the data/*.js files that ship with the site.
   Writing: the admin panel commits those same files back through the GitHub API.
   Plain JavaScript, no build step, no server, no database. */
window.Store = (function () {
  const FALLBACK = {
    medium:   () => window.MEDIUM_ITEMS   || [],
    code:     () => window.CODE_PROJECTS  || [],
    thoughts: () => window.THOUGHTS_POSTS || []
  };
  const FILE = { medium: 'data/medium-items.js', code: 'data/code-projects.js', thoughts: 'data/thoughts-posts.js' };
  const VAR  = { medium: 'window.MEDIUM_ITEMS', code: 'window.CODE_PROJECTS', thoughts: 'window.THOUGHTS_POSTS' };
  const DRAFT = n => 'mikael_draft_' + n;
  const TOKEN = 'mikael_gh_token';
  const REPO   = () => window.GITHUB_REPO;
  const BRANCH = () => window.GITHUB_BRANCH || 'main';

  const token    = () => localStorage.getItem(TOKEN) || '';
  const setToken = t => t ? localStorage.setItem(TOKEN, t) : localStorage.removeItem(TOKEN);
  const configured = () => !!REPO();

  async function gh(path, opts = {}) {
    const res = await fetch('https://api.github.com/repos/' + REPO() + path, {
      ...opts,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: 'Bearer ' + token(),
        ...(opts.headers || {})
      }
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || res.status);
    return res.json();
  }

  /* who the token belongs to — also the sign-in check */
  async function whoami() {
    if (!token()) return null;
    const res = await fetch('https://api.github.com/user', {
      headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + token() }
    });
    if (!res.ok) return null;
    const u = await res.json();
    return { login: u.login, name: u.name, avatar: u.avatar_url };
  }

  /* pages read the shipped file; the admin panel may hold a newer draft */
  async function load(name) {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT(name)) || 'null');
      if (draft) return draft;
    } catch (e) {}
    return FALLBACK[name] ? FALLBACK[name]() : [];
  }

  const draft = (name, items) => localStorage.setItem(DRAFT(name), JSON.stringify(items));
  const clearDraft = name => localStorage.removeItem(DRAFT(name));
  const hasDraft = name => !!localStorage.getItem(DRAFT(name));

  function fileBody(name, items) {
    return '/* Content for the ' + name + ' page. Written by admin.html. */\n'
      + VAR[name] + ' = ' + JSON.stringify(items, null, 2) + ';\n';
  }
  const b64 = str => btoa(unescape(encodeURIComponent(str)));

  /* commit the data file — this is what publishes the site */
  async function publish(name, items, message) {
    if (!token()) return { ok: false, reason: 'no token' };
    const path = FILE[name];
    let sha = null;
    try {
      const meta = await gh('/contents/' + path + '?ref=' + BRANCH());
      sha = meta.sha;
    } catch (e) { /* new file */ }
    await gh('/contents/' + path, {
      method: 'PUT',
      body: JSON.stringify({
        message: message || 'content: update ' + name,
        content: b64(fileBody(name, items)),
        branch: BRANCH(),
        ...(sha ? { sha } : {})
      })
    });
    clearDraft(name);
    return { ok: true };
  }

  /* every publish is a commit, so history comes free */
  async function history(name) {
    if (!token()) return [];
    try {
      const commits = await gh('/commits?path=' + encodeURIComponent(FILE[name]) + '&sha=' + BRANCH() + '&per_page=20');
      return commits.map(c => ({
        sha: c.sha,
        date: c.commit.author.date,
        by: c.commit.author.name,
        message: c.commit.message
      }));
    } catch (e) { return []; }
  }

  async function restore(name, sha) {
    const meta = await gh('/contents/' + FILE[name] + '?ref=' + sha);
    const text = decodeURIComponent(escape(atob(meta.content.replace(/\n/g, ''))));
    const m = text.match(/=\s*([\s\S]*?);\s*$/);
    return JSON.parse(m ? m[1] : text);
  }

  return { configured, load, draft, clearDraft, hasDraft, publish, history, restore,
           token, setToken, whoami, fileBody };
})();
