import classNames from "classnames";
import Image from "next/image";
import React from "react";

import pokeball from "@/public/images/pokeball.png";
import { CardInterface } from "@/types/card";
import { shimmer, toBase64 } from "@/utils/image";

interface CardProps {
  onClick: (index: number) => void;
  card: CardInterface;
  index: number;
  isInactive?: boolean;
  isFlipped?: boolean;
  isDisabled?: boolean;
  label: string;
}

const Card: React.FC<CardProps> = ({
  onClick,
  card,
  index,
  isInactive,
  isFlipped,
  isDisabled,
  label,
}) => {
  const handleClick = () => {
    if (!isFlipped && !isDisabled && !isInactive) onClick(index);
  };
  return (
    <button
      type="button"
      className={classNames("card aspect-square", {
        "is-flipped": isFlipped,
        "is-inactive": isInactive,
      })}
      aria-label={`${label}: ${isInactive ? `${card.type}, matched` : isFlipped ? card.type : "face down"}`}
      aria-pressed={Boolean(isFlipped)}
      aria-hidden={isInactive || undefined}
      disabled={isDisabled || isInactive}
      onClick={handleClick}
    >
      <div className="card-face card-font-face">
        <Image
          src={pokeball}
          alt=""
          className="rounded-sm aspect-square"
        />
      </div>
      <div className="card-face card-back-face">
        <Image
          src={card.image}
          alt=""
          className="rounded-sm aspect-square"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer(60, 60)
          )}`}
        />
      </div>
    </button>
  );
};

export default Card;
