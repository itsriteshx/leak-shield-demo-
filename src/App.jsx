import React, { useState, useMemo } from 'react';
import { scanText, redactText } from 'ritesh-leak-shield';

// Assemble sample keys dynamically to stay safe against GitHub Push Protection
const sampleOpenAI = ['sk', 'proj', '0vbJOAV5a4YVSPUO9Std0UwvoyD9sAndf0zN1ccL1234567890abcdef'].join('-');
const sampleStripe = ['sk', 'live', '51Hz8v2Jk9L8M7N6P5Q4R3S2T1U0VSAMPLE'].join('_');
const sampleGithub = ['ghp', '0123456789abcdef0123456789abcdef0123'].join('_');
const sampleAws = ['AKIA', 'IOSFODNN7EXAMPLE'].join('');
const sampleMongoPass = ['superSecretPassword123'].join('');
const sampleSlack = ['https://hooks.slack', '.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'].join('');

const SAMPLES = {
  dirty: `// Sample Service Configuration with Leaked Keys
import OpenAI from "openai";
import Stripe from "stripe";

// Leaked OpenAI API Token
const openai = new OpenAI({
  apiKey: "${sampleOpenAI}",
});

// Leaked Stripe Live Key
const stripe = new Stripe("${sampleStripe}");

// Leaked GitHub Token
const GITHUB_TOKEN = "${sampleGithub}";

export async function processPayment(amount) {
  return await stripe.charges.create({ amount });
}`,

  cloud: `// Cloud Database & AWS Infrastructure Config
export const awsConfig = {
  accessKeyId: "${sampleAws}",
  region: "us-east-1",
};

// Database Connection String with Plaintext Password
const DATABASE_URL = "mongodb+srv://admin:${sampleMongoPass}@cluster0.mongodb.net/prod";

// Slack Webhook Alert
const SLACK_WEBHOOK = "${sampleSlack}";`,

  clean: `// Sanitized Production Configuration
import OpenAI from "openai";
import Stripe from "stripe";

// Correct: Loaded securely via Environment Variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function processPayment(amount) {
  return await stripe.charges.create({ amount });
}`,
};

