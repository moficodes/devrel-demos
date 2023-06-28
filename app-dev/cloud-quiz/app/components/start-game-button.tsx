"use client"

import { DocumentReference, updateDoc } from "firebase/firestore";
import { gameStates } from "@/app/types";

export default function StartGameButton({gameRef, timer}: {gameRef: DocumentReference, timer: () => void}) {
  const onStartGameClick = async (gameRef: DocumentReference) => {
    await updateDoc(gameRef, {
      state: gameStates.AWAITING_PLAYER_ANSWERS,
    });
    timer();
  }

  return (
    <button onClick={() => onStartGameClick(gameRef)} className={`border mt-20`}>
      Start Game
    </button>
  )
}
