import styles from './privacy.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className={styles.section}>
          <h2>Introduction</h2>
          <p>
            Welcome to Paaskeeper Beta 0.2, a decentralized password management solution. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain-based password management service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
          </p>
        </section>

        <section className={styles.section}>
          <h2>About Paaskeeper</h2>
          <p>
            Paaskeeper is a decentralized password manager that leverages blockchain technology, specifically the Ethereum Sepolia testnet, for secure data storage and authentication. We use MetaMask wallet integration for user authentication and Lit Protocol for advanced encryption services.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Information We Collect</h2>
          <h3>Wallet Information</h3>
          <p>When you connect your MetaMask wallet, we collect:</p>
          <ul>
            <li>Your Ethereum wallet address (public key)</li>
            <li>Wallet connection status</li>
            <li>Transaction signatures for authentication</li>
          </ul>
          
          <h3>Encrypted Vault Data</h3>
          <p>
            Your passwords and sensitive data are encrypted using Lit Protocol's decentralized encryption network before being stored on the blockchain. This data is encrypted client-side and we cannot access the plaintext content.
          </p>

        </section>

        <section className={styles.section}>
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Authenticate your identity through MetaMask wallet signatures</li>
            <li>Provide secure access to your encrypted password vault</li>
            <li>Facilitate blockchain transactions on Ethereum Sepolia testnet</li>
            <li>Improve and maintain our decentralized service</li>
            <li>Provide technical support and security notifications</li>
            <li>Analyze usage patterns to enhance user experience</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Blockchain and Decentralized Architecture</h2>
          <p>
            <strong>Testnet Environment:</strong> Paaskeeper operates on the Ethereum Sepolia testnet, which is a public blockchain used for testing purposes. All transactions and data storage occur on this decentralized network.
          </p>
          <p>
            <strong>Lit Protocol Integration:</strong> We use Lit Protocol's decentralized key management and encryption services. This means your encryption keys are distributed across multiple nodes, and no single entity (including us) can access your encrypted data without your authorization.
          </p>
          <p>
            <strong>Smart Contracts:</strong> Your encrypted data may be stored in smart contracts on the Ethereum blockchain, which are immutable and publicly verifiable.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Data Security and Encryption</h2>
          <p>
            <strong>Client-Side Encryption:</strong> All sensitive data is encrypted on your device before being transmitted or stored. We use industry-standard encryption algorithms in combination with Lit Protocol's decentralized encryption network.
          </p>
          <p>
            <strong>Zero-Knowledge Architecture:</strong> We employ a zero-knowledge security model where we cannot see, access, or decrypt your stored passwords and personal data. Only you, with your MetaMask wallet and master password, can decrypt your data.
          </p>
          <p>
            <strong>Blockchain Security:</strong> The Ethereum blockchain provides additional security through its decentralized consensus mechanism and cryptographic hashing.
          </p>
        </section>

        <section className={styles.section}>
          <h2>MetaMask Integration</h2>
          <p>
            Paaskeeper requires MetaMask wallet connection for authentication. When you connect your wallet:
          </p>
          <ul>
            <li>We only access your public wallet address</li>
            <li>We request transaction signatures for authentication purposes</li>
            <li>We do not have access to your private keys or seed phrase</li>
            <li>You maintain full control over your wallet and can disconnect at any time</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Data Sharing and Third Parties</h2>
          <p>
            Due to our decentralized architecture, your encrypted data is distributed across:
          </p>
          <ul>
            <li><strong>Ethereum Sepolia Network:</strong> Encrypted data stored on public blockchain</li>
            <li><strong>Lit Protocol Network:</strong> Decentralized encryption key management</li>
            
          </ul>
          <p>
            We do not sell or share your personal information with third parties for marketing purposes. Your data remains encrypted and inaccessible to these network participants.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Testnet Considerations</h2>
          <p>
            <strong>Important:</strong> Paaskeeper currently operates on the Ethereum Sepolia testnet. This means:
          </p>
          <ul>
            <li>No real ETH is required - only testnet ETH</li>
            <li>The service is in beta and for testing purposes</li>
            <li>Data may be reset or lost during development</li>
            <li>Do not store critical production passwords during beta testing</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Your Rights and Control</h2>
          <p>With Paaskeeper, you have:</p>
          <ul>
            <li><strong>Full Data Ownership:</strong> Your encrypted data belongs to you</li>
            <li><strong>Wallet Control:</strong> Disconnect your MetaMask wallet at any time</li>
            <li><strong>Access Control:</strong> Only you can decrypt and access your passwords</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Cookies and Local Storage</h2>
          <p>
            We use minimal cookies and browser local storage for:
          </p>
          <ul>
            <li>Maintaining your wallet connection session</li>
            <li>Storing user interface preferences</li>
            <li>Caching encrypted vault data for performance</li>
          </ul>
          <p>
            We do not use tracking cookies or third-party analytics that compromise your privacy.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Beta Software Disclaimer</h2>
          <p>
            Paaskeeper is currently in beta (version 0.2). As beta software:
          </p>
          <ul>
            <li>Features may change or be discontinued</li>
            <li>Data loss is possible during updates</li>
            <li>Security vulnerabilities may exist</li>
            <li>Use at your own risk for non-critical data</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy as Paaskeeper evolves from beta to production. We will notify users of significant changes through the application interface and update the "Last updated" date above.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or Paaskeeper, please contact us:
          </p>
          <div className={styles.contact}>
            <p><strong>Developer:</strong> Team VMTEK</p>
            <p><strong>Project:</strong> Paaskeeper Beta 0.2</p>
            <p><strong>Network:</strong> Ethereum Sepolia Testnet</p>
            <p><strong>Support:</strong> chamod983.bitcoin@ud.me</p>
          </div>
        </section>
      </div>
    </div>
  );
} 