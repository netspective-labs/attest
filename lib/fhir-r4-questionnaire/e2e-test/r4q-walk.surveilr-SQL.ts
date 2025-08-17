#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env
import { fromFileUrl, relative } from "jsr:@std/path@^1.1.2";
import { monotonicUlid } from "jsr:@std/ulid@^1.0.0";
import { Walker } from "../r4q-walk.ts";
import * as SQLa from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.14.9/render/mod.ts";
import * as tp from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.14.9/pattern/typical/mod.ts";

export function sqlInfoSchema<Context extends SQLa.SqlEmitContext>(
    ddlOptions: SQLa.SqlTextSupplierOptions<Context> & {
        readonly sqlNS?: SQLa.SqlNamespaceSupplier;
    },
) {
    const gm = tp.governedModel<
        tp.TypicalDomainQS,
        tp.TypicalDomainsQS,
        Context
    >(ddlOptions);
    const { domains: sd, keys, housekeeping } = gm;

    const qTable = gm.textPkTable(
        "e2e_test_questionnaire",
        {
            // TODO: add uniform_resource ingest sesesion ID from ENV
            e2e_test_questionnaire_id: keys.textPrimaryKey(),
            src_file_name: sd.text(),
            source: sd.text(),
            module_ts: sd.jsonText(),
            ...housekeeping.columns,
        },
    );

    const respTable = gm.textPkTable(
        "e2e_test_questionnaire_response",
        {
            e2e_test_questionnaire_response_id: keys.textPrimaryKey(),
            questionnaire_id: qTable.belongsTo.e2e_test_questionnaire_id(),
            lhc_form_response_json: sd.jsonText(),
            transformed_json: sd.jsonText(),
            ...housekeeping.columns,
        },
    );

    return {
        governedModel: gm,
        qTable,
        respTable,
    };
}

// This script generates SQL files from FHIR R4 questionnaires.
// It uses the `r4qctl.ts` script to process the questionnaires and output SQL files.
// The generated SQL files emitted as STDOUT to be read by `surveilr` as capturable executable.

function relativeToCWD(path: string) {
    return relative(Deno.cwd(), fromFileUrl(import.meta.resolve(path)));
}

const workDir = relative(fromFileUrl(import.meta.resolve("./")), "./");
const walker = new Walker({
    workDir: Deno.makeTempDirSync({
        dir: workDir.length > 0 ? workDir : "./",
        prefix: "attest-assessment",
    }),
    questionnairesHome: relativeToCWD("../fixtures/questionnaires"),
    respHome: relativeToCWD("../fixtures/responses"),
});

await walker.walk("leave-work-dir");

interface CapExecEmitContext extends SQLa.SqlEmitContext {
}
const stContext = (): CapExecEmitContext => SQLa.typicalSqlEmitContext();
const gts = tp.governedTemplateState<
    tp.TypicalDomainQS,
    tp.TypicalDomainsQS,
    CapExecEmitContext
>();
const schema = sqlInfoSchema(gts.ddlOptions);
const { qTable, respTable } = schema;

const qInsertDMLs = Array.from(
    walker.questionnaires.values().map((q) => {
        return qTable.insertDML({
            e2e_test_questionnaire_id: monotonicUlid(),
            src_file_name: q.srcFile,
            module_ts: "",
            source: "",
            created_by: import.meta.url,
        });
    }),
);

// deno-fmt-ignore
const DDL = SQLa.SQL<CapExecEmitContext>(gts.ddlOptions)`
    -- Governance:
    -- * use 3rd normal form for tables
    -- * use views to wrap business logic
    -- * when denormalizing is required, use views (don't denormalize tables)
    -- * each table name MUST be singular (not plural) noun
    -- * each table MUST have a \`table_name\`_id primary key (typicalTableDefn will do this automatically)

    ${gts.qualitySystemContent.sqlTextLintSummary}

    ${qTable}

    ${respTable}
    
    ${qInsertDMLs}`;

console.log(DDL.SQL(stContext()));

//console.log(walker.questionnaires);

// Generate SQL for each questionnaire
// for (const questionnaire of walker.questionnaires) {
//     // create custom table for all questionnaires as rows
//     // create custom table of responses per questionnaire using SQLite "untyped" columns

//     const sqlFile = await walker.generateSQL(questionnaire);
//     if (sqlFile) {
//         console.log(`Generated SQL for ${questionnaire.id}: ${sqlFile}`);
//     } else {
//         console.error(`Failed to generate SQL for ${questionnaire.id}`);
//     }
// }

await walker.cleanup();
