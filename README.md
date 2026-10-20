# Matching Card Game

A Pokémon themed memory game built with Next.js, React, TypeScript, and Tailwind CSS 4. Flip two cards per move and find all six matching pairs. Your best score is saved in browser local storage.

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm start` serves the production build.
- `npm run lint` runs the Next.js ESLint checks.

## How to play

- Select a card to reveal its Pokémon.
- Select a second card to make a move. Matching pairs stay cleared; mismatched cards turn face down after a short pause.
- Find every pair to finish the game. Select **Restart** to play again.
- Use Tab to focus cards and Enter or Space to flip them.

The game is implemented in `app/page.tsx` and `components/MainComponent.tsx`; card presentation is in `components/Card.tsx`.
