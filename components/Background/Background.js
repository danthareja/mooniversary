import Image from "next/image";
import styles from "./Background.module.css";

export function Background() {
  return (
    <div className={styles.background}>
      <Image
        alt="Night sky"
        src="/sky.jpg"
        layout="fill"
        objectFit="cover"
        quality={100}
        draggable="false"
      />
    </div>
  );
}
