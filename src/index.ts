import { ODRLValidator }  from "odrl-validator";

import { Parser, Store } from "n3";

const policyInput = document.getElementById("policy") as HTMLTextAreaElement;
const validateBtn = document.getElementById("validateBtn")!;
const resultEl = document.getElementById("result")!;

validateBtn.addEventListener("click", async () => {
  const policyText = policyInput.value.trim();
  if (!policyText) {
    resultEl.textContent = "Please enter an ODRL policy.";
    return;
  }

  try {
    const parser = new Parser();
    const quads = parser.parse(policyText);

    const validator = new ODRLValidator();
    const evaluation = await validator.validate(quads);

    resultEl.textContent = JSON.stringify(evaluation, null, 2);
  } catch (err) {
    resultEl.textContent = "Error parsing or validating policy:\n" + err;
    console.error(err);
  }
});