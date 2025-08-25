import { assert } from "jsr:@std/assert@^1.0.14";
import { cmmc, stringify } from "./cmmc-pack.ts";

Deno.test("cmmc-pack TODO", () => {
  // Example CMMC-ish payload
  const json = {
    id: "u1",
    userName: "Alice",
    isActive: true,
    mp: { implementationStatus: "Partially" },
    pp: { implementationStatus: "Fully implemented" },
    ac: {
      implementationStatus: "Partial",
      implementationStatus2: "Not implemented",
    },
    iu: { implementationStatus: "Fully" },
    sc: {
      implementationStatus: "Partially",
      implementationStatus2: "Not implemented",
      hasDiagram: "Yes",
      training: ["101", "ops"],
    },
    pf: {
      whoIsResponsibleForDevelopingAndApprovingCmmcRelatedPolicies: [
        "CISO",
      ],
      howFrequentlyAreCmmcRelatedPoliciesReviewedAndUpdated: ["Annually"],
      whatTrainingIsProvidedToEmployeesOnCmmcRelatedPolicies: ["Annual"],
      howIsComplianceWithCmmcRelatedPoliciesMonitored: ["Audits"],
      howAreExceptionsToCmmcRelatedPoliciesManaged: ["Formal process"],
    },
    ci: { ssn: "123-45-6789" }, // will block this in example below
  };

  // Build the pack
  const projections = cmmc({
    prefix: "cmmc.",
    includeAttr: true,
    includeFlags: true, // flags only under sc.* & si.* by default
    withMeta: {
      entityPred: "user",
      sourceId: "cmmc-fixture",
      booleanUnary: true,
    },
    blockedPaths: ["ci.ssn"], // drop PII (applies to all emitters + meta)
  });

  // End-to-end stringify
  const facts = stringify(json, {
    objectId: "u1",
    projections: [projections],
  });

  // Show a few highlights (the full list is sorted + deduped)
  assert(
    facts.filter((l) =>
      l.startsWith("cmmc.") ||
      l.startsWith("status_item(") ||
      l.startsWith("answered(") ||
      l.startsWith("answered_value(") ||
      l.startsWith("attr(") ||
      l.startsWith("flag(") ||
      l.startsWith("user(")
    ).join("\n"),
  );

  /* Expect examples like:
user("u1").
cmmc.user_name("u1", "Alice").
cmmc.is_active("u1", true).
status_item("u1", "mp", "partially").
status_item("u1", "pp", "fully").
status_item("u1", "ac", "partially").
status_item("u1", "ac", "not").
status_item("u1", "iu", "fully").
status_item("u1", "sc", "partially").
status_item("u1", "sc", "not").
answered("u1", "pf.whatTrainingIsProvidedToEmployeesOnCmmcRelatedPolicies").
answered_value("u1", "pf.whatTrainingIsProvidedToEmployeesOnCmmcRelatedPolicies", "Annual").
flag("u1", "sc.hasDiagram").
attr("u1", "userName", "Alice").
... (no facts for "ci.ssn" due to blocklist)
    */
});