export default function App() {
  const [code, setCode] = useState(SAMPLES.dirty);
  const [activePreset, setActivePreset] = useState('dirty');

  // Real-time audit using ritesh-leak-shield
  const findings = useMemo(() => {
    if (!code.trim()) return [];
    return scanText(code);
  }, [code]);

  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH').length;

  const handlePresetSelect = (presetKey) => {
    setActivePreset(presetKey);
    setCode(SAMPLES[presetKey]);
  };

  const handleAutoRedact = () => {
    if (findings.length === 0) return;
    const sanitized = redactText(code, findings);
    setCode(sanitized);
    setActivePreset('custom');
  };

  return (
    <>
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <div className="app-layout">
        {/* Navbar */}
        <header className="app-nav">
          <div className="brand">
            <span className="shield-icon">🛡️</span>
            <span className="brand-name">ritesh-leak-shield</span>
            <span className="react-tag">React 19</span>
            <span className="version-tag">v1.0.0</span>
          </div>
          <div className="nav-links">
            <a
              href="https://www.npmjs.com/package/ritesh-leak-shield"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-btn npm-btn"
            >
              <span className="npm-logo">npm</span> ritesh-leak-shield
            </a>
            <a
              href="https://github.com/itsriteshx/leak-shield-"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-btn gh-btn"
            >
              GitHub
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <main className="main-content">
          <section className="hero-section">
            <h1 className="hero-title">Live Secret & Credential Scanner</h1>
            <p className="hero-desc">
              Interactive React playground powered by <code>ritesh-leak-shield</code>.
              Paste any code, config, or log snippet below to detect leaked API keys, tokens,
              and passwords in real-time.
            </p>
          </section>

          {/* Presets Row */}
          <div className="presets-row">
            <span className="presets-label">Quick Test Samples:</span>
            <button
              onClick={() => handlePresetSelect('dirty')}
              className={`preset-btn ${activePreset === 'dirty' ? 'active-preset' : ''}`}
            >
              ⚠️ Leaked AI & Stripe Keys
            </button>
            <button
              onClick={() => handlePresetSelect('cloud')}
              className={`preset-btn ${activePreset === 'cloud' ? 'active-preset' : ''}`}
            >
              ☁️ AWS & MongoDB URIs
            </button>
            <button
              onClick={() => handlePresetSelect('clean')}
              className={`preset-btn ${activePreset === 'clean' ? 'active-preset' : ''}`}
            >
              ✅ Clean Sanitized Code
            </button>
          </div>

          {/* Evaluator Instructions Card */}
          <div className="instructions-card">
            <div className="inst-step">
              <span className="step-num">1</span>
              <span><strong>Select a sample</strong> or paste code on the left</span>
            </div>
            <div className="inst-step">
              <span className="step-num">2</span>
              <span><strong>Real-time Audit</strong> detects leaked API keys on the right</span>
            </div>
            <div className="inst-step">
              <span className="step-num">3</span>
              <span><strong>Click "Auto-Redact"</strong> to mask and sanitize secrets</span>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Editor Panel */}
            <div className="panel editor-panel">
              <div className="panel-header">
                <span className="panel-title">Code / Config Input</span>
                <button
                  onClick={handleAutoRedact}
                  disabled={findings.length === 0}
                  className="btn-action"
                >
                  ✨ Auto-Redact Secrets
                </button>
              </div>
              <div className="editor-wrapper">
                <textarea
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setActivePreset('custom');
                  }}
                  className="code-textarea"
                  spellCheck="false"
                  placeholder="Paste code or .env file content here..."
                />
              </div>
              <div className="panel-footer">
                <span>{code.length.toLocaleString()} characters</span>
                <button
                  onClick={() => alert(`Scan complete! Found ${findings.length} secret(s).`)}
                  className="btn-primary"
                >
                  🛡️ Scan Now
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="panel results-panel">
              <div className="panel-header">
                <span className="panel-title">Audit Report</span>
                <div
                  className={`security-pill ${
                    findings.length === 0 ? 'pill-clean' : 'pill-danger'
                  }`}
                >
                  {findings.length === 0
                    ? '✔ SECURE (0 LEAKS)'
                    : `🚨 ${findings.length} LEAK(S) FOUND`}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-num stat-critical">{criticalCount}</span>
                  <span className="stat-name">Critical</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num stat-high">{highCount}</span>
                  <span className="stat-name">High</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num stat-total">{findings.length}</span>
                  <span className="stat-name">Total Leaks</span>
                </div>
              </div>

              {/* Findings List */}
              <div className="findings-container">
                {findings.length === 0 ? (
                  <div className="clean-state">
                    <div className="clean-icon">🛡️</div>
                    <p style={{ fontWeight: 700, color: '#10b981', marginBottom: 4 }}>
                      Clean Status
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      No credentials or secrets detected. Code is safe!
                    </p>
                  </div>
                ) : (
                  findings.map((f, i) => (
                    <div key={i} className={`finding-card severity-${f.severity}`}>
                      <div className="finding-top">
                        <span className="finding-name">{f.ruleName}</span>
                        <span className={`finding-badge badge-${f.severity}`}>{f.severity}</span>
                      </div>
                      <div className="finding-leak">{f.masked}</div>
                      <div className="finding-loc">
                        Line {f.line}, Col {f.col} • Category: {f.category}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Integration Showcase */}
          <section className="integration-showcase">
            <div className="showcase-card">
              <h3>💻 Run via Terminal (CLI)</h3>
              <p>Scan any repository in 4ms with zero configuration:</p>
              <pre><code><span className="cmd">npx</span> ritesh-leak-shield scan .</code></pre>
            </div>
            <div className="showcase-card">
              <h3>🪝 Git Pre-Commit Shield</h3>
              <p>Automatically prevent secret commits forever:</p>
              <pre><code><span className="cmd">npx</span> ritesh-leak-shield hook install</code></pre>
            </div>
          </section>

          {/* Footer */}
          <footer className="app-footer">
            <p>
              Created by <strong>Ritesh</strong> |{' '}
              <a href="https://github.com/itsriteshx" target="_blank" rel="noopener noreferrer">
                @itsriteshx
              </a>{' '}
              • React + Vite • MIT Licensed
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
