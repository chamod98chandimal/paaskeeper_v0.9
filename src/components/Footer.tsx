import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <span className={styles.footerText}>VMTEK Works @ 2025</span>
        <Link href="/privacy" className={styles.privacyLink}>
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
} 