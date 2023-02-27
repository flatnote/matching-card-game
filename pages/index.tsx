import Card from "@/components/Card";
import { Roboto } from "@next/font/google";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";

import { CardInterface } from "@/types/card";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});
const robotoBold = Roboto({
  weight: "700",
  subsets: ["latin"],
});

import BulbasaurImage from "@/public/images/Bulbasaur.jpeg";
import ButterFreeImage from "@/public/images/ButterFree.jpeg";
import CharmanderImage from "@/public/images/Charmander.jpeg";
import PickachuImage from "@/public/images/Pickachu.png";
import PidgettoImage from "@/public/images/Pidgetto.jpeg";
import SquirtleImage from "@/public/images/Squirtle.jpeg";
import { shuffleCards } from "@/utils/fisher-yates-shuffle";
import classNames from "classnames";

export default function Home() {
  const [uniqueCardsArray, setUniqueCardsArray] = useState<CardInterface[]>([]);
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [openCards, setOpenCards] = useState<any[]>([]);
  const [clearedCards, setClearedCards] = useState<any>({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState(Number.POSITIVE_INFINITY);
  const timeout = useRef<any>(null);

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
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      localStorage.setItem("bestScore", highScore.toString());
    }
  }, [bestScore, clearedCards, moves, uniqueCardsArray.length]);

  // Check if both the cards have same type. If they do, mark them inactive
  const evaluate = useCallback(() => {
    const [first, second] = openCards;
    enable();
    if (cards[first].type === cards[second].type) {
      setClearedCards((prev: any) => ({ ...prev, [cards[first].type]: true }));
      setOpenCards([]);
      return;
    }
    // Flip cards after a 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  }, [cards, openCards]);

  const handleCardClick = (index: any) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
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
    let timeout: string | number | NodeJS.Timeout | null | undefined = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [evaluate, openCards]);

  const setUpDefaultBestScore = () => {
    const defaultBestScore = localStorage.getItem("bestScore");
    if (defaultBestScore) {
      setBestScore(JSON.parse(defaultBestScore));
    }
  };

  useEffect(() => {
    setUpDefaultBestScore();
  }, []);

  useEffect(() => {
    checkCompletion();
  }, [checkCompletion, clearedCards]);

  const checkIsFlipped = (index: any) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card: { type: string | number }) => {
    return Boolean(clearedCards[card.type]);
  };

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    // set a shuffled deck of cards
    setCards(shuffleCards(uniqueCardsArray.concat(uniqueCardsArray)));
  };

  return (
    <>
      <Head>
        <title>Marching Card Game</title>
        <meta
          name="description"
          content="Marching card game create by next app"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="min-h-screen flex justify-center items-center flex-col gap-y-1.5">
          <header className="flex flex-col gap-y-1.5 text-center py-4">
            <h3 className={robotoBold.className}>Play the Marching card game</h3>
            <div className={`${roboto.className} max-w-[360px]`}>
              Select two cards with the same content consecutively to make them
              vanish
            </div>
          </header>
          <div
            className={classNames(
              "grid grid-cols-4 min-w-[360px] min-h-[360px] max-w-[720px] gap-5 items-stretch p-4",
              "bg-gray-800 shadow-md rounded-md",
              "md:min-w-[480px] md:min-h-[480px]"
            )}
          >
            {cards.map((card: CardInterface, index: number) => {
              return (
                <Card
                  key={index}
                  card={card}
                  index={index}
                  isDisabled={shouldDisableAllCards}
                  isInactive={checkIsInactive(card)}
                  isFlipped={checkIsFlipped(index)}
                  onClick={handleCardClick}
                />
              );
            })}
          </div>

          <footer className="flex gap-5 items-center">
            <div className="score flex gap-6 py-8">
              <div className="flex gap-1">
                <div>Best Score</div>
                <div>{bestScore}</div>
              </div>
              <div className="flex gap-1">
                <div>Your moves</div>
                <div>{moves}</div>
              </div>
            </div>
            <Button
              color="primary"
              onClick={handleRestart}
              className="bg-black dark:bg-white dark:hover:bg-gray-200"
            >
              Restart
            </Button>
          </footer>
        </div>
      </main>

      <Dialog
        open={showModal}
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Hurray!!! You completed the challenge
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You completed the game in {moves} moves. Your best score is{" "}
            {bestScore} moves.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRestart} color="primary">
            Restart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
