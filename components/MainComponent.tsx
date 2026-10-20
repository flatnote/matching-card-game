"use client";

import Card from "@/components/Card";
import { CardInterface } from "@/types/card";
import { useCallback, useEffect, useRef, useState } from "react";

import BulbasaurImage from "@/public/images/Bulbasaur.jpeg";
import ButterFreeImage from "@/public/images/ButterFree.jpeg";
import CharmanderImage from "@/public/images/Charmander.jpeg";
import PickachuImage from "@/public/images/Pickachu.png";
import PidgettoImage from "@/public/images/Pidgetto.jpeg";
import SquirtleImage from "@/public/images/Squirtle.jpeg";
import { shuffleCards } from "@/utils/fisher-yates-shuffle";

const MainComponent = () => {
  const [uniqueCardsArray, setUniqueCardsArray] = useState<CardInterface[]>([]);
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [openCards, setOpenCards] = useState<number[]>([]);
  const [clearedCards, setClearedCards] = useState<Record<string, boolean>>({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = useCallback(() => {
    if (
      Object.keys(clearedCards).length === uniqueCardsArray.length &&
      uniqueCardsArray.length !== 0
    ) {
      setShowModal(true);
      const highScore = Math.min(moves, bestScore ?? Number.POSITIVE_INFINITY);
      setBestScore(highScore);
      localStorage.setItem("bestScore", highScore.toString());
    }
  }, [bestScore, clearedCards, moves, uniqueCardsArray.length]);

  // Check if both the cards have same type. If they do, mark them inactive
  const evaluate = useCallback(() => {
    const [first, second] = openCards;
    if (cards[first].type === cards[second].type) {
      setClearedCards((prev) => ({ ...prev, [cards[first].type]: true }));
      setOpenCards([]);
      enable();
      return;
    }
    // Keep the board locked until the mismatched cards have flipped back.
    timeout.current = setTimeout(() => {
      setOpenCards([]);
      enable();
      timeout.current = null;
    }, 500);
  }, [cards, openCards]);

  const handleCardClick = (index: number) => {
    if (shouldDisableAllCards || clearedCards[cards[index]?.type]) return;

    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      setOpenCards([index]);
    }
  };

  const setUpDefaultImages = () => {
    const uniqueCardsArray: CardInterface[] = [
      {
        type: "Pikachu",
        image: PickachuImage,
      },
      {
        type: "ButterFree",
        image: ButterFreeImage,
      },
      {
        type: "Charmander",
        image: CharmanderImage,
      },
      {
        type: "Squirtle",
        image: SquirtleImage,
      },
      {
        type: "Pidgetto",
        image: PidgettoImage,
      },
      {
        type: "Bulbasaur",
        image: BulbasaurImage,
      },
    ];
    setUniqueCardsArray(uniqueCardsArray);
    setCards(shuffleCards(uniqueCardsArray.concat(uniqueCardsArray)));
  };

  useEffect(() => {
    setUpDefaultImages();
  }, []);

  useEffect(() => {
    let evaluationTimeout: ReturnType<typeof setTimeout> | null = null;
    if (openCards.length === 2) {
      evaluationTimeout = setTimeout(evaluate, 300);
    }
    return () => {
      if (evaluationTimeout) {
        clearTimeout(evaluationTimeout);
      }
    };
  }, [evaluate, openCards]);

  const setUpDefaultBestScore = () => {
    const defaultBestScore = localStorage.getItem("bestScore");
    if (defaultBestScore !== null) {
      const parsedBestScore = Number(defaultBestScore);
      if (Number.isSafeInteger(parsedBestScore) && parsedBestScore > 0) {
        setBestScore(parsedBestScore);
      }
    }
  };

  useEffect(() => {
    setUpDefaultBestScore();
  }, []);

  useEffect(() => {
    checkCompletion();
  }, [checkCompletion, clearedCards]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (showModal && !dialog.open) {
      dialog.showModal();
    } else if (!showModal && dialog.open) {
      dialog.close();
    }
  }, [showModal]);

  const checkIsFlipped = (index: number) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card: CardInterface) => {
    return Boolean(clearedCards[card.type]);
  };

  const handleRestart = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    // set a shuffled deck of cards
    setCards(shuffleCards(uniqueCardsArray.concat(uniqueCardsArray)));
  };

  const pairsFound = Object.keys(clearedCards).length;
  const progress = uniqueCardsArray.length
    ? (pairsFound / uniqueCardsArray.length) * 100
    : 0;

  return (
      <main className="game-shell min-h-screen">
        <div className="game-container">
          <header className="topbar">
            <a className="brand" href="#game" aria-label="Pokémon Memory home">
              <span className="brand-symbol" aria-hidden="true">
                ✦
              </span>
              <span>
                POKÉMON <b>MEMORY CLUB</b>
              </span>
            </a>
            <div className="challenge-tag">
              <span /> TRAINER CHALLENGE&nbsp; / &nbsp;01
            </div>
          </header>

          <section className="intro" aria-labelledby="game-title">
            <div className="intro-copy">
              <p className="eyebrow">A LITTLE TEST OF YOUR MEMORY</p>
              <h1 id="game-title">
                Memory <span>Master</span>
              </h1>
              <p className="intro-description">
                Find every Pokémon pair. Choose two cards each turn and see how
                many moves it takes to complete your collection.
              </p>
            </div>
            <div
              className="collection-card"
              aria-label={`${pairsFound} of ${uniqueCardsArray.length} pairs found`}
            >
              <div className="collection-heading">
                <span>YOUR COLLECTION</span>
                <span aria-hidden="true">✦</span>
              </div>
              <div className="collection-count">
                <strong>{pairsFound.toString().padStart(2, "0")}</strong>
                <span>
                  / {uniqueCardsArray.length.toString().padStart(2, "0")} PAIRS
                </span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-label="Pairs found"
                aria-valuemin={0}
                aria-valuemax={uniqueCardsArray.length}
                aria-valuenow={pairsFound}
                aria-valuetext={`${pairsFound} of ${uniqueCardsArray.length} pairs found`}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          </section>

          <section className="game-panel" id="game" aria-label="Matching card game">
            <div className="board-heading">
              <div>
                <span className="live-dot" /> THE FIELD
              </div>
              <span>12 CARDS <i>·</i> 6 PAIRS</span>
            </div>
            <div className="board-grid">
              {cards.map((card: CardInterface, index: number) => (
                <Card
                  key={index}
                  card={card}
                  index={index}
                  isDisabled={shouldDisableAllCards}
                  isInactive={checkIsInactive(card)}
                  isFlipped={checkIsFlipped(index)}
                  label={`Card ${index + 1}`}
                  onClick={handleCardClick}
                />
              ))}
            </div>
            <footer className="game-footer">
              <div className="score-strip" aria-live="polite">
                <div className="score-item">
                  <span className="score-icon moves-icon" aria-hidden="true">
                    ↗
                  </span>
                  <span className="score-label">MOVES</span>
                  <strong>{moves.toString().padStart(2, "0")}</strong>
                </div>
                <div className="score-divider" />
                <div className="score-item">
                  <span className="score-icon best-icon" aria-hidden="true">
                    ✦
                  </span>
                  <span className="score-label">BEST</span>
                  <strong>{bestScore ?? "—"}</strong>
                </div>
                <div className="score-divider" />
                <div className="score-item">
                  <span className="score-icon pairs-icon" aria-hidden="true">
                    ◉
                  </span>
                  <span className="score-label">PAIRS</span>
                  <strong>
                    {pairsFound}
                    <small> / {uniqueCardsArray.length}</small>
                  </strong>
                </div>
              </div>
              <button className="restart-button focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" onClick={handleRestart} type="button">
                <span aria-hidden="true">↻</span> NEW GAME
              </button>
            </footer>
          </section>
          <p className="game-hint">
            <span aria-hidden="true">✦</span> A good trainer remembers every
            encounter.
          </p>
        </div>

        <dialog
          ref={dialogRef}
          className="win-dialog w-[min(92vw,28rem)] rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-100 shadow-2xl backdrop:bg-slate-950/75"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onCancel={(event) => event.preventDefault()}
        >
          <h2 id="alert-dialog-title">Collection complete!</h2>
          <p id="alert-dialog-description">
              You found every pair in {moves} moves. Your best score is {bestScore} moves.
          </p>
          <div className="dialog-actions">
            <button
              className="restart-button dialog-restart focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              onClick={handleRestart}
              type="button"
            >
              <span aria-hidden="true">↻</span> PLAY AGAIN
            </button>
          </div>
        </dialog>
      </main>
  );
};

export default MainComponent;
