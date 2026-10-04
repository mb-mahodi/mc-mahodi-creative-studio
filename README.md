# MC Mahodi Creative Studio

An interactive, responsive creative-studio landing page built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Full-screen video hero with mouse-controlled scrubbing
- Responsive desktop navigation and mobile menu
- Animated typewriter introduction and contact actions
- Six-step, copyable prompt guide for building the project
- Responsive layouts and reduced-motion support

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Getting started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Customization

- Change the agency name, contact email, navigation, page copy, and prompt guide in `src/App.tsx`.
- Replace the hero video URL in the `VIDEO_URL` constant in `src/App.tsx`.
- Update the page title, description, and font stylesheets in `index.html`.
- Adjust global fonts and styles in `src/index.css`; Tailwind settings are in `tailwind.config.js`.

## Publish to GitHub

Create an empty GitHub repository, then run these commands from the project directory:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/mb-mahodi/mc-mahodi-creative-studio.git
git push -u origin main
```

Do not commit access tokens, passwords, or other secrets.
