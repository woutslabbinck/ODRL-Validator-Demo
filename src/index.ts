import * as OdrlValidator from "odrl-validator";

const out = document.getElementById("out")!;

out.textContent =
  "Exports:\n" + Object.keys(OdrlValidator).sort().join("\n");

const validator = new OdrlValidator.ODRLValidator();
validator.validate([]).then(result => console.log(result))

// Once you know the API name, plug it in here.
// Example shape (you adapt):
// const report = await (OdrlValidator as any).validatePolicy(turtleString);
// console.log(report);
