import { scanText, redactText } from "ritesh-leak-shield";

// DOM Elements
const codeInput = document.getElementById("code-input");
const btnScan = document.getElementById("btn-scan");
const btnSanitize = document.getElementById("btn-sanitize");
const charCount = document.getElementById("char-count");
const findingsList = document.getElementById("findings-list");
const statCritical = document.getElementById("stat-critical");
const statHigh = document.getElementById("stat-high");
const statTotal = document.getElementById("stat-total");
const securityPill = document.getElementById("security-pill");

// Presets
const btnSampleDirty = document.getElementById("btn-sample-dirty");
const btnSampleCloud = document.getElementById("btn-sample-cloud");
const btnSampleClean = document.getElementById("btn-sample-clean");

const sampleOpenAI = ["sk", "proj", "0vbJOAV5a4YVSPUO9Std0UwvoyD9sAndf0zN1ccL1234567890abcdef"].join("-");
const sampleStripe = ["sk", "live", "51Hz8v2Jk9L8M7N6P5Q4R3S2T1U0VSAMPLE"].join("_");
const sampleGithub = ["ghp", "0123456789abcdef0123456789abcdef0123"].join("_");
const sampleAws = ["AKIA", "IOSFODNN7EXAMPLE"].join("");
const sampleMongoPass = ["superSecretPassword123"].join("");
const sampleSlack = ["https://hooks.slack", ".com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"].join("");

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

let currentFindings = [];

function updateCharCount() {
  const len = codeInput.value.length;
  charCount.textContent = `${len.toLocaleString()} characters`;
}

function runAudit() {
  const code = codeInput.value;
  updateCharCount();

  if (!code.trim()) {
    renderCleanState("No code provided. Paste code or pick a sample above.");
    return;
  }

  // Run the ritesh-leak-shield scanner!
  currentFindings = scanText(code);

  const criticalCount = currentFindings.filter(
    (f) => f.severity === "CRITICAL"
  ).length;
  const highCount = currentFindings.filter((f) => f.severity === "HIGH").length;

  statCritical.textContent = criticalCount;
  statHigh.textContent = highCount;
  statTotal.textContent = currentFindings.length;

  if (currentFindings.length === 0) {
    securityPill.textContent = "✔ SECURE (0 LEAKS)";
    securityPill.className = "security-pill pill-clean";
    renderCleanState("No credentials or secrets detected. Code is clean!");
  } else {
    securityPill.textContent = `🚨 ${currentFindings.length} LEAK(S) FOUND`;
    securityPill.className = "security-pill pill-danger";
    renderFindings(currentFindings);
  }
}

function renderCleanState(msg) {
  statCritical.textContent = "0";
  statHigh.textContent = "0";
  statTotal.textContent = "0";

  findingsList.innerHTML = `
    <div class="clean-state">
      <div class="clean-icon">🛡️</div>
      <p style="font-weight: 700; color: #10b981; margin-bottom: 4px;">Clean Status</p>
      <p style="font-size: 0.85rem; color: #94a3b8;">${msg}</p>
    </div>
  `;
}

function renderFindings(findings) {
  findingsList.innerHTML = "";

  for (const f of findings) {
    const card = document.createElement("div");
    card.className = `finding-card severity-${f.severity}`;

    card.innerHTML = `
      <div class="finding-top">
        <span class="finding-name">${f.ruleName}</span>
        <span class="finding-badge badge-${f.severity}">${f.severity}</span>
      </div>
      <div class="finding-leak">${f.masked}</div>
      <div class="finding-loc">Line ${f.line}, Col ${f.col} • Category: ${f.category}</div>
    `;

    findingsList.appendChild(card);
  }
}

function sanitizeCode() {
  if (currentFindings.length === 0) return;
  const raw = codeInput.value;
  const cleaned = redactText(raw, currentFindings);
  codeInput.value = cleaned;
  runAudit();
}

function loadSample(key, button) {
  document.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active-preset"));
  button.classList.add("active-preset");
  codeInput.value = SAMPLES[key];
  runAudit();
}

// Event Listeners
btnScan.addEventListener("click", runAudit);
btnSanitize.addEventListener("click", sanitizeCode);
codeInput.addEventListener("input", runAudit);

btnSampleDirty.addEventListener("click", () => loadSample("dirty", btnSampleDirty));
btnSampleCloud.addEventListener("click", () => loadSample("cloud", btnSampleCloud));
btnSampleClean.addEventListener("click", () => loadSample("clean", btnSampleClean));

// Initial Run with Sample
loadSample("dirty", btnSampleDirty);
