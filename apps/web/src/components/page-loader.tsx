import { ChefHat, CookingPot } from "lucide-react";
import styles from "./page-loader.module.css";

export function PageLoader() {
  return (
    <div className={styles.screen} role="status" aria-live="polite">
      <div className={styles.icon} aria-hidden="true">
        <CookingPot className={styles.pot} size={54} strokeWidth={1.7} />
        <ChefHat className={styles.hat} size={29} strokeWidth={1.8} />
        <i className={`${styles.steam} ${styles.one}`} />
        <i className={`${styles.steam} ${styles.two}`} />
        <i className={`${styles.steam} ${styles.three}`} />
      </div>
      <div className={styles.copy}>
        <span className={styles.srOnly}>Preparing your page</span>
        <span className={styles.words} aria-hidden="true">
          <b>Baking</b><b>Preparing</b><b>Plating</b>
        </span>
        <small>something delicious for you</small>
      </div>
    </div>
  );
}
