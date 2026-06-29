import { ODRLValidator } from "odrl-validator";
import { Parser } from "n3";
import { examples } from "./Examples";

const policyInput = document.getElementById("policy") as HTMLTextAreaElement;
const validateBtn = document.getElementById("validateBtn")!;
const summaryEl = document.getElementById("summary")!;
const validationEl = document.getElementById("validationResults")!;
const conflictsEl = document.getElementById("conflicts")!;
const conflictsSection = document.getElementById("conflictsSection")!;
const examplesSelect = document.getElementById("examples") as HTMLSelectElement;

policyInput.scrollIntoView({ behavior: "smooth" });

function initExamples() {
  examples.forEach((ex, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = ex.label;
    examplesSelect.appendChild(opt);
  });
}

initExamples();

validateBtn.addEventListener("click", async () => {
  resetUI();

  const policyText = policyInput.value.trim();
  if (!policyText) {
    summaryEl.textContent = "Please enter an ODRL policy.";
    return;
  }

  try {
    const parser = new Parser();
    const quads = parser.parse(policyText);

    const validator = new ODRLValidator();
    const evaluation = await validator.validate(quads);
    console.log(JSON.stringify(evaluation))
    renderSummary(evaluation);
    renderValidation(evaluation);
    renderConflicts(evaluation);

  } catch (err) {
    summaryEl.textContent = "Parsing/validation error.";
    console.error(err);
  }
});

examplesSelect.addEventListener("change", async () => {
  resetUI();

  const idx = examplesSelect.value;
  if (!idx) return;

  const example = examples[Number(idx)];
  policyInput.value = "Loading...";

  try {
    const res = await fetch(example.url);
    const text = await res.text();

    policyInput.value = text;

  } catch (err) {
    console.error(err);
    alert("Failed to load example policy.");
  }
});

// ---------- UI helpers ----------

function resetUI() {
  summaryEl.innerHTML = "";
  validationEl.innerHTML = "";
  conflictsEl.innerHTML = "";
  conflictsSection.style.display = "none";
}

function renderSummary(evaluation: any) {
  const warnings = evaluation.validationResults.filter(
    (r: any) =>  r.severity.includes("Warning")
  ).length;

  const errors = evaluation.validationResults.filter(
    (r: any) => r.severity.includes("Violation")
  ).length;

  const conflicts = evaluation.conflicts.length;

  summaryEl.innerHTML = `
    <span class="count error">🔴 Errors: ${errors}</span>
    <span class="count warning">🟡 Warnings: ${warnings}</span>
    <span class="count conflict">🔵 Conflicts: ${conflicts}</span>
  `;

  if (!evaluation.valid) {
    summaryEl.innerHTML += `
      <div class="error">
        Inconsistency detection will NOT run until validation passes.
      </div>
    `;
  }
}

function renderValidation(evaluation: any) {
  evaluation.validationResults.forEach((r: any) => {
    const type = r.severity.includes("Violation")
      ? "error"
      : "warning";

    const symbol = type === "error" ? "🔴" : "🟡";

    const el = createItem(
      symbol,
      r.message,
      `
      <div><b>Focus:</b> ${r.focusNode}</div>
      <div><b>Value:</b> ${r.valueNode}</div>
      `,
      type
    );

    validationEl.appendChild(el);
  });
}

function renderConflicts(evaluation: any) {
  conflictsSection.style.display = "block";

  // Skip conflicts if invalid (your rule)
  if (!evaluation.valid) {
    conflictsSection.style.display = "none";
    return;
  } 

  evaluation.conflicts.forEach((c: any) => {
    const el = createItem(
      "🔵",
      c.message,
      `
      <div><b>Type:</b> ${c.type}</div>
      <div><b>Rule A:</b> ${c.ruleA}</div>
      <div><b>Rule B:</b> ${c.ruleB}</div>
      `,
      "conflict"
    );

    conflictsEl.appendChild(el);
  });
}

function createItem(symbol: string, message: string, details: string, cls: string) {
  const el = document.createElement("div");
  el.className = `item ${cls}`;

  el.innerHTML = `
    <div><b>${symbol}</b> ${message}</div>
    <div class="details">${details}</div>
  `;

  el.addEventListener("click", () => {
    el.classList.toggle("open");
  });

  return el;
}

