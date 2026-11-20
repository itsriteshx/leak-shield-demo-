# 🛡️ ritesh-leak-shield Web Playground

> **An interactive, live DevSecOps web playground built with React 19 & Vite, showcasing the [`ritesh-leak-shield`](https://www.npmjs.com/package/ritesh-leak-shield) NPM security package.**

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![npm version](https://img.shields.io/npm/v/ritesh-leak-shield.svg)](https://www.npmjs.com/package/ritesh-leak-shield)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🔗 Live Links & Ecosystem

| Resource | Link |
| :--- | :--- |
| 🌐 **Live Web Application** | [https://itsriteshx.github.io/leak-shield-demo-/](https://itsriteshx.github.io/leak-shield-demo-/) *(or Vercel Deployment)* |
| 📦 **NPM Package** | [`ritesh-leak-shield` on npmjs.com](https://www.npmjs.com/package/ritesh-leak-shield) |
| 🛡️ **Package Repository** | [https://github.com/itsriteshx/leak-shield-](https://github.com/itsriteshx/leak-shield-) |
| 💻 **Demo Repository** | [https://github.com/itsriteshx/leak-shield-demo-](https://github.com/itsriteshx/leak-shield-demo-) |

---

## 🎯 Purpose & Overview

When developing modern software, engineers accidentally hardcode API keys, passwords, and tokens into source code, which leads to catastrophic data breaches when pushed to public GitHub repositories.

This project is a **live interactive web playground** that allows developers and security auditors to test the [`ritesh-leak-shield`](https://www.npmjs.com/package/ritesh-leak-shield) package directly in their browser. It provides real-time secret detection, severity scoring, and 1-click automatic code redaction.

---

## 🌟 Key Features Showcased

- ⚡ **Sub-Millisecond Real-Time Scanning**: Powered by client-side execution of `ritesh-leak-shield` with zero network overhead.
- 🎯 **24+ Secret Patterns Tested**:
  - **AI & LLM**: OpenAI (`sk-`, `sk-proj-`), Anthropic Claude (`sk-ant-`), Google Gemini (`AIzaSy...`), HuggingFace.
  - **Cloud Infrastructure**: AWS Access Key ID (`AKIA...`), AWS Secret Keys, Cloudflare tokens.
  - **Payments & Billing**: Stripe Live Keys (`sk_live_`), Webhook signatures (`whsec_`), Razorpay.
  - **Databases**: MongoDB URIs with plaintext passwords, PostgreSQL, Redis.
  - **Developer Tokens**: GitHub Personal Access Tokens (`ghp_`), GitLab tokens, JWTs, Private Keys.
- 🎭 **1-Click Auto-Redaction (`redactText`)**: Automatically masks all identified secrets with bullet points (`sk_live_•••••••PLE`), generating clean, ready-to-share safe code.
- 🎛️ **Pre-Loaded Quick Presets**:
  - `⚠️ Leaked AI & Stripe Keys`: Demonstrates multi-vendor API key detection.
  - `☁️ AWS & MongoDB URIs`: Demonstrates cloud credentials and database password parsing.
  - `✅ Clean Sanitized Code`: Demonstrates clean-state validation with 0 false positives.
- 📊 **Security Audit Breakdown**: Displays Total Leaks count, Critical and High severity counters, exact Line numbers, and column offsets.

---

## 🛠️ Tech Stack & Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│      (Interactive UI, State Management, Presets)       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             ritesh-leak-shield NPM Package             │
│   • scanText()      ➔ Pattern matching & line indexing │
│   • redactText()    ➔ Masking & safe replacement       │
│   • Shannon Entropy ➔ Random secret hash detector      │
└────────────────────────────────────────────────────────┘
```

- **Frontend Library:** [React 19](https://react.dev/) (`useState`, `useMemo` for reactive scanning)
- **Build Tool:** [Vite 5](https://vitejs.dev/) (Instant HMR, production tree-shaking)
- **Security Engine:** [`ritesh-leak-shield`](https://www.npmjs.com/package/ritesh-leak-shield) (Zero dependencies)
- **Design System:** Custom DevSecOps Dark Theme with Glassmorphism and responsive layout

---

## 💻 How the Demo Integrates `ritesh-leak-shield`

```javascript
import React, { useState, useMemo } from 'react';
import { scanText, redactText } from 'ritesh-leak-shield';

function SecretScanner() {
  const [code, setCode] = useState('const key = "sk-proj-abc1234567890...";');

  // Real-time audit on every keystroke (< 1ms)
  const findings = useMemo(() => scanText(code), [code]);

  // 1-Click automatic sanitization
  const handleAutoRedact = () => {
    const cleanCode = redactText(code, findings);
    setCode(cleanCode);
  };

  return (
    <div>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      <button onClick={handleAutoRedact}>Sanitize Code</button>
      <p>Leaks Found: {findings.length}</p>
    </div>
  );
}
```

---

## 🚀 Local Development Setup

To run this demo locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/itsriteshx/leak-shield-demo-.git
   cd leak-shield-demo-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 👨‍💻 Author

**Ritesh**
- GitHub: [@itsriteshx](https://github.com/itsriteshx)
- Email: royalritesh749291@gmail.com
- NPM Profile: [itsriteshx!](https://www.npmjs.com/~itsriteshx!)

---

## 📄 License

This demo application is open-sourced under the [MIT License](LICENSE).
