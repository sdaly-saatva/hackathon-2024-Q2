'use client'
import { useState } from "react";
import styles from "./page.module.css";
import Scene from "./components/Bunny"
import Chat from "./components/openai/Openai"

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false)
  const handleChat = () => {
    setChatOpen(chatOpen => !chatOpen)
  }

  const classes = `${chatOpen ? styles.isVisible : styles.isHidden}`
  return (
    <main className={styles.main}>
      <Scene onClick={handleChat} />
      <Chat className={classes} />
    </main>
  );
}
