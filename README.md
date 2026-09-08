# mikael — personal site

Five pages, one design language. Plain HTML, CSS and JavaScript — no build step,
no framework, no TypeScript. Free to host, free to run.

    index.html      ፩  the door
    work.html       ፪  a room full of people
    vibecode.html   ፫  code
    medium.html     ፬  a canvas of music, art, objects
    thoughts.html   ፭  a spine of writing
    kledyu.html         the moodboard canvas, public
    admin.html          edits medium, code and thoughts
    404.html

    assets/store.js     reads the data files, commits them back to github
    data/config.js      which repo to publish into
    data/*.js           fallback content
    images/             screenshots

## How content works

The `data/*.js` files **are** the content. The site reads them directly — no
database, no service, nothing to pay for.

The admin panel writes those same files back into this repo through the GitHub
API. Press **publish** and it commits; GitHub Pages rebuilds and the change is
live about a minute later. Every publish is an ordinary commit, so the version
history is just the git log — and **history** in the panel can restore any of the
last twenty.

## Connecting the admin panel

**1.** github.com → your avatar → **Settings** → **Developer settings** →
**Personal access tokens** → **Fine-grained tokens** → **Generate new token**.

**2.** Repository access → *Only select repositories* → `mikaelkorpi.github.io`.
Permissions → Repository permissions → **Contents: Read and write**. Nothing else.
Set an expiry you are comfortable with.

**3.** Copy the token. Open `/admin.html`, press **connect github**, paste it.

The token is kept in your browser only — never in the repo, never anywhere else.
If you lose the laptop, revoke it on GitHub and it is dead.

## Working

Edits are a **draft** in your browser; the dot on the publish button means there
is something unpublished. ⌘S saves the draft, ⌘Enter publishes.

Drafts are visible only to you: open `medium.html` in the same browser and you
see the draft, everyone else still sees the published file.

## Editing

`admin.html`, pick a section at the top.

- **medium** — music takes a Spotify link, everything else takes an image
- **code** — drop several screenshots at once, they rotate on the card;
  `need` / `what` / `learned` are the three lines
- **thoughts** — body is one HTML block per line:
  `<p>` `<h2>` `<blockquote>` `<ul><li>` `<figure>` `<em class="pull">`

Drag cards to reorder. ⌘S / Ctrl+S saves. **undo** steps back, **history**
restores any of the last 20 saved versions.

Images are shrunk to 1200 px JPEG automatically. The counter under the tabs
shows how big the section is — one section must stay under about 900 kB.

## Publishing

The repo is `mikaelkorpi.github.io`, so anything on `main` is live at
<https://mikaelkorpi.github.io> a minute or two after you push.

## Design language

    brick #C2432B    bone #F0E6D3    ink #1A1310
    Space Grotesk · Space Mono · Fraunces

Shared across pages: the wordmark with a brick dot on the i, a Ge'ez numeral top
right, hand-drawn shapes with a doubled second stroke, a dotted grid, a brick
wipe between pages, and the portrait — fifteen broken strokes redrawn with new
jitter on every load, so it is never twice the same. The bone tone warms slightly
after four in the afternoon.

No gradients, no glass, no shadows.
