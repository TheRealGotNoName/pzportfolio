# Portfolio Site — Bare Bones

Plain HTML/CSS/JS, no build step. 5 pages: home, personal projects, school
projects, resume, contact.

## Structure
```
index.html
personal-projects.html
school-projects.html
resume.html
contact.html
css/style.css
js/script.js
resume.pdf        (add your own — linked from resume.html)
```

## Edit first
- Swap bracketed placeholders `[like this]` in every page.
- `contact.html` / `js/script.js`: replace `your.email@wisc.edu` and the
  GitHub/LinkedIn placeholder links.
- Drop your real `resume.pdf` in the root folder.
- Add more project cards by copying an existing `.card` block.

## Put it online for free — GitHub Pages
1. Create a new GitHub repo, e.g. `yourusername.github.io` (use exactly that
   name to get a root-level URL) — or any repo name if you're fine with a
   `/repo-name/` subpath.
2. Push these files to the repo's default branch.
3. In the repo: **Settings → Pages → Source → Deploy from branch**, pick
   `main` and `/ (root)`, save.
4. Your site is live at `https://yourusername.github.io` (or
   `https://yourusername.github.io/repo-name`) within a minute or two.

Alternative if you'd rather not use GitHub Pages: Netlify or Vercel both
support "drag the folder in" style deploys and are free for a static site
like this.
