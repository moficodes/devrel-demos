"use client"

// Import the functions you need from the SDKs you need
import { db } from "@/app/lib/firebase-initialization";
import { onSnapshot, doc, DocumentReference, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import useFirebaseAuthentication from "@/app/hooks/use-firebase-authentication";
import SignOutButton from "@/app/components/sign-out-button";
import SignInButton from "@/app/components/sign-in-button";
import CreateGameButton from "@/app/components/create-game-button";
import { Game, emptyGame, gameStates, timerStates } from "@/app/types";
import Lobby from "@/app/components/lobby";
import GameList from "@/app/components/gameList";
import QuestionPanel from "@/app/components/question-panel";
import Link from "next/link";
import Timer from "@/app/components/timer";
import { time } from "console";


export default function Home() {
  const [gameRef, setGameRef] = useState<DocumentReference>();
  const [game, setGame] = useState<Game>(emptyGame);
  const [currentTimerState, setCurrentTimerState] = useState<number>(0);
  const [countDown, setCountDown] = useState<number>(5);
  const authUser = useFirebaseAuthentication();

  const showingQuestion = game.state === gameStates.AWAITING_PLAYER_ANSWERS || game.state === gameStates.SHOWING_CORRECT_ANSWERS;
  const currentQuestion = game.questions[game.currentQuestionIndex];

  const states = [timerStates.SHOWING_ANSWER, timerStates.SHOWING_QUESTION, timerStates.SHOWING_CTAS]

  const nextState = () => {
    console.log("nextState")
    const nextTimerState = states[(currentTimerState + 1) % states.length];
    setCountDown(nextTimerState);
    setCurrentTimerState(currentTimerState + 1);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDown => countDown - 1);
      if (countDown <= 0) {
        nextState();
      }
    }, 1000);
  }, [countDown, currentTimerState])

  
  const timer = () => {

  }

  useEffect(() => {
    if (gameRef?.id) {
      const unsubscribe = onSnapshot(doc(db, "games", gameRef.id), (doc) => {
        const game = doc.data() as Game;
        setGame(game);
      });
      return unsubscribe;
    } else {
      setGame(emptyGame);
    }
  }, [gameRef])

  useEffect(() => {
    if (!authUser.uid) {
      setGameRef(undefined);
    }
  }, [authUser.uid])

  return (
    <main className="p-24 flex justify-between space-x-24">
      <div>
        {authUser.uid ? (<>
          {(game.state === gameStates.GAME_OVER) && <div>
            {gameStates.GAME_OVER}
          </div>}
          {(!gameRef || game.state === gameStates.GAME_OVER) && <div>
            <CreateGameButton setGameRef={setGameRef} />
            <GameList setGameRef={setGameRef} />
          </div>}
          {showingQuestion && gameRef && (<>
            <QuestionPanel game={game} gameRef={gameRef} currentQuestion={currentQuestion} />
            <div>countDown</div>
          </>)}
          {game.state === gameStates.NOT_STARTED && gameRef && (
            <Lobby gameRef={gameRef} setGameRef={setGameRef} timer={timer} />
          )}
          <br />
          <SignOutButton />
        </>) : (<>
          <SignInButton />
          <Link href="/" className="underline text-blue-600">Join the fun!</Link>
        </>)}
      </div>
      {/* TODO: Remove this pre tag, just here do make debugging faster */}
      <pre>
        {JSON.stringify({
          countDown,
          currentTimerState
        }, null, 2)}
      </pre>
    </main>
  )
}
