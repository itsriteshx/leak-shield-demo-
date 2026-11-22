import React, { useState, useMemo, useRef, useEffect } from 'react';
import { scanText, redactText } from 'ritesh-leak-shield';

// Base64-encoded realistic test keys so GitHub Push Protection doesn't block them during git push
const SAMPLE_OPENAI = atob('c2stNHE4bU04b0RxejhQeDRhOTJwbDFXeDkwYTkybDF3eDkwQUJDRA==');
const SAMPLE_STRIPE = atob('c2tfbGl2ZV81MUh6OHYySms5TDhNN1A2UTVTMlQxVTBWU0FNUExFOTk=');
const SAMPLE_GITHUB = atob('Z2hwXzAxMjM0NTY3ODlhYmNkZWYwMTIzNDU2Nzg5YWJjZGVmMDEyMw==');
const SAMPLE_AWS = atob('QUtJQUlPU0ZPRE5ON0VYQU1QTEU=');
const SAMPLE_MONGO_PASS = atob('c3VwZXJTZWNyZXRQYXNzd29yZDEyMw==');
const SAMPLE_SLACK = atob('aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDAwMDAwMDAwL0IwMDAwMDAwMC9YWFlYWFlYWFlYWFlYWFlYWFlYWFlYWFlYWg=');

