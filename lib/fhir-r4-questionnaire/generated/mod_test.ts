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
    "Media Protection data transfer object (DTO) works",
    async () => {
      const lhcForm = await readJsonFile(
        fromFileUrl(
          import.meta.resolve("../fixtures/responses/Media Protection (Protect information on digital and non-digital media).lhc-form.json")
        )
      );

      const mp = mod.mediaProtectionProtectInformationOnDigitalAndNonDigitalMediaLhcFormResponseAdapter(lhcForm);
      assertEquals({
        doYouHaveAMediaDisposalPolicy: "Yes",
        implementationStatus: "Fully Implemented",
        confirmThatYourMediaDisposalPolicyIncludesTheFollowingElementsClickAllThatApply: [
          "Types of media covered by policy (Policy defines all types of media that may contain FCI (hard drives, SSDs, USB drives, etc.))",
          "Identification methods for FCI-containing media (Procedures for identifying media that contains or may contain FCI)",
          "Sanitization methods by media type (Specific sanitization methods appropriate for each media type)",
          "Destruction methods by media type (Specific destruction methods appropriate for each media type)",
          "Verification requirements (Procedures to verify sanitization or destruction was successful)",
          "Documentation requirements (Required records of sanitization and destruction activities)"
        ]
      }, mp);
    },
  );

  await t.step(
    "System Communications Protection Monitor data transfer object (DTO) type exists",
    async () => {
      const lhcForm = await readJsonFile(
        fromFileUrl(
          import.meta.resolve("../fixtures/responses/System & Communications Protection (Monitor, control, and protect organizational communications).lhc-form.json")
        )
      );

      const mp = mod.systemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunicationsLhcFormResponseAdapter(lhcForm);
      assertEquals({
        requirementsImplementNetworkMonitoringAndBoundaryProtectionIncludingFirewallsIntrusionDetectionAndCommunicationControls: undefined,
        implementationStatus: "Fully Implemented - All boundary protection controls are in place and operational",
        doYouHaveANetworkDiagramShowingSystemBoundariesKeyComponentsAndDataFlows: "Yes",
        externalBoundaryComponents: "Palo Alto PA-220, Firmware v10.1.2,Cisco ASA 5515-X, Firmware v9.12.3",
        keyInternalBoundaryComponents: "Internal VLAN Switches,Segmentation Gateways (VMware NSX v7.1),Internal Web Application Firewall (F5 BIG-IP v16.1)",
        firewallManufacturerModel: "Cisco ASA 5515-X,Palo Alto PA-220",
        firewallSoftwareFirmwareVersion: "v10.1.2",
        defaultDenyPolicyIsImplementedTrafficIsDeniedByDefaultUnlessExplicitlyPermitted: "Yes",
        explicitlyAllowedServicesProtocols: "HTTP/HTTPS (TCP 80/443),SMTP/IMAP/POP3 (TCP 25/143/110)",
        explicitlyDeniedServicesProtocols: "Telnet (TCP 23),FTP (TCP 21),NetBIOS/SMB (TCP 137–139, 445)",
        howDoYouMonitorCommunicationsAtSystemBoundaries: [
          "Firewall logs and analysis",
          "Intrusion detection/prevention systems",
          "SIEM system integration"
        ],
        supportingDocumentation: undefined,
        additionalNotes: undefined,
        requirementsCreateDmzOrSeparatedNetworkSegmentsForPublicFacingSystemsToIsolateThemFromInternalNetworks: undefined,
        implementationStatus2: "Fully Implemented - DMZ/subnetworks properly isolate public systems",
        whatPubliclyAccessibleSystemComponentsDoesYourOrganizationOperate: [
          "Web servers",
          "Email servers (public-facing)",
          "DNS servers",
          "VPN gateways",
          "API gateways"
        ],
        howArePubliclyAccessibleSystemsSeparatedFromInternalNetworks: [
          "Demilitarized Zone (DMZ) implementation",
          "Virtual LAN (VLAN) segmentation",
          "Firewall rules and access control lists",
        ],
        whatControlsPreventUnauthorizedAccessFromPublicNetworksToInternalNetworks: [
          "Default deny policies (all traffic blocked unless explicitly allowed)",
          "Stateful firewall inspection",
          "Intrusion detection and prevention systems",
          "Strong authentication for any allowed connections"
        ],
        howDoYouMonitorActivityInYourPublicFacingNetworkSegments: [
          "Security Information and Event Management (SIEM) system",
          "Network monitoring tools and dashboards",
          "Automated log analysis and alerting",
          "Regular vulnerability scanning"
        ],
        supportingDocumentation2: undefined,
        additionalNotes2: undefined
      }, mp);
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
