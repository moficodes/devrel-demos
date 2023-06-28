"use client"

import { DocumentData, DocumentReference } from "firebase/firestore";
import StartGameButton from "@/app/components/start-game-button";
import ExitGameButton from "@/app/components/exitGameButton";
import { Dispatch, SetStateAction } from "react";

export default function Lobby({ gameRef, setGameRef, timer }: { gameRef: DocumentReference, setGameRef: Dispatch<SetStateAction<DocumentReference<DocumentData> | undefined>> , timer: () => void}) {

  return (
    <>
      <StartGameButton gameRef={gameRef} timer={timer} />
      <ExitGameButton setGameRef={setGameRef} gameRef={gameRef} />
    </>
  )
}
