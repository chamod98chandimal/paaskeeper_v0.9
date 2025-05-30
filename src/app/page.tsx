import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
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
          <h1 className={styles.title}>Welcome to Passkeeper Beta 0.2</h1>
          <p className={styles.subtitle}>
            The modern, secure solution for managing your passwords and two-factor authentication. Keep your digital life safe and organized.
          </p>
{/*           <Link href="/login" className={styles.ctaButton}>
            Get Started Now
          </Link> */}
        </section>

        <section className={styles.howToUseSection}>
          <div className={styles.howToUseHeader}>
            <div className={styles.howToUseIcon}>📋</div>
            <h2 className={styles.howToUseTitle}>How to Use Paaskeeper</h2>
            <p className={styles.howToUseSubtitle}>
              Get started with Paaskeeper in 4 simple steps
            </p>
          </div>
          
          <div className={styles.stepsContainer}>
            <a 
              href="https://metamask.io/download" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.stepCardLink}
            >
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.faucetLogo}>
                  <img src="/images/faucets/metamask.png" alt="MetaMask" className={styles.faucetImage} />
                </div>
                {/* <div className={styles.stepIcon}>🦊</div> */}
                <h3 className={styles.stepTitle}>Login with MetaMask</h3>
                <p className={styles.stepDescription}>
                  Connect your MetaMask wallet to securely authenticate and access your Paaskeeper vault.
                </p>
              </div>
            </a>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepIcon}>🔐</div>
              <h3 className={styles.stepTitle}>Create Your Vault</h3>
              <p className={styles.stepDescription}>
                Set up your secure password vault with a master password. This is the only password you'll need to remember.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepIcon}>📝</div>
              <h3 className={styles.stepTitle}>Add Your Passwords</h3>
              <p className={styles.stepDescription}>
                Import existing passwords or create new ones.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepIcon}>🚀</div>
              <h3 className={styles.stepTitle}>Access Anywhere</h3>
              <p className={styles.stepDescription}>
                Sync across all platforms, and enjoy secure access to your digital life.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.howToUseSection}>
          <div className={styles.howToUseHeader}>
            <div className={styles.howToUseIcon}>💧</div>
            <h2 className={styles.howToUseTitle}>How to Get Ethereum Sepolia</h2>
            <p className={styles.howToUseSubtitle}>
              Get testnet ETH for Sepolia network to interact with Paaskeeper
            </p>
          </div>
          
          <div className={styles.faucetStepsContainer}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.faucetLogo}>
                <img src="/images/faucets/google-cloud.svg" alt="Google Cloud" className={styles.faucetImage} />
              </div>
              {/* <div className={styles.stepIcon}>🚰</div> */}
              <h3 className={styles.stepTitle}>Google Cloud Faucet</h3>
              <p className={styles.stepDescription}>
                Get free Sepolia ETH from Google Cloud's official faucet. Fast and reliable.
              </p>
              <a 
                href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.faucetLink}
              >
                Visit Google Cloud Faucet →
              </a>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.faucetLogo}>
                <img src="/images/faucets/alchemy.png" alt="Alchemy" className={styles.faucetImage} />
              </div>
              {/* <div className={styles.stepIcon}>⚗️</div> */}
              <h3 className={styles.stepTitle}>Alchemy Faucet</h3>
              <p className={styles.stepDescription}>
                Alternative faucet provided by Alchemy. Great backup option with easy-to-use interface.
              </p>
              <a 
                href="https://www.alchemy.com/faucets/ethereum-sepolia" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.faucetLink}
              >
                Visit Alchemy Faucet →
              </a>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.faucetLogo}>
                <img src="/images/faucets/testnet-bridge.svg" alt="Testnet Bridge" className={styles.faucetImage} />
              </div>
              {/* <div className={styles.stepIcon}>🌉</div> */}
              <h3 className={styles.stepTitle}>Testnet Bridge</h3>
              <p className={styles.stepDescription}>
                Bridge ETH from Ethereum mainnet to Sepolia testnet. Useful if you have mainnet ETH to convert.
              </p>
              <a 
                href="https://testnetbridge.com/sepolia" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.faucetLink}
              >
                Visit Testnet Bridge →
              </a>
            </div>
          </div>
        </section>

        <section className={styles.partnersSection}>
          <div className={styles.partnersHeader}>
            <div className={styles.partnersIcon}>🤝</div>
            <h2 className={styles.partnersTitle}>Trusted Partners</h2>
            <p className={styles.partnersSubtitle}>
              Powered by industry-leading blockchain and security technologies
            </p>
          </div>
          
          <div className={styles.carouselContainer}>
            <div className={styles.carousel}>
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/ethereum-logo.png" alt="Ethereum" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>Ethereum</span>
              </div>
              
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/alchemy.png" alt="Alchemy" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>Alchemy</span>
              </div>
              
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/lit_protocol_logo.jpeg" alt="Lit Protocol" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>Lit Protocol</span>
              </div>
              
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/tenderly.png" alt="Tenderly" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>Tenderly</span>
              </div>
              
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/metamask.png" alt="MetaMask" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>MetaMask</span>
              </div>
              
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/infura.png" alt="Infura" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>Infura</span>
              </div>

              {/* Duplicate for seamless loop */}
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/ethereum-logo.png" alt="Ethereum" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>Ethereum</span>
              </div>
              
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/alchemy.png" alt="Alchemy" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>Alchemy</span>
              </div>
              
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/lit_protocol_logo.jpeg" alt="Lit Protocol" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>Lit Protocol</span>
              </div>
              
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/tenderly.png" alt="Tenderly" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>Tenderly</span>
              </div>
              
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/metamask.png" alt="MetaMask" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>MetaMask</span>
              </div>
              
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  <img src="/images/partners/infura.png" alt="Infura" className={styles.partnerImage} />
                </div>
                <span className={styles.partnerName}>Infura</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.teamSection}>
          <div className={styles.teamHeader}>
            {/* <div className={styles.teamIcon}>👥</div> */}
            <h2 className={styles.teamTitle}>Meet Our Team</h2>
            <p className={styles.teamSubtitle}>
              The passionate minds behind Paaskeeper's security innovation
            </p>
          </div>
          
          <div className={styles.teamGrid}>
            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/era.jpeg" alt="era" className={styles.teamImage} />
              </div>
              <h3 className={styles.teamName}>N.D.C.C.E. Dissanayake</h3>
              {/* <p className={styles.teamRole}>CEO & Founder</p> */}
              <div className={styles.teamContacts}>
                <a href="chamod983.bitcoin@ud.me" className={`${styles.contactLink} ${styles.emailLink}`}>
                  <span className={styles.contactIcon}>📧</span>
                  <span className={styles.emailText}>chamod983.bitcoin@ud.me</span>
                  <span className={styles.emailLabel}>Email</span>
                </a>
                <a href="https://www.linkedin.com/in/chamodchandimal/" className={styles.contactLink}>
                  <span className={styles.contactIcon}>💼</span>
                  LinkedIn
                </a>
                <a href="https://ud.me/chamod983.bitcoin" className={styles.contactLink}>
                  <span className={styles.contactIcon}>🌐</span>
                  Portfolio
                </a>
                <a href="https://github.com/chamodchandimal" className={styles.contactLink}>
                  <span className={styles.contactIcon}>⚡</span>
                  GitHub
                </a>
              </div>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/sara.jpg" alt="M.T.M.S Dissanayake" className={styles.teamImage} />
              </div>
              <h3 className={styles.teamName}>M.T.M.S Dissanayake</h3>
              {/* <p className={styles.teamRole}>CTO</p> */}
              <div className={styles.teamContacts}>
                <a href="methsara0211@gmail.com" className={`${styles.contactLink} ${styles.emailLink}`}>
                  <span className={styles.contactIcon}>📧</span>
                  <span className={styles.emailText}>methsara0211@gmail.com</span>
                  <span className={styles.emailLabel}>Email</span>
                </a>
                <a href="https://www.linkedin.com/methsara-dissanayake/" className={styles.contactLink}>
                  <span className={styles.contactIcon}>💼</span>
                  LinkedIn
                </a>
                <a href="https://github.com/methsara1" className={styles.contactLink}>
                  <span className={styles.contactIcon}>⚡</span>
                  GitHub
                </a>
              </div>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/thash.jpg" alt="T.P. Rathnayaka" className={styles.teamImage} />
              </div>
              <h3 className={styles.teamName}>T.P. Rathnayaka</h3>
              {/* <p className={styles.teamRole}>Security Engineer</p> */}
              <div className={styles.teamContacts}>
                <a href="rathnayakapaboda79@gmail.com" className={`${styles.contactLink} ${styles.emailLink}`}>
                  <span className={styles.contactIcon}>📧</span>
                  <span className={styles.emailText}>rathnayakapaboda79@gmail.com</span>
                  <span className={styles.emailLabel}>Email</span>
                </a>
                <a href="http://www.linkedin.com/in/thashmi-rathnayaka-408bbb29b" className={styles.contactLink}>
                  <span className={styles.contactIcon}>💼</span>
                  LinkedIn
                </a>
                {/* <a href="https://securityblog.michaelr.dev" className={styles.contactLink}>
                  <span className={styles.contactIcon}>🌐</span>
                  Blog
                </a> */}
                <a href="https://github.com/ThashmiRathnayaka" className={styles.contactLink}>
                  <span className={styles.contactIcon}>⚡</span>
                  GitHub
                </a>
              </div>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/kavi1.jpeg" alt="D.M.K.P. Dissanayaka" className={styles.teamImage} />
              </div>
              <h3 className={styles.teamName}>D.M.K.P. Dissanayaka</h3>
              {/* <p className={styles.teamRole}>UI/UX Designer</p> */}
              <div className={styles.teamContacts}>
                <a href="kavindradissanayaka1998@gmail.com" className={`${styles.contactLink} ${styles.emailLink}`}>
                  <span className={styles.contactIcon}>📧</span>
                  <span className={styles.emailText}>kavindradissanayaka1998@gmail.com</span>
                  <span className={styles.emailLabel}>Email</span>
                </a>
                <a href="https://www.linkedin.com/in/kaveendradissanayaka" className={styles.contactLink}>
                  <span className={styles.contactIcon}>💼</span>
                  LinkedIn
                </a>
                <a href="https://kaveendra.netlify.app" className={styles.contactLink}>
                  <span className={styles.contactIcon}>🌐</span>
                  Portfolio
                </a>
                <a href="https://github.com/kavipaba" className={styles.contactLink}>
                  <span className={styles.contactIcon}>⚡</span>
                  GitHub
                </a>
              </div>
            </div>

            <div className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src="/images/team/venuri.jpg" alt="R.T.V. Rathnasuriya" className={styles.teamImage} />
              </div>
              <h3 className={styles.teamName}>R.T.V. Rathnasuriya</h3>
              {/* <p className={styles.teamRole}>Blockchain Developer</p> */}
              <div className={styles.teamContacts}>
                <a href="thathsaranirathnasooriya@gmail.com" className={`${styles.contactLink} ${styles.emailLink}`}>
                  <span className={styles.contactIcon}>📧</span>
                  <span className={styles.emailText}>thathsaranirathnasooriya@gmail.com</span>
                  <span className={styles.emailLabel}>Email</span>
                </a>
                <a href="www.linkedin.com/in/thathsarani-rathnasuriya-804015290" className={styles.contactLink}>
                  <span className={styles.contactIcon}>💼</span>
                  LinkedIn
                </a>
                
                <a href="https://thathsaranivenurathnasuriya.github.io/my-portfolio-site" className={styles.contactLink}>
                  <span className={styles.contactIcon}>🌐</span>
                  Portfolio
                </a>
                <a href="https://github.com/thathsaranivenurathnasuriya" className={styles.contactLink}>
                  <span className={styles.contactIcon}>⚡</span>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
