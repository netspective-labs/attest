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
          companyInformationEmailAddress: TVNI,
          companyInformationFormCompletedBy: TVNI,
          companyInformationMobilePhone: TVNI,
          companyInformationOrganizationName: TVNI,
          companyInformationWorkPhone: TVNI,
        },
      );
      const lhcForm = await readJsonFile(
        fromFileUrl(
          import.meta.resolve(
            "../fixtures/responses/company-information.lhc-form.json",
          ),
        ),
      );
      const cii = mod.CompanyInformationInterpreter.fromLhcFormResponse(
        lhcForm,
      );
      assertEquals({
        companyInformationOrganizationName: "Netspective Communications LLC",
        companyInformationFormCompletedBy: "Shahid N. Shah",
        companyInformationPositionTitle: "Principal",
        companyInformationEmailAddress: "dont-spam@spam.com",
        companyInformationWorkPhone: "+1 123-456-7891",
        companyInformationMobilePhone: "+1 123-456-7891",
        companyInformationAssessmentDate:
          cii.value.companyInformationAssessmentDate, // since date is dynamic, we just check that it exists
        companyInformationIndustry: "Frontier AI",
        companyInformationEmployeeCount: "50",
        companyInformationContractTypes: "Subcontract",
        companyInformationCageCode: "12345",
        companyInformationDunsNumber: "123456789",
      }, cii.value);
    },
  );

  await t.step(
    "Access Control data transfer object (DTO) works",
    async () => {
      const lhcForm = await readJsonFile(
        fromFileUrl(
          import.meta.resolve(
            "../fixtures/responses/access-control-limit-information-system-access-to-authorized-users-and-processes.lhc-form.json",
          ),
        ),
      );
      const cii = mod
        .accessControlLimitInformationSystemAccessToAuthorizedUsersAndProcessesLhcFormResponseAdapter(
          lhcForm,
        );
      assertEquals({
        accessControlPolicyExists: "Yes",
        accessControlPolicyElementsItems: [
          "Purpose, scope, roles, and responsibilities",
          "Management commitment",
        ],
        accessControlPolicyElementsItemsNotes:
          "The Access Control Policy covers user account management, least privilege, role-based access, authentication requirements, and periodic access reviews.",
        accessControlCurrentAccounts: undefined,
        accessControlCountActiveAccounts: 100,
        accessControlCountInactiveAccounts: 5,
        accessControlCountServiceAccounts: 20,
        accessControlCountSharedAccounts: 25,
        accessControlLeastPrivilegeStatus:
          "Fully implemented across all systems",
        accessControlLeastPrivilegeStatusNotes:
          "Applied to servers, databases, applications, network devices, and cloud resources; enforced through role-based access controls and periodic access reviews.",
        accessControlAccountLifecycleProcess: [
          "We use an automated system that creates and removes access for us.",
          "We handle it manually, but require manager approval before access is given.",
        ],
        accessControlAccountLifecycleProcessNotes:
          "Employee access is requested via a ticketing system, approved by management, implemented by IT, and revoked immediately upon role change or termination; documented in an access log.",
        accessControlAccountReviewFrequencyQuestion: "Monthly",
        accessControlAccountReviewFrequencyNotes:
          "User accounts are reviewed every three months to ensure access aligns with current roles; discrepancies are corrected promptly and documented.",
        accessControlLeastPrivilegeTransactionStatus:
          "Fully implemented – access is role-based and regularly reviewed.",
        accessControlLeastPrivilegeTransactionStatusNotes:
          "Role-based access controls enforce least privilege across systems, ensuring employees have only the permissions necessary for their job functions; regularly reviewed and adjusted as needed.",
        accessControlLimitEmployeeActions:
          "By job role (e.g., managers vs. staff have different access).",
        accessControlLimitEmployeeActionsNotes:
          "Each role is assigned specific permissions (e.g., read, edit, approve) based on job function; access is granted through a controlled approval process and periodically reviewed.",
        accessControlRoleLimitedActions: [
          "Administrative functions (user management, system configuration)",
          "Report generation and access",
        ],
        accessControlRoleLimitedActionsNotes:
          "Actions such as approving transactions, modifying sensitive data, deploying changes, or accessing confidential reports are restricted to managers or designated roles; staff roles are limited to view or read-only access.",
        accessControlSensitiveActionApprovalProcess: [
          "Manager approval required",
          "No special authorization required",
        ],
        accessControlSensitiveActionApprovalNotes:
          "Sensitive actions require managerial or designated role approval before execution; workflows are logged and auditable to ensure accountability and compliance.",
        accessControlExternalConnectionsStatus:
          "Fully implemented – Only approved external systems can connect; all activity is monitored.",
        accessControlExternalConnectionsStatusNotes:
          "External connections are restricted via firewalls, VPNs, and approved cloud services; personal devices follow a BYOD policy with security controls; network activity is monitored for unauthorized access.",
        accessControlExternalSystemTypes: [
          "Cloud services – e.g., Microsoft 365, Google Workspace, Dropbox, Salesforce.",
          "Business partner networks – e.g., joint project portals, shared databases.",
          "Vendor/supplier systems – e.g., ERP integrations, supplier ordering platforms.",
        ],
        accessControlExternalSystemTypesNotes:
          "Includes company-managed laptops and mobile devices, corporate email, cloud collaboration tools (e.g., file sharing, partner portals), and secure VPN connections; all connections are authenticated and monitored.",
        accessControlExternalSystemSafetyCheck: [
          "We use digital certificates and PKI to prove identity.",
          "We require VPN logins with authentication before allowing access.",
        ],
        accessControlExternalSystemSafetyCheckNotes:
          "Devices are scanned for malware, must comply with endpoint security policies, and are authenticated via VPN or MDM; external systems are vetted and only allowed through secure connections.",
        accessControlConnectionLimitationsList: [
          "Time-based access restrictions",
          "Limited to specific user groups",
        ],
        accessControlConnectionLimitationsNotes:
          "External connections are limited to approved systems and users, use secure protocols (VPN, HTTPS), enforce least privilege, and are monitored for suspicious activity.",
        accessControlPublicInfoProcessStatus:
          "Fully implemented – We have a written approval process, only authorized staff can post, and we review/remove public content regularly.",
        accessControlPublicInfoProcessStatusNotes:
          "Policies and procedures prevent posting FCI to public systems; employees are trained on handling sensitive information; content is reviewed before publication to ensure compliance.",
        accessControlPublicSystemsList: [
          "Company website",
          "Corporate blog or news site",
        ],
        accessControlPublicSystemsListNotes:
          "Includes marketing website, customer support portal, and approved partner portals; all systems are monitored and secured to prevent unauthorized access to sensitive information.",
        accessControlFciPostingPreventionProcess: [
          "Pre-publication review and approval process",
          "Automated content scanning for sensitive information",
          "Procedures for rapid removal of inappropriate content",
        ],
        accessControlFciPostingPreventionNotes:
          "Sensitive content is reviewed before publication; employees follow FCI handling policies; public systems have restricted access and monitoring to prevent accidental exposure.",
        accessControlAuthorizedPublicSystems: undefined,
        accessControlAuthorizedPersonnelCount: 10,
        accessControlAuthorizedPersonnelDepts: [
          "Marketing department",
          "Executive leadership",
        ],
        accessControlAuthorizedPersonnelNotes: undefined,
      }, cii);
    },
  );

  await t.step(
    "Media Protection data transfer object (DTO) works",
    async () => {
      const lhcForm = await readJsonFile(
        fromFileUrl(
          import.meta.resolve(
            "../fixtures/responses/media-protection-protect-information-on-digital-and-non-digital-media.lhc-form.json",
          ),
        ),
      );

      const mp = mod
        .mediaProtectionProtectInformationOnDigitalAndNonDigitalMediaLhcFormResponseAdapter(
          lhcForm,
        );
      assertEquals({
        mediaProtectionMediaDisposalPolicy: "Yes",
        mediaProtectionMediaDisposalPolicyNotes: undefined,
        mediaProtectionImplementationStatus: "Fully Implemented",
        mediaProtectionImplementationStatusNotes: undefined,
        mediaProtectionMediaDisposalPolicyElements: [
          "Identification methods for FCI-containing media (Procedures for identifying media that contains or may contain FCI)",
          "Sanitization methods by media type (Specific sanitization methods appropriate for each media type)",
          "Destruction methods by media type (Specific destruction methods appropriate for each media type)",
        ],
        mediaProtectionMediaDisposalPolicyElementsNotes: undefined,
      }, mp);
    },
  );

  await t.step(
    "System Communications Protection Monitor data transfer object (DTO) type exists",
    async () => {
      const lhcForm = await readJsonFile(
        fromFileUrl(
          import.meta.resolve(
            "../fixtures/responses/system-communications-protection-monitor-control-and-protect-organizational-communications.lhc-form.json",
          ),
        ),
      );

      const mp = mod
        .systemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunicationsLhcFormResponseAdapter(
          lhcForm,
        );
      assertEquals({
        systemCommunicationsProtectionFrontGateMonitorControl: undefined,
        systemCommunicationsProtectionStatusNetworkPerimeterSecurity:
          "Fully implemented – We use firewalls and monitoring tools to control all traffic in and out of the network, and they are actively maintained.",
        systemCommunicationProtectionNetworkNotesEvidence: undefined,
        systemCommunicationsProtectionNetworkDiagram: "Yes",
        systemCommunicationProtectionNetworkDiagramNotesEvidence: undefined,
        systemCommunicationsProtectionProtectNetworkOutsideWorld:
          "Network perimeter is protected by firewalls, secure VPNs for remote access, IDS/IPS monitoring, and regular network security reviews to block unauthorized traffic.",
        systemCommunicationsProtectionProtectSensitiveAreasNetwork:
          "Sensitive areas are isolated using VLANs, internal firewalls, and role-based access controls; only authorized users and systems can access these segments, and activity is monitored.",
        systemCommunicationsProtectionFirewallManufacturerModel:
          "Cisco ASA 5506, Palo Alto PA-220",
        systemCommunicationsProtectionFirewallSoftwareFirmwareVersion:
          "v19.2.3",
        systemCommunicationsProtectionDefaultDenyPolicy: "Yes",
        systemCommunicationsProtectionSystemCommunicationProtectionComments:
          undefined,
        systemCommunicationsProtectionExplicitlyAllowedServicesProtocols:
          "Examples include HTTPS (443), VPN (IPSec/SSL), and SSH (22) for administrative access; all other services are blocked by default.",
        systemCommunicationsProtectionExplicitlyDeniedServicesProtocols:
          "FTP (21), and unused ports; blocked at the firewall and monitored for attempts to access.",
        systemCommunicationsProtectionMonitorTrafficCrossing: [
          "Firewall logs and analysis",
          "SIEM system integration",
        ],
        systemCommunicationProtectionMonitoringNotesEvidence: undefined,
        systemCommunicationsBoundaryProtectionProtectionAdditionalNotes:
          undefined,
        systemCommunicationsProtectionDemilitarizedZonePublicSystems: undefined,
        systemCommunicationsProtectionSeparatingPublicSystems:
          "Fully implemented – Public systems are kept on their own network (DMZ or subnetwork) and fully isolated from internal systems.",
        systemCommunicationProtectionSeparatePublicSystemNotesEvidence:
          undefined,
        systemCommunicationsProtectionAccessibleSystemComponentsOperate: [
          "Web servers",
          "Remote access servers",
        ],
        systemCommunicationProtectionPublicAccessibleSystemNotesEvidence:
          undefined,
        systemCommunicationsProtectionPubliclyAccessibleSystemsSeparated: [
          "Demilitarized Zone (DMZ) implementation",
          "Physical network separation",
        ],
        systemCommunicationProtectionNetworkSeparationNotesEvidence: undefined,
        systemCommunicationsProtectionPreventUnauthorizedAccessPublic: [
          "Application-level proxy filtering",
          "Continuous network monitoring and logging",
        ],
        systemCommunicationProtectionAccessControlNotesEvidence: undefined,
        systemCommunicationsProtectionMonitorActivityPublicFacingNetwork: [
          "Security Information and Event Management (SIEM) system",
          " Automated log analysis and alerting",
        ],
        systemCommunicationProtectionPublicNetworkNotesEvidence: undefined,
        systemCommunicationProtectionPublicNetworkAdditionalNotes: undefined,
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
        systemCommunicationsProtectionStatusNetworkPerimeterSecurity: TVNI,
        systemCommunicationsProtectionSeparatingPublicSystems: TVNI,
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
