import styles from './faq.module.css';

export default function FAQ() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Frequently Asked Questions</h1>
        <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className={styles.section}>
          <h2>Getting Started</h2>
          
          <h3>What is Paaskeeper?</h3>
          <p>
            Paaskeeper is a decentralized password vault that uses blockchain technology to securely store your passwords and sensitive data. Built on Ethereum Sepolia testnet with MetaMask integration and Lit Protocol encryption, it provides a zero-knowledge security model where only you can access your data.
          </p>

          <h3>Do I need any special software to use Paaskeeper?</h3>
          <p>
            Yes, you need MetaMask wallet extension installed in your browser. Paaskeeper uses MetaMask for authentication and blockchain transactions. You can download MetaMask from their official website.
          </p>

          <h3>Is Paaskeeper free to use?</h3>
          <p>
            Currently, Paaskeeper operates on the Ethereum Sepolia testnet (<a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank">Ethereum Sepolia Faucet</a>), which means you only need testnet ETH (free) for transactions. As it's in beta version 0.2, the service is free during the testing phase.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Security & Privacy</h2>
          
          <h3>How secure is my data in Paaskeeper?</h3>
          <p>
            Your data is protected by multiple layers of security:
          </p>
          <ul>
            <li><strong>Client-side encryption:</strong> Data is encrypted on your device before transmission</li>
            <li><strong>Lit Protocol:</strong> Decentralized encryption key management across multiple nodes</li>
            <li><strong>Zero-knowledge architecture:</strong> We cannot see or access your passwords</li>
            <li><strong>Blockchain security:</strong> Ethereum's cryptographic security and consensus mechanism</li>
            <li><strong>MetaMask authentication:</strong> Only you control access with your wallet</li>
          </ul>

          <h3>Can anyone see my passwords?</h3>
          <p>
            No. Paaskeeper uses a zero-knowledge security model. Your passwords are encrypted on your device using your master password and MetaMask wallet. Even if someone gains access to the encrypted data on the blockchain, they cannot decrypt it without your private keys and master password.
          </p>

          <h3>What happens if I lose access to my MetaMask wallet?</h3>
          <p>
            If you lose access to your MetaMask wallet, you will lose access to your Paaskeeper vault. This is the nature of decentralized systems - there's no central authority that can recover your data. Always backup your MetaMask seed phrase securely.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Technical Questions</h2>
          
          <h3>What is the Ethereum Sepolia testnet?</h3>
          <p>
          <a href="https://docs.etherscan.io/sepolia-etherscan" target="_blank">Sepolia</a>  is a test blockchain network that mimics the main Ethereum network but uses test ETH with no real value. It's perfect for testing decentralized applications without risking real money. Paaskeeper uses Sepolia during its beta phase.
          </p>

          <h3>What is Lit Protocol and why do you use it?</h3>
          <p>
            Lit Protocol is a decentralized key management network that distributes encryption keys across multiple nodes. This means no single entity (including us) can access your data. It provides programmable cryptography and access control for decentralized applications.
          </p>

          <h3>How are my passwords stored on the blockchain?</h3>
          <p>
            Your passwords are encrypted using advanced cryptography before being stored in smart contracts on the Ethereum blockchain. The blockchain only stores encrypted data - the plaintext passwords never leave your device unencrypted.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Using Paaskeeper</h2>
          
          <h3>How do I add a new password to my vault?</h3>
          <p>
            Connect your MetaMask wallet, navigate to your vault, and use the "Add New Entry" form. Enter your website/service details and password. The data will be encrypted and stored on the blockchain after you confirm the transaction.
          </p>

          <h3>Can I access my passwords from different devices?</h3>
          <p>
            Yes! As long as you have MetaMask with the same wallet address and know your master password, you can access your vault from any device with an internet connection. Your data is stored on the decentralized blockchain, not on any specific device.
          </p>

          <h3>How do I backup my vault?</h3>
          <p>
            Your vault is automatically backed up on the blockchain. However, make sure to:
          </p>
          <ul>
            <li>Backup your MetaMask seed phrase securely</li>
            <li>Remember your master password</li>
            <li>Keep a record of your wallet address</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Troubleshooting</h2>
          
          <h3>I can't connect my MetaMask wallet. What should I do?</h3>
          <p>
            Try these steps:
          </p>
          <ul>
            <li>Make sure MetaMask is installed and unlocked</li>
            <li>Switch to Ethereum Sepolia testnet in MetaMask</li>
            <li>Refresh the page and try connecting again</li>
            <li>Check if MetaMask is updated to the latest version</li>
          </ul>

          <h3>My transaction is taking too long. Is this normal?</h3>
          <p>
            Blockchain transactions can take a few minutes to confirm, especially during network congestion. You can check the transaction status in MetaMask or on a Sepolia block explorer using your transaction hash.
          </p>

          <h3>I'm getting an error when trying to save a password. What's wrong?</h3>
          <p>
            Common causes include:
          </p>
          <ul>
            <li>Insufficient testnet ETH for gas fees</li>
            <li>Network connectivity issues</li>
            <li>MetaMask not connected or locked</li>
            <li>Browser blocking the transaction popup</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Beta Version Information</h2>
          
          <h3>What does "Beta 0.2" mean?</h3>
          <p>
            Paaskeeper is currently in beta testing phase (version 0.2). This means:
          </p>
          <ul>
            <li>Features are still being tested and improved</li>
            <li>Some functionality may change</li>
            <li>It's recommended for testing, not critical production use</li>
            <li>User feedback helps improve the platform</li>
          </ul>

          <h3>When will the mainnet version be available?</h3>
          <p>
            We're currently testing on Sepolia testnet to ensure security and stability. A mainnet release timeline will be announced once beta testing is complete and all security audits are passed.
          </p>

          <h3>Will my testnet data transfer to mainnet?</h3>
          <p>
            Data stored on Sepolia testnet will not automatically transfer to mainnet. You'll need to migrate your passwords manually when the mainnet version launches. We recommend using test data during the beta phase.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Support & Contact</h2>
          
          <h3>How can I get help if I'm stuck?</h3>
          <p>
            If you need assistance:
          </p>
          <div className={styles.contact}>
            <p><strong>Email Support:</strong> chamod983.bitcoin@ud.me</p>
            <p><strong>Developer:</strong> Team VMTEK</p>
            <p><strong>Response Time:</strong> We aim to respond within 24-48 hours</p>
            <p><strong>Best Practices:</strong> Include your wallet address (not private keys!) and describe the issue clearly</p>
          </div>

          <h3>Can I contribute to Paaskeeper development?</h3>
          <p>
            We welcome feedback and bug reports during the beta phase. Contact us with suggestions, issues, or if you're interested in contributing to the project's development.
          </p>

          <h3>Is there a community or forum for Paaskeeper users?</h3>
          <p>
            Currently, support is handled directly through email. As the user base grows, we may establish community channels for users to share experiences and help each other.
          </p>
        </section>
      </div>
    </div>
  );
} 