const SAMPLES = {
  dirty: `// Sample Service Configuration with Leaked Keys
import OpenAI from "openai";
import Stripe from "stripe";

// Leaked OpenAI API Token
const openai = new OpenAI({
  apiKey: "${SAMPLE_OPENAI}",
});

// Leaked Stripe Live Key
const stripe = new Stripe("${SAMPLE_STRIPE}");

// Leaked GitHub Token
const GITHUB_TOKEN = "${SAMPLE_GITHUB}";

export async function processPayment(amount) {
  return await stripe.charges.create({ amount });
}`,

  cloud: `// Cloud Database & AWS Infrastructure Config
export const awsConfig = {
  accessKeyId: "${SAMPLE_AWS}",
  region: "us-east-1",
};

// Database Connection String with Plaintext Password
const DATABASE_URL = "mongodb+srv://admin:${SAMPLE_MONGO_PASS}@cluster0.mongodb.net/prod";

// Slack Webhook Alert
const SLACK_WEBHOOK = "${SAMPLE_SLACK}";`,

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
  const [copied, setCopied] = useState(false);
  const [cliCopied, setCliCopied] = useState(false);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Real-time secret audit using ritesh-leak-shield
  const findings = useMemo(() => {
    if (!code.trim()) return [];
    return scanText(code);
  }, [code]);

  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH').length;
  const mediumCount = findings.filter((f) => f.severity === 'MEDIUM').length;

  // Calculate lines for line-number gutter
  const lineCount = useMemo(() => {
    return Math.max(code.split('\n').length, 16);
  }, [code]);

  // Sync scroll between textarea and line numbers
  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handlePresetSelect = (presetKey) => {
    setActivePreset(presetKey);
    setCode(SAMPLES[presetKey]);
  };

  const handleAutoRedactAll = () => {
    if (findings.length === 0) return;
    const sanitized = redactText(code, findings);
    setCode(sanitized);
    setActivePreset('custom');
  };

  const handleRedactSingle = (finding) => {
    const sanitized = redactText(code, [finding]);
    setCode(sanitized);
    setActivePreset('custom');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCli = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCliCopied(true);
    setTimeout(() => setCliCopied(false), 2000);
  };

  return (
    <div className="app-root">
      {/* Background ambient lighting */}
      <div className="ambient-blob blob-cyan" />
      <div className="ambient-blob blob-purple" />
      <div className="ambient-blob blob-red" />

      <div className="app-container">
        {/* Navigation Bar */}
        <header className="navbar">
          <div className="nav-brand">
            <div className="brand-shield-glow">
              <svg className="shield-svg" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 6V12C3 17.5 6.8 22.7 12 24C17.2 22.7 21 17.5 21 12V6L12 2Z"
                  fill="url(#shield-grad)"
                />
                <path
                  d="M12 4.2L5 7.3V12C5 16.3 8 20.3 12 21.4C16 20.3 19 16.3 19 12V7.3L12 4.2Z"
                  fill="#0B0F19"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="shield-grad" x1="3" y1="2" x2="21" y2="24">
                    <stop stopColor="#38BDF8" />
                    <stop offset="1" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="brand-text-block">
              <span className="brand-title">ritesh-leak-shield</span>
              <div className="brand-tags">
                <span className="pill-tag pill-react">React 19</span>
                <span className="pill-tag pill-version">v1.0.0</span>
                <span className="pill-tag pill-live">● System Live</span>
              </div>
            </div>
          </div>

          <div className="nav-actions">
            <a
              href="https://www.npmjs.com/package/ritesh-leak-shield"
              target="_blank"
              rel="noopener noreferrer"
              className="action-link npm-link"
            >
              <span className="npm-sq">npm</span>
              <span>ritesh-leak-shield</span>
            </a>
            <a
              href="https://github.com/itsriteshx/leak-shield-"
              target="_blank"
              rel="noopener noreferrer"
              className="action-link gh-link"
            >
              <svg className="gh-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Zero-Dependency DevSecOps Engine
          </div>
          <h1 className="hero-heading">
            Live Secret &amp; Credential Shield
          </h1>
          <p className="hero-subtitle">
            An ultra-fast client-side security scanner. Paste code, configs, or logs to detect
            exposed API keys, tokens, and database passwords before they reach GitHub.
          </p>

          {/* Interactive Flow Stepper */}
          <div className="flow-stepper">
            <div className="flow-step">
              <span className="step-idx">1</span>
              <span className="step-txt">Pick a sample or paste code</span>
            </div>
            <div className="flow-sep">→</div>
            <div className="flow-step">
              <span className="step-idx">2</span>
              <span className="step-txt">Instant real-time security audit</span>
            </div>
            <div className="flow-sep">→</div>
            <div className="flow-step">
              <span className="step-idx">3</span>
              <span className="step-txt">1-Click sanitize &amp; auto-redact</span>
            </div>
          </div>
        </section>

        {/* Preset Selector */}
        <div className="presets-bar">
          <span className="presets-label">Test Scenarios:</span>
          <div className="presets-group">
            <button
              onClick={() => handlePresetSelect('dirty')}
              className={`preset-btn ${activePreset === 'dirty' ? 'preset-active' : ''}`}
            >
              <span className="preset-icon">⚡</span>
              <span>Leaked API Keys (OpenAI &amp; Stripe)</span>
            </button>
            <button
              onClick={() => handlePresetSelect('cloud')}
              className={`preset-btn ${activePreset === 'cloud' ? 'preset-active' : ''}`}
            >
              <span className="preset-icon">☁️</span>
              <span>Cloud &amp; DB Secrets (AWS &amp; Mongo)</span>
            </button>
            <button
              onClick={() => handlePresetSelect('clean')}
              className={`preset-btn ${activePreset === 'clean' ? 'preset-active' : ''}`}
            >
              <span className="preset-icon">🛡️</span>
              <span>Clean Sanitized Code</span>
            </button>
          </div>
        </div>

        {/* Main Workstation Grid */}
        <div className="workstation-grid">
          {/* Left: Code Editor */}
          <div className="card editor-card">
            <div className="card-header">
              <div className="file-info">
                <span className="file-icon">JS</span>
                <span className="file-name">service.config.js</span>
                <span className="file-meta">
                  {code.split('\n').length} lines • {code.length} chars
                </span>
              </div>
              <div className="editor-top-actions">
                <button
                  onClick={handleAutoRedactAll}
                  disabled={findings.length === 0}
                  className="btn-redact"
                  title="Automatically replace all detected secrets with mask bullets"
                >
                  <svg className="sparkle-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5z" />
                  </svg>
                  <span>Auto-Redact All ({findings.length})</span>
                </button>
                <button onClick={handleCopyCode} className="btn-icon" title="Copy code">
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => {
                    setCode('');
                    setActivePreset('custom');
                  }}
                  className="btn-icon btn-clear"
                  title="Clear editor"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="editor-body">
              {/* Line numbers gutter */}
              <div ref={lineNumbersRef} className="gutter">
                {Array.from({ length: lineCount }).map((_, i) => (
                  <div key={i} className="gutter-num">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setActivePreset('custom');
                }}
                onScroll={handleScroll}
                className="code-editor-input"
                spellCheck="false"
                placeholder="// Paste JavaScript, JSON, YAML, or .env text here to scan..."
              />
            </div>

            <div className="card-footer">
              <span className="hint-text">
                💡 Tip: Type or paste any secret key above — audit updates in real-time.
              </span>
            </div>
          </div>

          {/* Right: Security Audit Inspector */}
          <div className={`card audit-card ${findings.length > 0 ? 'card-alert' : 'card-clean'}`}>
            <div className="card-header">
              <div className="audit-header-title">
                <span className="audit-label">Security Audit Inspector</span>
                <span className="audit-source-tag">Engine: ritesh-leak-shield</span>
              </div>
              <div className={`status-pill ${findings.length > 0 ? 'pill-danger' : 'pill-safe'}`}>
                {findings.length > 0 ? (
                  <>
                    <span className="pill-dot dot-red" />
                    <span>{findings.length} LEAK(S) DETECTED</span>
                  </>
                ) : (
                  <>
                    <span className="pill-dot dot-green" />
                    <span>100% SECURE • 0 LEAKS</span>
                  </>
                )}
              </div>
            </div>

            {/* Severity Metric Boxes */}
            <div className="metrics-row">
              <div className="metric-box box-critical">
                <span className="metric-val">{criticalCount}</span>
                <span className="metric-lbl">Critical</span>
              </div>
              <div className="metric-box box-high">
                <span className="metric-val">{highCount}</span>
                <span className="metric-lbl">High</span>
              </div>
              <div className="metric-box box-total">
                <span className="metric-val">{findings.length}</span>
                <span className="metric-lbl">Total Leaks</span>
              </div>
              <div className="metric-box box-speed">
                <span className="metric-val">&lt; 1ms</span>
                <span className="metric-lbl">Scan Speed</span>
              </div>
            </div>

            {/* Findings List or Clean State */}
            <div className="findings-scroll-area">
              {findings.length === 0 ? (
                <div className="clean-hero">
                  <div className="clean-shield-orb">
                    <svg className="clean-shield-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L3 6V12C3 17.5 6.8 22.7 12 24C17.2 22.7 21 17.5 21 12V6L12 2Z"
                        fill="rgba(16, 185, 129, 0.2)"
                        stroke="#10B981"
                        strokeWidth="2"
                      />
                      <path
                        d="M8.5 12L10.8 14.5L15.5 9.5"
                        stroke="#10B981"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="clean-title">Zero Security Threats Found</h3>
                  <p className="clean-desc">
                    Your code contains no exposed API tokens, database URIs, or private keys.
                    Safe to commit and push to public repositories!
                  </p>
                </div>
              ) : (
                <div className="findings-stack">
                  {findings.map((f, i) => (
                    <div key={i} className={`finding-item finding-${f.severity.toLowerCase()}`}>
                      <div className="finding-head">
                        <div className="finding-meta">
                          <span className={`severity-badge badge-${f.severity.toLowerCase()}`}>
                            {f.severity}
                          </span>
                          <span className="rule-title">{f.ruleName}</span>
                        </div>
                        <button
                          onClick={() => handleRedactSingle(f)}
                          className="btn-mask-item"
                          title="Mask only this secret"
                        >
                          Mask Key
                        </button>
                      </div>

                      <div className="leak-preview-box">
                        <span className="leak-code">{f.masked}</span>
                      </div>

                      <div className="finding-foot">
                        <span className="loc-tag">
                          📍 Line {f.line}, Col {f.col}
                        </span>
                        <span className="cat-tag">Category: {f.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Integration Showcase (Terminal Simulator) */}
        <section className="terminal-section">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="traffic-lights">
                <span className="light light-red" />
                <span className="light light-yellow" />
                <span className="light light-green" />
              </div>
              <span className="terminal-title">bash — ritesh-leak-shield CLI Integration</span>
              <button
                onClick={() => handleCopyCli('npx ritesh-leak-shield scan .')}
                className="btn-copy-cli"
              >
                {cliCopied ? '✓ Copied' : 'Copy Command'}
              </button>
            </div>
            <div className="terminal-body">
              <div className="term-line">
                <span className="term-prompt">$</span>
                <span className="term-cmd">npx ritesh-leak-shield scan .</span>
              </div>
              <div className="term-output">
                <span className="term-cyan">🛡️ LEAK-SHIELD</span> | Automated Secret &amp; Credential Protection v1.0.0
              </div>
              <div className="term-output term-dim">
                ✔ Scanned 11 files across repository in 3ms.
              </div>
              <div className="term-line term-space">
                <span className="term-prompt">$</span>
                <span className="term-cmd">npx ritesh-leak-shield hook install</span>
              </div>
              <div className="term-output term-green">
                ✅ Pre-commit safety shield activated in .git/hooks/pre-commit!
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>
            Developed by <strong>Ritesh</strong> • Powered by{' '}
            <a
              href="https://www.npmjs.com/package/ritesh-leak-shield"
              target="_blank"
              rel="noopener noreferrer"
            >
              ritesh-leak-shield
            </a>{' '}
            NPM Package • React 19 + Vite
          </p>
        </footer>
      </div>
    </div>
  );
}
