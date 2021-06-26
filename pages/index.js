import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

import { Moon, LunarPhase } from "@/lib/moon";
import { format } from "date-fns";

export default function Home() {
  const nextFullMoon = format(
    Moon.nextLunarPhase(LunarPhase.FULL),
    "yyyy/MM/dd"
  );

  return (
    <div>
      <Head>
        <title>Mooniversary</title>
        <meta name="description" content="Mooniversary tracking app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.background}>
        <Image
          alt="Background image"
          src="/background.jpg"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>{nextFullMoon}</h1>
          <p className={styles.description}>is our next Mooniversary</p>
        </main>
      </div>
    </div>
  );
}
