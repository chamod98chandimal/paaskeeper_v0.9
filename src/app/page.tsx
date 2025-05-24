import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className={styles.homeContainer}>
        <section className={styles.featuresSection}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🛡️</div>
            <h3 className={styles.featureTitle}>Advanced Encryption</h3>
            <p className={styles.featureDescription}>
              Military-grade encryption keeps your passwords and sensitive data protected at all times
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔑</div>
            <h3 className={styles.featureTitle}>2FA Support</h3>
            <p className={styles.featureDescription}>
              Enhanced security with built-in two-factor authentication support
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔄</div>
            <h3 className={styles.featureTitle}>Auto-Sync</h3>
            <p className={styles.featureDescription}>
              Access your passwords instantly across all your devices with real-time sync
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>Smart Autofill</h3>
            <p className={styles.featureDescription}>
              Save time with intelligent form detection and secure password autofill
            </p>
          </div>
        </section>

        <section className={styles.heroSection}>
          <div className={styles.lockIcon}>🔐</div>
          <h1 className={styles.title}>Welcome to Paaskeeper Beata Version</h1>
          <p className={styles.subtitle}>
            The modern, secure solution for managing your passwords and two-factor authentication. Keep your digital life safe and organized.
          </p>
          <Link href="/register" className={styles.ctaButton}>
            Get Started Now
          </Link>
        </section>
      </main>
      <footer className={styles.footer}>
        <span className={styles.footerText}>VMTEK Works @ 2025</span>
      </footer>
    </>
  );
}
