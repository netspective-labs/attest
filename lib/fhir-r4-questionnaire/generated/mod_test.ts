import { fromFileUrl } from "jsr:@std/path";
import { assertEquals } from "jsr:@std/assert";
import { readJsonFile } from "../r4q-resource-code-gen.ts";
import * as mod from "./mod.ts";

const expectType = <T>(_value: T) => {
  // Do nothing, the TypeScript compiler handles this for us
};

Deno.test("Generated TypeScript code from ../fixtures/questionnaires", async (t) => {
  const TVNI = "text-value-not-important";

  await t.step(
    "Access Control Limit data transfer object (DTO) type exists",
    () => {
      expectType<
        mod.AccessControlLimitInformationSystemAccessToAuthorizedUsersAndProcesses
      >(
        {},
      );
    },
  );

  await t.step(
    "Company Information data transfer object (DTO) works",
    async () => {
      expectType<mod.CompanyInformation>(
        {
          emailAddress: TVNI,
          formCompletedBy: TVNI,
          mobilePhone: TVNI,
          organizationName: TVNI,
          workPhone: TVNI,
        },
      );
      const lhcForm = await readJsonFile(
        fromFileUrl(
          import.meta.resolve(
            "../fixtures/responses/Company-Information.lhc-form.json",
          ),
        ),
      );
      const cii = mod.CompanyInformationInterpreter.fromLhcFormResponse(
        lhcForm,
      );
      assertEquals({
        organizationName: "Netspective Communications LLC",
        formCompletedBy: "Shahid N. Shah",
        positionTitle: "Principal",
        emailAddress: "dont-spam@spam.com",
        workPhone: "+1 123-456-7891",
        mobilePhone: "+1 123-456-7891",
        assessmentDate: cii.value.assessmentDate, // since date is dynamic, we just check that it exists
        industry: "Frontier AI",
        employeeCount: "50",
        contractTypes: "Subcontract",
        cageCode: "12345",
        dunsNumber: "123456789",
      }, cii.value);
    },
  );

  await t.step(
    "Access Control data transfer object (DTO) works",
    async () => {
      const lhcForm = await readJsonFile(
        fromFileUrl(
          import.meta.resolve("../fixtures/responses/Access Control (Limit information system access to authorized users and processes).lhc-form.json")
        )
      );
      const cii = mod.accessControlLimitInformationSystemAccessToAuthorizedUsersAndProcessesLhcFormResponseAdapter(lhcForm);
      assertEquals({
        doYouHaveAnAccessControlPolicy: "Yes",
        implementationStatus: "Partially Implemented",
        doesYourOrganizationHaveADocumentedAccessControlPolicyThatAddresses: [
          "Purpose, scope, roles, and responsibilities",
          "Compliance requirements"
        ],
        howManyAccountsAreCurrentlyInYourSystems: undefined,
        activeUserAccounts: 250,
        inactiveDisabledUserAccounts: 10,
        serviceAccounts: 15,
        sharedAccounts: 3,
        howIsThePrincipleOfLeastPrivilegeImplemented: "Partially implemented",
        howAreAccountLifecycleProcessesManaged: [
          "Automated identity management system",
          "Integration with HR systems"
        ],
        howFrequentlyAreUserAccountsReviewedForValidityAndAppropriateAccess: "Quarterly",
        implementationStatus2: "Partially Implemented",
        howDoYouLimitUserAccessToSpecificTransactionsAndFunctions: [
          "Role-based access control (RBAC)",
          "Application-level access controls",
          "Time-based access restrictions"
        ],
        whatTypesOfFunctionsAreRestrictedBasedOnUserRoles: [
          "Data export and bulk download functions",
          "System-level commands and utilities"
        ],
        howAreHighRiskTransactionsAuthorized: [
          "No special authorization required"
        ],
        implementationStatus3: "Partially Implemented",
        whatTypesOfExternalSystemsDoesYourOrganizationConnectTo: [
          "Cloud services (email, file storage, applications)",
          "No external connections"
        ],
        howDoYouVerifyExternalSystemConnections: [
          "VPN connections with authentication",
          "Signed interconnection agreements"
        ],
        whatLimitationsArePlacedOnExternalConnections: [
          "Restrictions on data types that can be shared",
          "Comprehensive audit trails and logging"
        ],
        implementationStatus4: "Partially Implemented",
        whatPubliclyAccessibleSystemsDoesYourOrganizationOperate: [
          "Company website",
          "Public forums or discussion boards"
        ],
        howDoYouEnsureFciIsNotPostedOnPublicSystems: [
          "Pre-publication review and approval process",
          "Procedures for rapid removal of inappropriate content"
        ],
        whoIsAuthorizedToPostContentToPublicSystems: undefined,
        numberOfAuthorizedPersonnel: 250,
        chooseAllThatApply: [
          "Marketing department",
          "Communications/PR team"
        ],
      }, cii);
    },
  );

  await t.step(
    "Identification Authentication data transfer object (DTO) type exists",
    () => {
      expectType<
        mod.IdentificationAuthenticationVerifyIdentitiesOfUsersAndProcesses
      >({});
    },
  );

  await t.step(
    "Media Protection data transfer object (DTO) type exists",
    () => {
      expectType<
        mod.MediaProtectionProtectInformationOnDigitalAndNonDigitalMedia
      >({});
    },
  );

  await t.step(
    "Physical Protection Limit data transfer object (DTO) type exists",
    () => {
      expectType<
        mod.PhysicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilities
      >({});
    },
  );

  await t.step(
    "Policy Framework Assessment Limit data transfer object (DTO) type exists",
    () => {
      expectType<
        mod.PolicyFrameworkAssessmentPolicyImplementationAllCmmcLevel1Practices
      >({});
    },
  );

  await t.step(
    "System Communications Protection Monitor data transfer object (DTO) type exists",
    () => {
      expectType<
        mod.SystemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunications
      >({
        implementationStatus: TVNI,
        implementationStatus2: TVNI,
      });
    },
  );

  await t.step(
    "System Information Integrity data transfer object (DTO) type exists",
    () => {
      expectType<
        mod.SystemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlaws
      >({});
    },
  );
});
