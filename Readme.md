<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TokenFlow - P2P AI Token Marketplace</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Orbitron:wght@400;600;800&display=swap');
    
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --secondary: #7c3aed;
      --accent: #06b6d4;
      --dark: #0f172a;
      --light: #f8fafc;
      --success: #22c55e;
      --warning: #eab308;
      --danger: #ef4444;
      --gray: #64748b;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--dark);
      color: var(--light);
      line-height: 1.6;
      overflow-x: hidden;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(124, 58, 237, 0.05) 0%, transparent 50%);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    /* Header Section */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 4rem 0;
    }
    
    .hero::before {
      content: "";
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: linear-gradient(45deg, var(--primary), var(--secondary));
      filter: blur(100px);
      opacity: 0.1;
      z-index: -1;
      animation: float 20s ease-in-out infinite;
    }
    
    .hero::after {
      content: "";
      position: absolute;
      top: 40%;
      right: -10%;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: linear-gradient(45deg, var(--accent), var(--secondary));
      filter: blur(80px);
      opacity: 0.08;
      z-index: -1;
      animation: float 25s ease-in-out infinite reverse;
    }
    
    @keyframes float {
      0% { transform: translate(0, 0) rotate(0); }
      25% { transform: translate(5%, 5%) rotate(5deg); }
      50% { transform: translate(0, 10%) rotate(0); }
      75% { transform: translate(-5%, 5%) rotate(-5deg); }
      100% { transform: translate(0, 0) rotate(0); }
    }
    
    .logo {
      font-family: 'Orbitron', sans-serif;
      font-size: 3.5rem;
      font-weight: 800;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      color: transparent;
      margin-bottom: 1rem;
      position: relative;
      display: inline-block;
    }
    
    .logo::before {
      content: "🚀";
      position: absolute;
      top: -20px;
      right: -40px;
      font-size: 2.5rem;
      animation: rocket 3s ease-in-out infinite;
    }
    
    @keyframes rocket {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(5deg); }
    }
    
    .tagline {
      font-size: 1.5rem;
      color: var(--light);
      margin-bottom: 2rem;
      opacity: 0;
      animation: fadeIn 1s ease-out forwards 0.5s;
    }
    
    .highlight {
      color: var(--primary);
      font-weight: 600;
    }
    
    .btn {
      display: inline-block;
      padding: 12px 32px;
      background: linear-gradient(45deg, var(--primary), var(--secondary));
      color: white;
      border: none;
      border-radius: 8px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      margin-right: 1rem;
      margin-bottom: 1rem;
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(37, 99, 235, 0.4);
    }
    
    .btn::after {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: rgba(255, 255, 255, 0.1);
      transform: rotate(45deg);
      transition: all 0.6s ease;
      z-index: 1;
    }
    
    .btn:hover::after {
      left: 100%;
    }
    
    .btn-outline {
      background: transparent;
      border: 2px solid var(--primary);
      color: var(--primary);
    }
    
    .btn-outline:hover {
      background: var(--primary);
      color: white;
    }
    
    /* Cards Section */
    .section {
      padding: 6rem 0;
      position: relative;
    }
    
    .section-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      text-align: center;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      color: transparent;
      position: relative;
      display: inline-block;
    }
    
    .card-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }
    
    .card {
      background: rgba(15, 23, 42, 0.7);
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .card:hover {
      transform: translateY(-10px);
      box-shadow: 0 12px 40px rgba(37, 99, 235, 0.2);
      border: 1px solid rgba(37, 99, 235, 0.2);
    }
    
    .card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
    }
    
    .card::after {
      content: "";
      position: absolute;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, var(--primary-dark) 0%, transparent 70%);
      opacity: 0.1;
      top: -50px;
      right: -50px;
      border-radius: 50%;
      z-index: -1;
      transition: all 0.5s ease;
    }
    
    .card:hover::after {
      transform: scale(1.5);
    }
    
    .card-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
      color: var(--light);
      position: relative;
      display: inline-block;
    }
    
    .card-icon {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      display: inline-block;
      background: linear-gradient(45deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      color: transparent;
      animation: pulse 5s infinite alternate;
    }
    
    @keyframes pulse {
      0% { opacity: 0.8; transform: scale(1); }
      100% { opacity: 1; transform: scale(1.05); }
    }
    
    .card-content {
      color: var(--gray);
      font-size: 1rem;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Process Flow Section */
    .process-flow {
      display: flex;
      flex-direction: column;
      position: relative;
      margin: 4rem 0;
    }
    
    .process-step {
      display: flex;
      margin-bottom: 3rem;
      opacity: 0;
      transform: translateX(-20px);
      animation: fadeInRight 0.6s ease-out forwards;
    }
    
    .process-step:nth-child(odd) {
      align-self: flex-start;
    }
    
    .process-step:nth-child(even) {
      align-self: flex-end;
      flex-direction: row-reverse;
      transform: translateX(20px);
      animation: fadeInLeft 0.6s ease-out forwards;
    }
    
    .process-step:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .process-step:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    .process-step:nth-child(4) {
      animation-delay: 0.6s;
    }
    
    .process-step:nth-child(5) {
      animation-delay: 0.8s;
    }
    
    .process-step:nth-child(6) {
      animation-delay: 1s;
    }
    
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .step-number {
      width: 60px;
      height: 60px;
      background: linear-gradient(45deg, var(--primary), var(--secondary));
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: white;
      margin-right: 1.5rem;
      box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
      flex-shrink: 0;
    }
    
    .process-step:nth-child(even) .step-number {
      margin-right: 0;
      margin-left: 1.5rem;
    }
    
    .step-content {
      background: rgba(15, 23, 42, 0.7);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      position: relative;
    }
    
    .step-content::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }
    
    .step-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--light);
    }
    
    /* Tech Stack Section */
    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 3rem;
    }
    
    .tech-item {
      background: rgba(15, 23, 42, 0.7);
      border-radius: 12px;
      padding: 1.2rem 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transform: scale(0.9);
      animation: scaleIn 0.5s ease-out forwards;
    }
    
    .tech-item:nth-child(2) {
      animation-delay: 0.1s;
    }
    
    .tech-item:nth-child(3) {
      animation-delay: 0.2s;
    }
    
    .tech-item:nth-child(4) {
      animation-delay: 0.3s;
    }
    
    .tech-item:nth-child(5) {
      animation-delay: 0.4s;
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .tech-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(37, 99, 235, 0.2);
      border: 1px solid rgba(37, 99, 235, 0.2);
    }
    
    .tech-icon {
      margin-right: 1rem;
      font-size: 1.8rem;
      background: linear-gradient(45deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      color: transparent;
    }
    
    .tech-name {
      font-weight: 600;
      color: var(--light);
    }
    
    /* Future Scope Section */
    .future-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }
    
    .future-card {
      background: rgba(15, 23, 42, 0.7);
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      opacity: 0;
      animation: fadeInScale 0.6s ease-out forwards;
    }
    
    .future-card:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .future-card:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    .future-card:nth-child(4) {
      animation-delay: 0.6s;
    }
    
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .future-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 12px 40px rgba(37, 99, 235, 0.2);
      border: 1px solid rgba(37, 99, 235, 0.2);
    }
    
    .future-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      color: transparent;
    }
    
    .future-title {
      font-weight: 700;
      font-size: 1.3rem;
      margin-bottom: 1rem;
      color: var(--light);
    }
    
    /* Footer */
    .footer {
      padding: 3rem 0;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      margin-top: 4rem;
    }
    
    .footer-content {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .footer-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 2rem;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      color: transparent;
    }
    
    .footer-note {
      color: var(--gray);
      margin-bottom: 2rem;
      font-size: 1.1rem;
      font-style: italic;
    }
    
    .social-links {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .social-link {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
      font-size: 1.2rem;
      color: var(--light);
    }
    
    .social-link:hover {
      background: var(--primary);
      transform: translateY(-3px);
    }
    
    .copyright {
      margin-top: 2rem;
      color: var(--gray);
      font-size: 0.9rem;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .hero {
        padding: 2rem 0;
      }
      
      .logo {
        font-size: 2.5rem;
      }
      
      .tagline {
        font-size: 1.2rem;
      }
      
      .section-title {
        font-size: 2rem;
      }
      
      .process-step, .process-step:nth-child(even) {
        flex-direction: column;
        align-self: auto;
      }
      
      .step-number {
        margin-bottom: 1rem;
        margin-right: 0;
        margin-left: 0;
      }
      
      .process-step:nth-child(even) .step-number {
        margin-right: 0;
        margin-left: 0;
      }
      
      .step-content {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h1 class="logo">TokenFlow</h1>
      <p class="tagline">A peer-to-peer marketplace for <span class="highlight">unused AI tokens</span></p>
      <div>
        <a href="#how-it-works" class="btn">How It Works</a>
        <a href="#tech-stack" class="btn btn-outline">Tech Stack</a>
      </div>
    </div>
  </section>
  
  <!-- What Is A Token Section -->
  <section class="section" id="what-is-token">
    <div class="container">
      <h2 class="section-title">What Is a "Token"?</h2>
      <div class="card-container">
        <div class="card">
          <div class="card-icon">📏</div>
          <h3 class="card-title">Unit of Measurement</h3>
          <p class="card-content">A token is a unit of usage for AI platforms like OpenAI or Hugging Face. One token is approximately ¾ of a word on average.</p>
        </div>
        <div class="card">
          <div class="card-icon">💬</div>
          <h3 class="card-title">Bidirectional Consumption</h3>
          <p class="card-content">Both prompts you send and responses you receive consume tokens from your account balance.</p>
        </div>
        <div class="card">
          <div class="card-icon">🧮</div>
          <h3 class="card-title">Practical Example</h3>
          <p class="card-content">Asking "Write a poem" might consume 5-10 tokens. The model's response might use 100+ more tokens from your balance.</p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Problem & Solution Section -->
  <section class="section" id="problem-solution">
    <div class="container">
      <h2 class="section-title">The Problem & Our Solution</h2>
      <div class="card-container">
        <div class="card">
          <div class="card-icon">⚠️</div>
          <h3 class="card-title">The Problem</h3>
          <p class="card-content">Many users — especially those with monthly AI subscriptions — don't use all their tokens. These tokens expire unused, go to waste, and can't be transferred.</p>
          <p class="card-content">Meanwhile, students, indie developers, and early-stage startups often can't afford enough tokens to build or experiment.</p>
        </div>
        <div class="card">
          <div class="card-icon">💡</div>
          <h3 class="card-title">The Solution</h3>
          <p class="card-content">TokenFlow is a secure, peer-to-peer marketplace where users can list unused tokens and others can lease or buy them affordably.</p>
          <ul style="color: #64748b; margin-top: 1rem; padding-left: 1.5rem;">
            <li>Sellers monetize unused AI credits</li>
            <li>Buyers get affordable access to tokens</li>
            <li>All backed by secure payments and verification</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  
  <!-- How It Works Section -->
  <section class="section" id="how-it-works">
    <div class="container">
      <h2 class="section-title">How TokenFlow Works</h2>
      <div class="process-flow">
        <div class="process-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3 class="step-title">Login and Connect</h3>
            <p>Users log in via a secure portal with end-to-end encryption (AES-256) protecting all data.</p>
          </div>
        </div>
        <div class="process-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3 class="step-title">List Your Tokens</h3>
            <p>Sellers add their API key, TokenFlow verifies available balance securely, and lists the number of tokens they want to sell with automatically calculated pricing.</p>
          </div>
        </div>
        <div class="process-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3 class="step-title">Buyer Browses and Selects</h3>
            <p>Buyers search listings by AI provider, token amount, and price range before proceeding to purchase.</p>
          </div>
        </div>
        <div class="process-step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3 class="step-title">Secure Purchase</h3>
            <p>Payment happens via UPI — fast and reliable for Indian users. Dashboards update for both parties once payment is complete.</p>
          </div>
        </div>
        <div class="process-step">
          <div class="step-number">5</div>
          <div class="step-content">
            <h3 class="step-title">Token Access Begins</h3>
            <p>Buyers are granted usage access from their TokenFlow dashboard with simple and transparent usage.</p>
          </div>
        </div>
        <div class="process-step">
          <div class="step-number">6</div>
          <div class="step-content">
            <h3 class="step-title">Review and Repeat</h3>
            <p>Buyers and sellers rate each other, sellers continue to list tokens weekly/monthly, and buyers can subscribe to their favorite sellers.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Security Section -->
  <section class="section" id="security">
    <div class="container">
      <h2 class="section-title">Security First</h2>
      <div class="card-container">
        <div class="card">
          <div class="card-icon">🔐</div>
          <h3 class="card-title">API Key Protection</h3>
          <p class="card-content">TokenFlow verifies API keys without storing them, ensuring your credentials remain secure.</p>
        </div>
        <div class="card">
          <div class="card-icon">🔒</div>
          <h3 class="card-title">End-to-End Encryption</h3>
          <p class="card-content">Military-grade AES-256 encryption protects all data in transit and at rest.</p>
        </div>
        <div class="card">
          <div class="card-icon">💳</div>
          <h3 class="card-title">Secure Payments</h3>
          <p class="card-content">Transparent UPI-based payment flow for fast, reliable transactions.</p>
        </div>
        <div class="card">
          <div class="card-icon">📊</div>
          <h3 class="card-title">Activity Logging</h3>
          <p class="card-content">All user sessions and token updates are logged securely for transparency.</p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Use Cases Section -->
  <section class="section" id="use-cases">
    <div class="container">
      <h2 class="section-title">Use Cases</h2>
      <div class="card-container">
        <div class="card">
          <div class="card-icon">🎓</div>
          <h3 class="card-title">Students</h3>
          <p class="card-content">Testing AI-powered projects without expensive subscriptions.</p>
        </div>
        <div class="card">
          <div class="card-icon">🧪</div>
          <h3 class="card-title">Indie Developers</h3>
          <p class="card-content">Running quick prototypes to validate ideas before scaling.</p>
        </div>
        <div class="card">
          <div class="card-icon">💼</div>
          <h3 class="card-title">Startups</h3>
          <p class="card-content">Avoiding high enterprise pricing during early stages of growth.</p>
        </div>
        <div class="card">
          <div class="card-icon">🧍</div>
          <h3 class="card-title">Token Providers</h3>
          <p class="card-content">Anyone with unused AI credits who wants to recover value.</p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Future Scope Section -->
  <section class="section" id="future-scope">
    <div class="container">
      <h2 class="section-title">Future Scope</h2>
      <div class="future-grid">
        <div class="future-card">
          <div class="future-icon">📱</div>
          <h3 class="future-title">Mobile Application</h3>
          <p>Develop mobile apps for iOS and Android, enabling users to manage tokens and monitor market trends on the go.</p>
        </div>
        <div class="future-card">
          <div class="future-icon">📊</div>
          <h3 class="future-title">Advanced Analytics</h3>
          <p>Integrate detailed analytics dashboards for tracking token usage patterns, market trends, and user engagement.</p>
        </div>
        <div class="future-card">
          <div class="future-icon">🧩</div>
          <h3 class="future-title">API & SDK Enhancements</h3>
          <p>Offer more robust APIs and SDKs for seamless integration with additional AI service providers and third-party platforms.</p>
        </div>
        <div class="future-card">
          <div class="future-icon">🏆</div>
          <h3 class="future-title">
        </div>
      </div>
    </div>
  </section>
</body>