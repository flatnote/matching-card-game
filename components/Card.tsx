import classNames from "classnames";
import Image from "next/image";
import React from "react";

import pokeball from "@/public/images/pokeball.png";
import { CardInterface } from "@/types/card";

interface CardProps {
  onClick: (index: number) => void;
  card: CardInterface;
  index: number;
  isInactive?: boolean;
  isFlipped?: boolean;
  isDisabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  onClick,
  card,
  index,
  isInactive,
  isFlipped,
  isDisabled,
}) => {
  const handleClick = () => {
    !isFlipped && !isDisabled && onClick(index);
  };
  return (
    <div
      className={classNames("card aspect-square", {
        "is-flipped": isFlipped,
        "is-inactive": isInactive,
      })}
      onClick={handleClick}
    >
      <div className="card-face card-font-face">
        <Image src={pokeball} alt="pokeball" className="rounded-sm aspect-square" />
      </div>
      <div className="card-face card-back-face">
        <Image src={card.image} alt={card.type} className="rounded-sm aspect-square" />
      </div>
    </div>
  );
};

export default Card;
