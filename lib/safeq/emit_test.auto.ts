import { z } from "npm:zod@4.1.1";

export const systemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlawsSchema =
  z.object({
    siL1B1XiiFlawRemediation: z.object({
      flawIdentificationProcess: z.object({
        howDoesYourCompanyFindWeaknessesInItsSystemsSuchAsSoftwareBugsMissingUpdatesOrSecurityGapsBeforeAttackersCanExploitThem:
          z.array(
            z.enum([
              "Automated vulnerability scanning",
              "Vendor security notifications and bulletins",
              "Penetration testing",
              "Regular security assessments",
              "Threat intelligence feeds",
              "Incident response and forensics",
            ]).brand<
              | `linkId:758011605310`
              | `text:How does your company find weaknesses in its systems such as software bugs, missing updates, or security gaps before attackers can exploit them?`
              | `type:choice`
            >().describe(
              "How does your company find weaknesses in its systems such as software bugs, missing updates, or security gaps before attackers can exploit them? [linkId=758011605310 | codes=[system-information-integrity-find-weaknesses-in-system]]",
            ),
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:135467801033` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=135467801033 | codes=[system-information-flaw-remediation-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:544004255685`
        | `text:Flaw Identification Process`
        | `type:group`
      >().describe(
        "Flaw Identification Process [linkId=544004255685 | codes=[system-information-integrity-flaw-identification-process]]",
      ).optional(),
      flawReportingAndTracking: z.object({
        howAreIdentifiedFlawsBugsMissingUpdatesSecurityGapsReportedAndTracked: z
          .array(
            z.enum([
              " Formal tracking system or database",
              "Automatic management notification",
              "Risk assessment and prioritization",
              "Communication to affected stakeholders",
              "Detailed documentation of findings",
            ]).brand<
              | `linkId:854540559647`
              | `text:How are identified flaws (bugs, missing updates, security gaps) reported and tracked?`
              | `type:choice`
            >().describe(
              "How are identified flaws (bugs, missing updates, security gaps) reported and tracked? [linkId=854540559647 | codes=[system-information-integrity-identified-flaws]]",
            ),
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:924286782806` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=924286782806 | codes=[system-information-flaw-reporting-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:603452357063`
        | `text:Flaw Reporting and Tracking`
        | `type:group`
      >().describe(
        "Flaw Reporting and Tracking [linkId=603452357063 | codes=[system-information-integrity-flaw-reporting-tracking]]",
      ).optional(),
      flawCorrectionTimeline: z.object({
        whatAreYourTargetTimeframesForCorrectingIdentifiedFlaws: z.object({
          criticalSeverityFlaws: z.enum([
            "Immediate (within hours)",
            "Within 24 hours",
            "Within 72 hours",
            " Within 1 week",
          ]).brand<
            | `linkId:885354230428`
            | `text:Critical Severity Flaws:`
            | `type:choice`
          >().describe(
            "Critical Severity Flaws: [linkId=885354230428 | codes=[system-information-integrity-critical-severity-flaws]]",
          ).optional(),
          highSeverityFlaws: z.enum([
            "Within 1 week",
            "Within 2 weeks",
            "Within 1 month",
          ]).brand<
            `linkId:149460684671` | `text:High Severity Flaws:` | `type:choice`
          >().describe(
            "High Severity Flaws: [linkId=149460684671 | codes=[system-information-integrity-high-severity-flaws]]",
          ).optional(),
          mediumLowSeverityFlaws: z.enum([
            "Within 1 month",
            "Within 1 quarter",
            "Next scheduled maintenance window",
          ]).brand<
            | `linkId:119144494365`
            | `text:Medium/Low Severity Flaws:`
            | `type:choice`
          >().describe(
            "Medium/Low Severity Flaws: [linkId=119144494365 | codes=[system-information-integrity-medium-low-severity-flaws]]",
          ).optional(),
        }).brand<
          | `linkId:802989461197`
          | `text:What are your target timeframes for correcting identified flaws?`
          | `type:group`
        >().describe(
          "What are your target timeframes for correcting identified flaws? [linkId=802989461197 | codes=[system-information-integrity-target-timeframes-correcting-flaws]]",
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:478326704189` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=478326704189 | codes=[system-information-flaw-correction-notes-evidence]]",
        ).optional(),
      }).brand<
        `linkId:702845194175` | `text:Flaw Correction Timeline` | `type:group`
      >().describe(
        "Flaw Correction Timeline [linkId=702845194175 | codes=[system-information-integrity-flaw-correction-timeline]]",
      ).optional(),
      patchManagementProcess: z.object({
        howAreSecurityPatchesAndUpdatesManaged: z.array(
          z.enum([
            "Testing in non-production environment before deployment",
            "Formal change control process",
            "Rollback procedures in case of issues",
            "Automated patch deployment capabilities",
            "Emergency patching procedures for critical flaws",
            "Documentation of all patches applied",
          ]).brand<
            | `linkId:896010001522`
            | `text:How are security patches and updates managed?`
            | `type:choice`
          >().describe(
            "How are security patches and updates managed? [linkId=896010001522 | codes=[system-information-integrity-security-patches-updates-managed]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:731360730463` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=731360730463 | codes=[system-information-integrity-patch-management-notes-evidence]]",
        ).optional(),
      }).brand<
        `linkId:535096646220` | `text:Patch Management Process` | `type:group`
      >().describe(
        "Patch Management Process [linkId=535096646220 | codes=[system-information-integrity-patch-management-process]]",
      ).optional(),
    }).brand<
      | `linkId:350961856234`
      | `text:SI.L1-B.1.XII – Flaw Remediation`
      | `type:group`
    >().describe(
      "SI.L1-B.1.XII – Flaw Remediation [linkId=350961856234 | codes=[system-information-integrity-flaw-remediation]]",
    ).optional(),
    siL1B1XiiiMaliciousCodeProtection: z.object({
      doYouHaveAWrittenPolicyThatExplainsHowYourCompanyProtectsAgainstVirusesSpywareRansomwareAndOtherMaliciousSoftware:
        z.enum(["Yes", "No"]).brand<
          | `linkId:892692932760`
          | `text:Do you have a written policy that explains how your company protects against viruses, spyware, ransomware, and other malicious software?`
          | `type:choice`
        >().describe(
          "Do you have a written policy that explains how your company protects against viruses, spyware, ransomware, and other malicious software? [linkId=892692932760 | codes=[system-information-integrity-company-protects-against-malicious-software]]",
        ).optional(),
      protectionLocations: z.object({
        selectAllLocationsWhereMaliciousCodeProtectionIsImplemented: z.array(
          z.enum([
            "Email Gateway",
            "Web Proxy/Gateway",
            "Perimeter Firewall",
            "VPN Gateway",
            "Endpoints (Workstations, Laptops)",
            "Servers",
            "Mobile Devices",
          ]).brand<
            | `linkId:457010911238`
            | `text:Select all locations where malicious code protection is implemented:`
            | `type:choice`
          >().describe(
            "Select all locations where malicious code protection is implemented: [linkId=457010911238 | codes=[system-information-integrity-malicious-code-protection-implemented]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:388699038922` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=388699038922 | codes=[system-information-integrity-protection-location-notes-evidence]]",
        ).optional(),
      }).brand<
        `linkId:120577885697` | `text:Protection Locations` | `type:group`
      >().describe(
        "Protection Locations [linkId=120577885697 | codes=[system-information-integrity-protection-Locations]]",
      ).optional(),
      implementationDetails: z.object({
        primaryAntiMalwareProductSolutionEGMicrosoftDefenderMcAfeeSymantec: z
          .string().brand<
          | `linkId:149423997720`
          | `text:Primary Anti-Malware Product/Solution: e.g., Microsoft Defender, McAfee, Symantec`
          | `type:string`
        >().describe(
          "Primary Anti-Malware Product/Solution: e.g., Microsoft Defender, McAfee, Symantec [linkId=149423997720 | codes=[system-information-integrity-primary-anti-malware-product]]",
        ).optional(),
        antiMalwareVersionReleaseVersionNumberOrReleaseIdentifier: z.string()
          .brand<
            | `linkId:343942743605`
            | `text:Anti-Malware Version/Release: Version number or release identifier`
            | `type:string`
          >().describe(
            "Anti-Malware Version/Release: Version number or release identifier [linkId=343942743605 | codes=[system-information-integrity-anti-malware-release-identifier]]",
          ).optional(),
        implementationScopeDescribeTheScopeOfYourAntiMalwareImplementationEGAllCompanyEndpointsSpecificServers:
          z.string().brand<
            | `linkId:581419297519`
            | `text:Implementation Scope: Describe the scope of your anti-malware implementation (e.g., all company endpoints, specific servers)`
            | `type:text`
          >().describe(
            "Implementation Scope: Describe the scope of your anti-malware implementation (e.g., all company endpoints, specific servers) [linkId=581419297519 | codes=[system-information-integrity-scope-anti-malware-implementation]]",
          ).optional(),
        realTimeProtectionEnabled: z.enum(["Yes", "No"]).brand<
          | `linkId:394557514652`
          | `text:Real-Time Protection Enabled:`
          | `type:choice`
        >().describe(
          "Real-Time Protection Enabled: [linkId=394557514652 | codes=[system-information-integrity-real-time-protection-enabled]]",
        ).optional(),
        centrallyManaged: z.enum(["Yes", "No"]).brand<
          `linkId:137330973781` | `text:Centrally Managed:` | `type:choice`
        >().describe(
          "Centrally Managed: [linkId=137330973781 | codes=[system-information-integrity-centrally-managed]]",
        ).optional(),
      }).brand<
        `linkId:123297792461` | `text:Implementation Details` | `type:group`
      >().describe(
        "Implementation Details [linkId=123297792461 | codes=[system-information-integrity-implementation-details]]",
      ).optional(),
      additionalNotesOrComments: z.string().brand<
        | `linkId:750023247979`
        | `text:Additional Notes or Comments`
        | `type:text`
      >().describe(
        "Additional Notes or Comments [linkId=750023247979 | codes=[system-information-integrity-malicious-code-additional-notes-comments]]",
      ).optional(),
    }).brand<
      | `linkId:340771388729`
      | `text:SI.L1-B.1.XIII – Malicious Code Protection`
      | `type:group`
    >().describe(
      "SI.L1-B.1.XIII – Malicious Code Protection [linkId=340771388729 | codes=[system-information-integrity-malicious-code-protection]]",
    ).optional(),
    siL1B1XivUpdateMaliciousCodeProtection: z.object({
      updateFrequency: z.object({
        howFrequentlyAreMaliciousCodeProtectionMechanismsUpdated: z.enum([
          "Real-time updates (as available)",
          "Hourly",
          "Daily",
          "Weekly",
          "Manual updates only",
        ]).brand<
          | `linkId:830996907328`
          | `text:How frequently are malicious code protection mechanisms updated?`
          | `type:choice`
        >().describe(
          "How frequently are malicious code protection mechanisms updated? [linkId=830996907328 | codes=[system-information-integrity-frequently-malicious-code-protection]]",
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:583208753437` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=583208753437 | codes=[system-information-update-frequency-notes-evidence]]",
        ).optional(),
      }).brand<`linkId:370529733824` | `text:Update Frequency` | `type:group`>()
        .describe(
          "Update Frequency [linkId=370529733824 | codes=[system-information-integrity-update-frequency]]",
        ).optional(),
      updateManagementProcess: z.object({
        howAreMaliciousCodeProtectionUpdatesManaged: z.array(
          z.enum([
            "Automatic updates enabled",
            "Centralized update management system",
            "Verification of successful updates",
            "Rollback capability for problematic updates",
            "Testing of updates before deployment",
            "Notification of update status and failures",
          ]).brand<
            | `linkId:733457774453`
            | `text:How are malicious code protection updates managed?`
            | `type:choice`
          >().describe(
            "How are malicious code protection updates managed? [linkId=733457774453 | codes=[system-information-integrity-malicious-code-protection-managed]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:222629834244` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=222629834244 | codes=[system-information-integrity-update-management-process-notes-evidence]]",
        ).optional(),
        whichExternalSourcesAreScanned: z.array(
          z.enum([
            "Internet Downloads",
            "Email Attachments",
            "Removable Media",
            "Cloud Storage",
            "Network Shares",
            "Other External Sources",
          ]).brand<
            | `linkId:146442608630`
            | `text:Which external sources are scanned?`
            | `type:choice`
          >().describe(
            "Which external sources are scanned? [linkId=146442608630 | codes=[system-information-integrity-external-sources-scanned]]",
          ),
        ).optional(),
        notesEvidence2: z.string().brand<
          `linkId:692565504391` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=692565504391 | codes=[system-information-external-source-notes-evidence]]",
        ).optional(),
      }).brand<
        `linkId:400782620614` | `text:Update Management Process` | `type:group`
      >().describe(
        "Update Management Process [linkId=400782620614 | codes=[system-information-integrity-update-management-process]]",
      ).optional(),
    }).brand<
      | `linkId:363972470334`
      | `text:SI.L1-B.1.XIV – Update Malicious Code Protection`
      | `type:group`
    >().describe(
      "SI.L1-B.1.XIV – Update Malicious Code Protection [linkId=363972470334 | codes=[system-information-integrity-update-malicious-code-protection]]",
    ).optional(),
    siL1B1XvSystemFileScanning: z.object({
      doYouHaveWrittenPoliciesAndProceduresThatExplainHowYourCompanyScansSystemsAndFilesForVirusesAndOtherMaliciousSoftware:
        z.enum(["Yes", "No"]).brand<
          | `linkId:470606272303`
          | `text:Do you have written policies and procedures that explain how your company scans systems and files for viruses and other malicious software?`
          | `type:choice`
        >().describe(
          "Do you have written policies and procedures that explain how your company scans systems and files for viruses and other malicious software? [linkId=470606272303 | codes=[system-information-integrity-written-policies-procedures]]",
        ).optional(),
      antiMalwareImplementation: z.object({
        doesYourOrganizationHaveAntivirusAntiMalwareSoftwareInstalledOnAllSystems:
          z.enum(["Yes", "No", "Partially (some systems only)"]).brand<
            | `linkId:189466095401`
            | `text:Does your organization have antivirus/anti-malware software installed on all systems?`
            | `type:choice`
          >().describe(
            "Does your organization have antivirus/anti-malware software installed on all systems? [linkId=189466095401 | codes=[system-information-integrity-anti-malware-software-install]]",
          ).optional(),
        whatAntivirusAntiMalwareSolutionIsCurrentlyDeployedEGMicrosoftDefenderNortonMcAfeeEtc:
          z.string().brand<
            | `linkId:694425083943`
            | `text:What antivirus/anti-malware solution is currently deployed? e.g., Microsoft Defender, Norton, McAfee, etc.`
            | `type:string`
          >().describe(
            "What antivirus/anti-malware solution is currently deployed? e.g., Microsoft Defender, Norton, McAfee, etc. [linkId=694425083943 | codes=[system-information-integrity-malware-deployed]]",
          ).optional(),
      }).brand<
        | `linkId:359679551926`
        | `text:Anti-Malware Implementation`
        | `type:group`
      >().describe(
        "Anti-Malware Implementation [linkId=359679551926 | codes=[system-information-integrity-anti-malware-implementation]]",
      ).optional(),
      periodicScanningImplementation: z.object({
        howOftenDoYouRunFullScansOfYourCompanySComputersAndServersToCheckForHiddenVirusesOrMaliciousSoftware:
          z.enum([
            "Daily",
            "Weekily",
            "Bi-weekly",
            "Monthly",
            "Quarterly",
            "Custom Schedule",
          ]).brand<
            | `linkId:508929065591`
            | `text:How often do you run full scans of your company’s computers and servers to check for hidden viruses or malicious software?`
            | `type:choice`
          >().describe(
            "How often do you run full scans of your company’s computers and servers to check for hidden viruses or malicious software? [linkId=508929065591 | codes=[system-information-integrity-scan-computer-server]]",
          ).optional(),
        whatLevelOfThoroughnessIsUsedForPeriodicScans: z.enum([
          "Quick Scan (critical files only)",
          "Standard Scan (system files and common user directories)",
          "Full Scan (entire file system)",
          "Custom Scan (specific directories)",
        ]).brand<
          | `linkId:889472415570`
          | `text:What level of thoroughness is used for periodic scans?`
          | `type:choice`
        >().describe(
          "What level of thoroughness is used for periodic scans? [linkId=889472415570 | codes=[system-information-integrity-thorough periodic-scan]]",
        ).optional(),
      }).brand<
        | `linkId:558460360931`
        | `text:Periodic Scanning Implementation`
        | `type:group`
      >().describe(
        "Periodic Scanning Implementation [linkId=558460360931 | codes=[system-information-integrity-periodic-scanning-implementation]]",
      ).optional(),
      realTimeScanningFileIntegrity: z.object({
        whenSomeoneBringsInAFileFromOutsideYourCompanyLikeAnEmailAttachmentADownloadOrAFileOnAUsbDriveIsItAutomaticallyScannedForVirusesAndMalwareBeforeItOpens:
          z.enum(["Yes", "No", "Partially (some sources only)"]).brand<
            | `linkId:740865411316`
            | `text:When someone brings in a file from outside your company like an email attachment, a download, or a file on a USB drive is it automatically scanned for viruses and malware before it opens?`
            | `type:choice`
          >().describe(
            "When someone brings in a file from outside your company like an email attachment, a download, or a file on a USB drive is it automatically scanned for viruses and malware before it opens? [linkId=740865411316 | codes=[system-information-integrity-file-automatic-scan]]",
          ).optional(),
        doYouEmployFileIntegrityMonitoringForCriticalSystemFiles: z.enum([
          "Yes",
          "No",
          "Planned",
        ]).brand<
          | `linkId:842602142275`
          | `text:Do you employ file integrity monitoring for critical system files?`
          | `type:choice`
        >().describe(
          "Do you employ file integrity monitoring for critical system files? [linkId=842602142275 | codes=[system-information-integrity-monitor-critical-file]]",
        ).optional(),
      }).brand<
        | `linkId:527252274149`
        | `text:Real-time Scanning & File Integrity`
        | `type:group`
      >().describe(
        "Real-time Scanning & File Integrity [linkId=527252274149 | codes=[system-information-integrity-scanning-file-integrity]]",
      ).optional(),
      resultsHandlingTesting: z.object({
        howAreScanResultsReviewedAndDocumentedDescribeYourProcessForReviewingAndDocumentingScanResults:
          z.string().brand<
            | `linkId:707425868010`
            | `text:How are scan results reviewed and documented? Describe your process for reviewing and documenting scan results...`
            | `type:text`
          >().describe(
            "How are scan results reviewed and documented? Describe your process for reviewing and documenting scan results... [linkId=707425868010 | codes=[system-information-integrity-review-document-file]]",
          ).optional(),
        whatIsYourResponseTimeframeWhenMalwareOrVulnerabilitiesAreDetected: z
          .union([
            z.enum([
              "Immediate (within hours)",
              "Within 24 hours",
              "Within 48 hours",
              "Within a week",
            ]),
            z.string(),
          ]).brand<
          | `linkId:986030389075`
          | `text:What is your response timeframe when malware or vulnerabilities are detected?`
          | `type:open-choice`
        >().describe(
          "What is your response timeframe when malware or vulnerabilities are detected? [linkId=986030389075 | codes=[system-information-integrity-response-timeframe]]",
        ).optional(),
        describeYourRemediationProcessForIdentifiedIssuesDescribeYourProcessForRemediatingIssuesDetectedDuringScanning:
          z.string().brand<
            | `linkId:164191875680`
            | `text:Describe your remediation process for identified issues: Describe your process for remediating issues detected during scanning...`
            | `type:text`
          >().describe(
            "Describe your remediation process for identified issues: Describe your process for remediating issues detected during scanning... [linkId=164191875680 | codes=[system-information-integrity-remediation-process]]",
          ).optional(),
        hasScanningEffectivenessBeenTested: z.enum(["Yes", "No"]).brand<
          | `linkId:967054991522`
          | `text:Has scanning effectiveness been tested?`
          | `type:choice`
        >().describe(
          "Has scanning effectiveness been tested? [linkId=967054991522 | codes=[system-information-integrity-scanning-effectiveness]]",
        ).optional(),
        supportingDocumentation: z.string().brand<
          `linkId:173738693036` | `text:Supporting Documentation` | `type:text`
        >().describe(
          "Supporting Documentation [linkId=173738693036 | codes=[system-information-integrity-scanning-supporting-documentation]]",
        ).optional(),
      }).brand<
        `linkId:123247885877` | `text:Results Handling & Testing` | `type:group`
      >().describe(
        "Results Handling & Testing [linkId=123247885877 | codes=[system-information-integrity-results-handling-testing]]",
      ).optional(),
    }).brand<
      | `linkId:237888898879`
      | `text:SI.L1-B.1.XV – System & File Scanning`
      | `type:group`
    >().describe(
      "SI.L1-B.1.XV – System & File Scanning [linkId=237888898879 | codes=[system-information-integrity-system-file-scanning]]",
    ).optional(),
  }).meta({
    "title":
      "System & Information Integrity (Identify, report, and correct information system flaws)",
    "tsType":
      "SystemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlaws",
    "schemaConst":
      "systemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlawsSchema",
  });

export type SystemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlaws =
  z.infer<
    typeof systemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlawsSchema
  >;

export const policyFrameworkAssessmentPolicyImplementationAllCmmcLevel1PracticesSchema =
  z.object({
    policyFrameworkAssessment: z.object({
      policyDevelopmentAndApproval: z.object({
        whoIsResponsibleForDevelopingAndApprovingCmmcRelatedPolicies: z.array(
          z.enum([
            "Chief Information Officer",
            "Chief Information Security Officer",
            "Chief Executive Officer",
            "Legal/Compliance Department",
            "IT Security Team",
          ]).brand<
            | `linkId:527949557496`
            | `text:Who is responsible for developing and approving CMMC-related policies?`
            | `type:choice`
          >().describe(
            "Who is responsible for developing and approving CMMC-related policies? [linkId=527949557496 | codes=[policy-framework-assessment-responsible-policy-development]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:576726184171` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=576726184171 | codes=[policy-framework-assessment-responsible-policy-development-notes]]",
        ).optional(),
      }).brand<
        | `linkId:590810573907`
        | `text:Policy Development and Approval`
        | `type:group`
      >().describe(
        "Policy Development and Approval [linkId=590810573907 | codes=[policy-framework-assessment-policy-development-approval]]",
      ).optional(),
      policyReviewAndUpdateProcedures: z.object({
        howFrequentlyAreCmmcRelatedPoliciesReviewedAndUpdated: z.enum([
          "Quarterly",
          "Bi-annually",
          "Annually",
          "When regulations change",
          "No formal schedule",
        ]).brand<
          | `linkId:992068463537`
          | `text:How frequently are CMMC-related policies reviewed and updated?`
          | `type:choice`
        >().describe(
          "How frequently are CMMC-related policies reviewed and updated? [linkId=992068463537 | codes=[policy-framework-assessment-policy-review-frequency]]",
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:891438058183` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=891438058183 | codes=[policy-framework-assessment-policy-review-frequency-notes]]",
        ).optional(),
      }).brand<
        | `linkId:441079114846`
        | `text:Policy Review and Update Procedures`
        | `type:group`
      >().describe(
        "Policy Review and Update Procedures [linkId=441079114846 | codes=[policy-framework-assessment-policy-review-procedures]]",
      ).optional(),
      employeeTrainingOnPolicies: z.object({
        whatTrainingIsProvidedToEmployeesOnCmmcRelatedPolicies: z.array(
          z.enum([
            "Initial security awareness training",
            "Role-specific policy training",
            "Annual refresher training",
            "just-in-time training for policy changes",
            "No formal training program",
          ]).brand<
            | `linkId:472951321809`
            | `text:What training is provided to employees on CMMC-related policies?`
            | `type:choice`
          >().describe(
            "What training is provided to employees on CMMC-related policies? [linkId=472951321809 | codes=[policy-framework-assessment-employee-policy-training]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:948893743049` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=948893743049 | codes=[policy-framework-assessment-employee-policy-training-notes]]",
        ).optional(),
      }).brand<
        | `linkId:401642968533`
        | `text:Employee Training on Policies`
        | `type:group`
      >().describe(
        "Employee Training on Policies [linkId=401642968533 | codes=[policy-framework-assessment-employee-training]]",
      ).optional(),
      policyComplianceMonitoring: z.object({
        howIsComplianceWithCmmcRelatedPoliciesMonitored: z.array(
          z.enum([
            " Regular internal audits",
            "Automated compliance monitoring",
            "Self-assessment questionnaires",
            "Manager reviews and attestations",
            "Third-party assessments",
          ]).brand<
            | `linkId:758349008850`
            | `text:How is compliance with CMMC-related policies monitored?`
            | `type:choice`
          >().describe(
            "How is compliance with CMMC-related policies monitored? [linkId=758349008850 | codes=[policy-framework-assessment-policy-compliance-monitoring-methods]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:230314073532` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=230314073532 | codes=[policy-framework-assessment-policy-compliance-monitoring-notes]]",
        ).optional(),
      }).brand<
        | `linkId:237023742748`
        | `text:Policy Compliance Monitoring`
        | `type:group`
      >().describe(
        "Policy Compliance Monitoring [linkId=237023742748 | codes=[policy-framework-assessment-policy-compliance-monitoring]]",
      ).optional(),
      policyExceptionManagement: z.object({
        howAreExceptionsToCmmcRelatedPoliciesManaged: z.array(
          z.enum([
            " Formal exception request process",
            "Risk assessment for exceptions",
            "Compensating controls for exceptions",
            "Regular review of approved exceptions",
            "No formal exception process",
          ]).brand<
            | `linkId:255836550808`
            | `text:How are exceptions to CMMC-related policies managed?`
            | `type:choice`
          >().describe(
            "How are exceptions to CMMC-related policies managed? [linkId=255836550808 | codes=[policy-framework-assessment-policy-exception-management-methods]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:683517806081` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=683517806081 | codes=[policy-framework-assessment-policy-exception-management-notes]]",
        ).optional(),
      }).brand<
        | `linkId:260429244098`
        | `text:Policy Exception Management`
        | `type:group`
      >().describe(
        "Policy Exception Management [linkId=260429244098 | codes=[policy-framework-assessment-policy-exception-management]]",
      ).optional(),
    }).brand<
      `linkId:364455629781` | `text:Policy Framework Assessment` | `type:group`
    >().describe(
      "Policy Framework Assessment [linkId=364455629781 | codes=[policy-framework-assessment-overview]]",
    ).optional(),
    additionalNotes: z.string().brand<
      `linkId:795388091631` | `text:Additional Notes` | `type:text`
    >().describe(
      "Additional Notes [linkId=795388091631 | codes=[policy-framework-assessment-additional-notes]]",
    ).optional(),
  }).meta({
    "title":
      "Policy Framework Assessment (Policy Implementation - All CMMC Level 1 Practices)",
    "tsType":
      "PolicyFrameworkAssessmentPolicyImplementationAllCmmcLevel1Practices",
    "schemaConst":
      "policyFrameworkAssessmentPolicyImplementationAllCmmcLevel1PracticesSchema",
  });

export type PolicyFrameworkAssessmentPolicyImplementationAllCmmcLevel1Practices =
  z.infer<
    typeof policyFrameworkAssessmentPolicyImplementationAllCmmcLevel1PracticesSchema
  >;

export const systemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunicationsSchema =
  z.object({
    scL1B1XBoundaryProtection: z.object({
      whatIsTheStatusOfYourNetworkPerimeterSecurityToolsThatControlAndMonitorDataEnteringOrLeavingYourSystems:
        z.string().brand<
          | `linkId:954433842901`
          | `text:What is the status of your network perimeter security (tools that control and monitor data entering or leaving your systems)?`
          | `type:string`
        >().describe(
          "What is the status of your network perimeter security (tools that control and monitor data entering or leaving your systems)? [linkId=954433842901 | codes=[system-communications-protection-status-network-perimeter-security]]",
        ),
      notesEvidence: z.string().brand<
        `linkId:494412529555` | `text:Notes / Evidence ` | `type:string`
      >().describe(
        "Notes / Evidence  [linkId=494412529555 | codes=[system-communication-protection-network-notes-evidence]]",
      ).optional(),
      doYouHaveANetworkDiagramShowingSystemBoundariesKeyComponentsAndDataFlows:
        z.string().brand<
          | `linkId:979372224491`
          | `text:Do you have a network diagram showing system boundaries, key components, and data flows?`
          | `type:string`
        >().describe(
          "Do you have a network diagram showing system boundaries, key components, and data flows? [linkId=979372224491 | codes=[system-communications-protection-network-diagram]]",
        ).optional(),
      notesEvidence2: z.string().brand<
        `linkId:353406656082` | `text:Notes / Evidence ` | `type:string`
      >().describe(
        "Notes / Evidence  [linkId=353406656082 | codes=[system-communication-protection-network-diagram-notes-evidence]]",
      ).optional(),
      _1SystemBoundaryDefinition: z.object({
        whatSystemsProtectTheEdgeOfYourNetworkFromTheOutsideWorldEGInternetTraffic:
          z.string().brand<
            | `linkId:591770672887`
            | `text:What systems protect the edge of your network from the outside world (e.g., internet traffic)?`
            | `type:text`
          >().describe(
            "What systems protect the edge of your network from the outside world (e.g., internet traffic)? [linkId=591770672887 | codes=[system-communications-protection-protect-network-outside-world]]",
          ).optional(),
        whatSystemsProtectSensitiveAreasInsideYourNetworkFromTheRestOfTheCompany:
          z.string().brand<
            | `linkId:930792706809`
            | `text:What systems protect sensitive areas inside your network from the rest of the company?`
            | `type:text`
          >().describe(
            "What systems protect sensitive areas inside your network from the rest of the company? [linkId=930792706809 | codes=[system-communications-protection-protect-sensitive-areas-network]]",
          ).optional(),
      }).brand<
        | `linkId:861774438513`
        | `text:1. System Boundary Definition`
        | `type:group`
      >().describe(
        "1. System Boundary Definition [linkId=861774438513 | codes=[system-communications-protection-system-boundary-definition]]",
      ).optional(),
      _2FirewallConfiguration: z.object({
        firewallManufacturerModel: z.string().brand<
          | `linkId:843201435494`
          | `text:Firewall Manufacturer/Model`
          | `type:text`
        >().describe(
          "Firewall Manufacturer/Model [linkId=843201435494 | codes=[system-communications-protection-firewall-manufacturer-model]]",
        ).optional(),
        firewallSoftwareFirmwareVersion: z.string().brand<
          | `linkId:706452201694`
          | `text:Firewall Software/Firmware Version`
          | `type:text`
        >().describe(
          "Firewall Software/Firmware Version [linkId=706452201694 | codes=[system-communications-protection-firewall-software-firmware-version]]",
        ).optional(),
        defaultDenyPolicyIsImplementedTrafficIsDeniedByDefaultUnlessExplicitlyPermitted:
          z.enum(["Yes", "No"]).brand<
            | `linkId:949755108024`
            | `text:Default deny policy is implemented (traffic is denied by default unless explicitly permitted)`
            | `type:choice`
          >().describe(
            "Default deny policy is implemented (traffic is denied by default unless explicitly permitted) [linkId=949755108024 | codes=[system-communications-protection-default-deny-policy]]",
          ).optional(),
        typeYourCommentsHere: z.string().brand<
          | `linkId:156526970162`
          | `text:Type your comments here...`
          | `type:string`
        >().describe(
          "Type your comments here... [linkId=156526970162 | codes=[system-communications-protection-system-communication-protection-comments]]",
        ).optional(),
        explicitlyAllowedServicesProtocols: z.string().brand<
          | `linkId:963088071424`
          | `text:Explicitly Allowed Services/Protocols`
          | `type:text`
        >().describe(
          "Explicitly Allowed Services/Protocols [linkId=963088071424 | codes=[system-communications-protection-explicitly-allowed-services-protocols]]",
        ).optional(),
        explicitlyDeniedServicesProtocols: z.string().brand<
          | `linkId:122305830447`
          | `text:Explicitly Denied Services/Protocols`
          | `type:text`
        >().describe(
          "Explicitly Denied Services/Protocols [linkId=122305830447 | codes=[system-communications-protection-explicitly-denied-services-protocols]]",
        ).optional(),
      }).brand<
        `linkId:835757897200` | `text:2. Firewall Configuration` | `type:group`
      >().describe(
        "2. Firewall Configuration [linkId=835757897200 | codes=[system-communications-protection-firewall-configuration]]",
      ).optional(),
      _3MonitoringImplementation: z.object({
        howDoYouMonitorTrafficCrossingIntoOrOutOfYourCompanySNetwork: z.array(
          z.enum([
            "Firewall logs and analysis",
            "Intrusion detection/prevention systems",
            "Network monitoring tools",
            "SIEM system integration",
            "Manual log review",
          ]).brand<
            | `linkId:847131102373`
            | `text:How do you monitor traffic crossing into or out of your company’s network?`
            | `type:choice`
          >().describe(
            "How do you monitor traffic crossing into or out of your company’s network? [linkId=847131102373 | codes=[system-communications-protection-monitor-traffic-crossing]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:305967020301` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=305967020301 | codes=[system-communication-protection-monitoring-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:434121826556`
        | `text:3. Monitoring Implementation`
        | `type:group`
      >().describe(
        "3. Monitoring Implementation [linkId=434121826556 | codes=[system-communications-protection-monitoring-implementation]]",
      ).optional(),
      additionalNotes: z.string().brand<
        `linkId:500229418620` | `text:Additional Notes` | `type:string`
      >().describe(
        "Additional Notes [linkId=500229418620 | codes=[system-communications-boundary-protection-protection-additional-notes]]",
      ).optional(),
    }).brand<
      | `linkId:617514452468`
      | `text:SC.L1-B.1.X – Boundary Protection`
      | `type:group`
    >().describe(
      "SC.L1-B.1.X – Boundary Protection [linkId=617514452468 | codes=[system-communications-protection-boundary-protection]]",
    ).optional(),
    scL1B1XSeparatePublicSystemsFromInternalNetworks: z.object({
      whatIsTheStatusOfSeparatingPublicSystemsLikeWebsitesOrPortalsFromYourInternalNetwork:
        z.string().brand<
          | `linkId:274150359667`
          | `text:What is the status of separating public systems (like websites or portals) from your internal network?`
          | `type:string`
        >().describe(
          "What is the status of separating public systems (like websites or portals) from your internal network? [linkId=274150359667 | codes=[system-communications-protection-separating-public-systems]]",
        ),
      notesEvidence: z.string().brand<
        `linkId:496638290461` | `text:Notes / Evidence ` | `type:string`
      >().describe(
        "Notes / Evidence  [linkId=496638290461 | codes=[system-communication-protection-separate-public-system-notes-evidence]]",
      ).optional(),
      _1PubliclyAccessibleSystemComponents: z.object({
        whatPubliclyAccessibleSystemComponentsDoesYourOrganizationOperate: z
          .array(
            z.string().brand<
              | `linkId:956471776047`
              | `text:What publicly accessible system components does your organization operate?`
              | `type:string`
            >().describe(
              "What publicly accessible system components does your organization operate? [linkId=956471776047 | codes=[system-communications-protection-accessible-system-components-operate]]",
            ),
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:272791116387` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=272791116387 | codes=[system-communication-protection-public-accessible-system-notes- evidence]]",
        ).optional(),
      }).brand<
        | `linkId:194546217130`
        | `text:1. Publicly Accessible System Components`
        | `type:group`
      >().describe(
        "1. Publicly Accessible System Components [linkId=194546217130 | codes=[system-communications-protection-publicly-accessible-system-components]]",
      ).optional(),
      _2NetworkSeparationImplementation: z.object({
        howArePubliclyAccessibleSystemsSeparatedFromInternalNetworks: z.array(
          z.string().brand<
            | `linkId:517448335213`
            | `text:How are publicly accessible systems separated from internal networks?`
            | `type:string`
          >().describe(
            "How are publicly accessible systems separated from internal networks? [linkId=517448335213 | codes=[system-communications-protection-publicly-accessible-systems-separated]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:299978179191` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=299978179191 | codes=[system-communication-protection-network-separation-notes- evidence]]",
        ).optional(),
      }).brand<
        | `linkId:560463506575`
        | `text:2. Network Separation Implementation`
        | `type:group`
      >().describe(
        "2. Network Separation Implementation [linkId=560463506575 | codes=[system-communications-protection-network-separation-implementation]]",
      ).optional(),
      _3AccessControlBetweenNetworks: z.object({
        whatControlsPreventUnauthorizedAccessFromPublicNetworksToInternalNetworks:
          z.array(
            z.string().brand<
              | `linkId:634425708590`
              | `text:What controls prevent unauthorized access from public networks to internal networks?`
              | `type:string`
            >().describe(
              "What controls prevent unauthorized access from public networks to internal networks? [linkId=634425708590 | codes=[system-communications-protection-prevent-unauthorized-access-public]]",
            ),
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:845777456178` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=845777456178 | codes=[system-communication-protection-access-control-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:126262667735`
        | `text:3. Access Control Between Networks`
        | `type:group`
      >().describe(
        "3. Access Control Between Networks [linkId=126262667735 | codes=[system-communications-protection-access-control-between-networks]]",
      ).optional(),
      _4DmzPublicNetworkMonitoring: z.object({
        howDoYouMonitorActivityInYourPublicFacingNetworkSegments: z.array(
          z.string().brand<
            | `linkId:536378863536`
            | `text:How do you monitor activity in your public-facing network segments?`
            | `type:string`
          >().describe(
            "How do you monitor activity in your public-facing network segments? [linkId=536378863536 | codes=[system-communications-protection-monitor-activity-public-facing-network]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:122899280845` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=122899280845 | codes=[system-communication-protection-public-network-notes- evidence]]",
        ).optional(),
      }).brand<
        | `linkId:414442892901`
        | `text:4. DMZ/Public Network Monitoring`
        | `type:group`
      >().describe(
        "4. DMZ/Public Network Monitoring [linkId=414442892901 | codes=[system-communications-protection-DMZ-public-network-monitoring]]",
      ).optional(),
      additionalNotes: z.string().brand<
        `linkId:388464619346` | `text:Additional Notes` | `type:string`
      >().describe(
        "Additional Notes [linkId=388464619346 | codes=[system-communication-protection-public-network-additional notes]]",
      ).optional(),
    }).brand<
      | `linkId:587208645662`
      | `text:SC.L1-B.1.X – Separate Public Systems from Internal Networks`
      | `type:group`
    >().describe(
      "SC.L1-B.1.X – Separate Public Systems from Internal Networks [linkId=587208645662 | codes=[system-communications-protection-separate-public-systems-internal-networks]]",
    ).optional(),
  }).meta({
    "title":
      "System & Communications Protection (Monitor, control, and protect organizational communications)",
    "tsType":
      "SystemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunications",
    "schemaConst":
      "systemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunicationsSchema",
  });

export type SystemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunications =
  z.infer<
    typeof systemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunicationsSchema
  >;

export const companyInformationSchema = z.object({
  organizationName: z.string().brand<
    `linkId:715544477968` | `text:Organization Name` | `type:string`
  >().describe(
    "Organization Name [linkId=715544477968 | codes=[company-information-organization-name]]",
  ),
  formCompletedBy: z.string().brand<
    `linkId:655141523763` | `text:Form Completed By` | `type:string`
  >().describe(
    "Form Completed By [linkId=655141523763 | codes=[company-information-form-completed-by]]",
  ),
  positionTitle: z.string().brand<
    `linkId:761144039651` | `text:Position/Title` | `type:string`
  >().describe(
    "Position/Title [linkId=761144039651 | codes=[company-information-position-title]]",
  ).optional(),
  emailAddress: z.string().brand<
    `linkId:441278853405` | `text:Email Address` | `type:string`
  >().describe(
    "Email Address [linkId=441278853405 | codes=[company-information-email-address]]",
  ),
  workPhone: z.string().brand<
    `linkId:375736159279` | `text:Work Phone` | `type:string`
  >().describe(
    "Work Phone [linkId=375736159279 | codes=[company-information-work-phone]]",
  ),
  mobilePhone: z.string().brand<
    `linkId:948589414714` | `text:Mobile Phone` | `type:string`
  >().describe(
    "Mobile Phone [linkId=948589414714 | codes=[company-information-mobile-phone]]",
  ),
  assessmentDate: z.string().brand<
    `linkId:276403539223` | `text:Assessment Date` | `type:date`
  >().describe(
    "Assessment Date [linkId=276403539223 | codes=[company-information-assessment-date]]",
  ).optional(),
  industry: z.string().brand<
    `linkId:789286873476` | `text:Industry` | `type:string`
  >().describe(
    "Industry [linkId=789286873476 | codes=[company-information-industry]]",
  ).optional(),
  employeeCount: z.string().brand<
    `linkId:697235963218` | `text:Employee Count` | `type:string`
  >().describe(
    "Employee Count [linkId=697235963218 | codes=[company-information-employee-count]]",
  ).optional(),
  contractTypes: z.string().brand<
    `linkId:863463230823` | `text:Contract Types` | `type:text`
  >().describe(
    "Contract Types [linkId=863463230823 | codes=[company-information-contract-types]]",
  ).optional(),
  organizationIdentifiers: z.object({
    cageCode: z.string().brand<
      `linkId:805221373063` | `text:CAGE Code` | `type:string`
    >().describe(
      "CAGE Code [linkId=805221373063 | codes=[company-information-cage-code]]",
    ).optional(),
    dunsNumber: z.string().brand<
      `linkId:374784155003` | `text:DUNS Number` | `type:string`
    >().describe(
      "DUNS Number [linkId=374784155003 | codes=[company-information-duns-number]]",
    ).optional(),
  }).brand<
    `linkId:127163950314` | `text:Organization Identifiers` | `type:group`
  >().describe(
    "Organization Identifiers [linkId=127163950314 | codes=[company-information-organization-identifiers]]",
  ).optional(),
}).meta({
  "title": "Company Information",
  "tsType": "CompanyInformation",
  "schemaConst": "companyInformationSchema",
});

export type CompanyInformation = z.infer<typeof companyInformationSchema>;

export const mediaProtectionProtectInformationOnDigitalAndNonDigitalMediaSchema =
  z.object({
    mpL1B1ViiMediaProtectionMp1Practice: z.object({
      doYouHaveAWrittenPolicyForSafelyDisposingOfDevicesAndMediaLikeLaptopsPhonesHardDrivesCdsOrPaperThatContainFederalContractInformationFciThisIsCalledAMediaDisposalPolicy:
        z.enum(["Yes", "No"]).brand<
          | `linkId:957584520694`
          | `text:Do you have a written policy for safely disposing of devices and media (like laptops, phones, hard drives, CDs, or paper) that contain Federal Contract Information (FCI)? (This is called a Media Disposal Policy.)`
          | `type:choice`
        >().describe(
          "Do you have a written policy for safely disposing of devices and media (like laptops, phones, hard drives, CDs, or paper) that contain Federal Contract Information (FCI)? (This is called a Media Disposal Policy.) [linkId=957584520694 | codes=[media-protection-media-disposal-policy]]",
        ).optional(),
      notesEvidence: z.string().brand<
        `linkId:256250807567` | `text:Notes / Evidence` | `type:string`
      >().describe(
        "Notes / Evidence [linkId=256250807567 | codes=[media-protection-media-disposal-policy-notes]]",
      ).optional(),
      implementationStatus: z.enum([
        "Fully Implemented",
        "Partially Implemented",
        " Not Implemented",
      ]).brand<
        `linkId:272642906092` | `text:Implementation Status` | `type:choice`
      >().describe(
        "Implementation Status [linkId=272642906092 | codes=[media-protection-implementation-status]]",
      ).optional(),
      notesEvidence2: z.string().brand<
        `linkId:806966265807` | `text:Notes / Evidence` | `type:string`
      >().describe(
        "Notes / Evidence [linkId=806966265807 | codes=[media-protection-implementation-status-notes]]",
      ).optional(),
      confirmThatYourMediaDisposalPolicyIncludesTheFollowingElementsClickAllThatApply:
        z.array(
          z.enum([
            "Types of media covered by policy (Policy defines all types of media that may contain FCI (hard drives, SSDs, USB drives, etc.))",
            "Identification methods for FCI-containing media (Procedures for identifying media that contains or may contain FCI)",
            "Sanitization methods by media type (Specific sanitization methods appropriate for each media type)",
            "Destruction methods by media type (Specific destruction methods appropriate for each media type)",
            "Verification requirements (Procedures to verify sanitization or destruction was successful)",
            "Documentation requirements (Required records of sanitization and destruction activities)",
            "Roles and responsibilities (Designation of who is responsible for each aspect of media disposal)",
            "Compliance with relevant standards (References to NIST SP 800-88 or other applicable standards)",
          ]).brand<
            | `linkId:698818405059`
            | `text:Confirm that your media disposal policy includes the following elements (click all that apply):`
            | `type:choice`
          >().describe(
            "Confirm that your media disposal policy includes the following elements (click all that apply): [linkId=698818405059 | codes=[media-protection-media-disposal-policy-elements]]",
          ),
        ).optional(),
      notesEvidence3: z.string().brand<
        `linkId:686200078306` | `text:Notes / Evidence` | `type:string`
      >().describe(
        "Notes / Evidence [linkId=686200078306 | codes=[media-protection-media-disposal-policy-elements-notes]]",
      ).optional(),
    }).brand<
      | `linkId:609511072752`
      | `text:MP.L1-B.1.VII - MEDIA PROTECTION (MP) - 1 PRACTICE`
      | `type:group`
    >().describe(
      "MP.L1-B.1.VII - MEDIA PROTECTION (MP) - 1 PRACTICE [linkId=609511072752 | codes=[media-protection-overview]]",
    ).optional(),
  }).meta({
    "title":
      "Media Protection Protect Information On Digital And Non Digital Media",
    "tsType": "MediaProtectionProtectInformationOnDigitalAndNonDigitalMedia",
    "schemaConst":
      "mediaProtectionProtectInformationOnDigitalAndNonDigitalMediaSchema",
  });

export type MediaProtectionProtectInformationOnDigitalAndNonDigitalMedia =
  z.infer<
    typeof mediaProtectionProtectInformationOnDigitalAndNonDigitalMediaSchema
  >;

export const accessControlLimitInformationSystemAccessToAuthorizedUsersAndProcessesSchema =
  z.object({
    acL1B1IAuthorizedAccessControl: z.object({
      doYouHaveAnAccessControlPolicy: z.enum(["Yes", " No"]).brand<
        | `linkId:744146359806`
        | `text:Do you have an Access Control Policy?`
        | `type:choice`
      >().describe(
        "Do you have an Access Control Policy? [linkId=744146359806 | codes=[access-control-policy-exists]]",
      ).optional(),
      accessControlPolicyElements: z.object({
        doesYourDocumentedAccessControlPolicyAddressTheseItems: z.array(
          z.enum([
            "Purpose, scope, roles, and responsibilities",
            "Management commitment",
            "Coordination among organizational entities",
            "Compliance requirements",
          ]).brand<
            | `linkId:669545773690`
            | `text:Does your documented access control policy address these items?`
            | `type:choice`
          >().describe(
            "Does your documented access control policy address these items? [linkId=669545773690 | codes=[access-control-policy-elements-items]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:687383539343` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=687383539343 | codes=[access-control-policy-elements-items-notes]]",
        ).optional(),
      }).brand<
        | `linkId:480722725067`
        | `text:Access Control Policy Elements`
        | `type:group`
      >().describe(
        "Access Control Policy Elements [linkId=480722725067 | codes=[access-control-policy-elements-group]]",
      ).optional(),
      userAccountRegistry: z.object({
        activeUserAccounts: z.number().int().brand<
          `linkId:927965645729` | `text:Active user accounts:` | `type:integer`
        >().describe(
          "Active user accounts: [linkId=927965645729 | codes=[access-control-count-active-accounts]]",
        ).optional(),
        inactiveDisabledUserAccounts: z.number().int().brand<
          | `linkId:903940962912`
          | `text:Inactive/disabled user accounts:`
          | `type:integer`
        >().describe(
          "Inactive/disabled user accounts: [linkId=903940962912 | codes=[access-control-count-inactive-accounts]]",
        ).optional(),
        serviceAccounts: z.number().int().brand<
          `linkId:338820008158` | `text:Service accounts:` | `type:integer`
        >().describe(
          "Service accounts: [linkId=338820008158 | codes=[access-control-count-service-accounts]]",
        ).optional(),
        sharedAccounts: z.number().int().brand<
          `linkId:673437974050` | `text:Shared accounts:` | `type:integer`
        >().describe(
          "Shared accounts: [linkId=673437974050 | codes=[access-control-count-shared-accounts]]",
        ).optional(),
      }).brand<
        `linkId:217670863053` | `text:User Account Registry` | `type:group`
      >().describe(
        "User Account Registry [linkId=217670863053 | codes=[access-control-user-account-registry-group]]",
      ).optional(),
      principleOfLeastPrivilegeImplementation: z.object({
        theLeastPrivilegeRuleMeansStaffShouldHaveOnlyTheLevelOfSystemAccessTheirRoleRequiresAndNoMoreWhereInYourSystemsDoYouApplyThisRule:
          z.enum([
            "Fully implemented across all systems",
            "Partially implemented",
            "Not implemented",
          ]).brand<
            | `linkId:368418823104`
            | `text:The ‘least privilege’ rule means staff should have only the level of system access their role requires (and no more). Where in your systems do you apply this rule?`
            | `type:choice`
          >().describe(
            "The ‘least privilege’ rule means staff should have only the level of system access their role requires (and no more). Where in your systems do you apply this rule? [linkId=368418823104 | codes=[access-control-least-privilege-status]]",
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:650863308787` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=650863308787 | codes=[access-control-least-privilege-status-notes]]",
        ).optional(),
      }).brand<
        | `linkId:159744780603`
        | `text:Principle of Least Privilege Implementation`
        | `type:group`
      >().describe(
        "Principle of Least Privilege Implementation [linkId=159744780603 | codes=[access-control-least-privilege-group]]",
      ).optional(),
      accountManagementProcesses: z.object({
        howDoYouAddChangeAndRemoveEmployeeAccessToCompanySystems: z.array(
          z.enum([
            "We use an automated system that creates and removes access for us.",
            "We handle it manually, but require manager approval before access is given.",
            "Our HR system is connected, so access changes automatically when people join or leave.",
            "We regularly review who has access and confirm it’s still correct.",
          ]).brand<
            | `linkId:341135397442`
            | `text:How do you add, change, and remove employee access to company systems?`
            | `type:choice`
          >().describe(
            "How do you add, change, and remove employee access to company systems? [linkId=341135397442 | codes=[access-control-account-lifecycle-process]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:700016005983` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=700016005983 | codes=[access-control-account-lifecycle-process-notes]]",
        ).optional(),
        accountReviewFrequency: z.object({
          howFrequentlyAreUserAccountsReviewedForValidityAndAppropriateAccess: z
            .enum(["Monthly", " Quarterly", "Annually", "Other (specify):"])
            .brand<
              | `linkId:563546854643`
              | `text:How frequently are user accounts reviewed for validity and appropriate access?`
              | `type:choice`
            >().describe(
              "How frequently are user accounts reviewed for validity and appropriate access? [linkId=563546854643 | codes=[access-control-account-review-frequency-question]]",
            ).optional(),
          notesEvidence: z.string().brand<
            `linkId:469989997039` | `text:Notes / Evidence` | `type:string`
          >().describe(
            "Notes / Evidence [linkId=469989997039 | codes=[access-control-account-review-frequency-notes]]",
          ).optional(),
        }).brand<
          `linkId:789082578732` | `text:Account Review Frequency` | `type:group`
        >().describe(
          "Account Review Frequency [linkId=789082578732 | codes=[access-control-account-review-group]]",
        ).optional(),
      }).brand<
        | `linkId:589953648417`
        | `text:Account Management Processes`
        | `type:group`
      >().describe(
        "Account Management Processes [linkId=589953648417 | codes=[access-control-account-management-group]]",
      ).optional(),
    }).brand<
      | `linkId:461149605484`
      | `text:AC.L1-B.1.I - Authorized Access Control`
      | `type:group`
    >().describe(
      "AC.L1-B.1.I - Authorized Access Control [linkId=461149605484 | codes=[access-control-authorized-access-control]]",
    ).optional(),
    acL1B1IiTransactionFunctionControl: z.object({
      whatIsTheStatusOfLeastPrivilegeImplementationMakingSureEmployeesOnlyHaveAccessToTheSpecificActionsTheirRoleRequiresForExampleReadVsEditVsApprove:
        z.enum([
          "Fully implemented – access is role-based and regularly reviewed.",
          "Partially implemented – some roles limited, others still too broad.",
          "Not implemented – all users have broad access.",
          "Not applicable – no sensitive transactions in scope.",
        ]).brand<
          | `linkId:316234331937`
          | `text:What is the status of least privilege implementation (making sure employees only have access to the specific actions their role requires, for example, read vs. edit vs. approve)?`
          | `type:choice`
        >().describe(
          "What is the status of least privilege implementation (making sure employees only have access to the specific actions their role requires, for example, read vs. edit vs. approve)? [linkId=316234331937 | codes=[access-control-least-privilege-transaction-status]]",
        ).optional(),
      notesEvidence: z.string().brand<
        `linkId:983575859757` | `text:Notes / Evidence ` | `type:string`
      >().describe(
        "Notes / Evidence  [linkId=983575859757 | codes=[access-control-least-privilege-transaction-status-notes]]",
      ).optional(),
      transactionControlImplementation: z.object({
        howDoYouLimitEmployeesToOnlyTheSystemActionsTheirJobRequires: z.enum([
          "By job role (e.g., managers vs. staff have different access).",
          "By type of action (e.g., can read data but not edit or delete it).",
          "By application (e.g., only certain people can use a given tool).",
          "By time (e.g., access only during work hours).",
          "By location (e.g., access only from the office or approved networks).",
        ]).brand<
          | `linkId:589002798804`
          | `text:How do you limit employees to only the system actions their job requires?`
          | `type:choice`
        >().describe(
          "How do you limit employees to only the system actions their job requires? [linkId=589002798804 | codes=[access-control-limit-employee-actions]]",
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:635610218995` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=635610218995 | codes=[access-control-limit-employee-actions-notes]]",
        ).optional(),
      }).brand<
        | `linkId:899089109837`
        | `text:Transaction Control Implementation`
        | `type:group`
      >().describe(
        "Transaction Control Implementation [linkId=899089109837 | codes=[access-control-transaction-control-group]]",
      ).optional(),
      functionRestrictionsByRole: z.object({
        whatActionsAreLimitedToCertainJobRolesEGOnlyManagersCanApproveStaffCanOnlyView:
          z.array(
            z.enum([
              "Administrative functions (user management, system configuration)",
              "Financial transactions and approvals",
              "Data export and bulk download functions",
              "Report generation and access",
              "System-level commands and utilities",
            ]).brand<
              | `linkId:525896610609`
              | `text:What actions are limited to certain job roles (e.g., only managers can approve, staff can only view)?`
              | `type:choice`
            >().describe(
              "What actions are limited to certain job roles (e.g., only managers can approve, staff can only view)? [linkId=525896610609 | codes=[access-control-role-limited-actions]]",
            ),
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:524794183862` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=524794183862 | codes=[access-control-role-limited-actions-notes]]",
        ).optional(),
      }).brand<
        | `linkId:561249826496`
        | `text:Function Restrictions by Role`
        | `type:group`
      >().describe(
        "Function Restrictions by Role [linkId=561249826496 | codes=[access-control-function-restrictions-group]]",
      ).optional(),
      transactionAuthorizationRequirements: z.object({
        howDoYouMakeSureSensitiveActionsLikePaymentsOrDataChangesGetProperApprovalBeforeTheyHappen:
          z.array(
            z.enum([
              "Manager approval required",
              "Two-person authorization",
              "Automated business rules and limits",
              "No special authorization required",
            ]).brand<
              | `linkId:859148329958`
              | `text:How do you make sure sensitive actions (like payments or data changes) get proper approval before they happen?`
              | `type:choice`
            >().describe(
              "How do you make sure sensitive actions (like payments or data changes) get proper approval before they happen? [linkId=859148329958 | codes=[access-control-sensitive-action-approval-process]]",
            ),
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:988634546235` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=988634546235 | codes=[access-control-sensitive-action-approval-notes]]",
        ).optional(),
      }).brand<
        | `linkId:338456195634`
        | `text:Transaction Authorization Requirements`
        | `type:group`
      >().describe(
        "Transaction Authorization Requirements [linkId=338456195634 | codes=[access-control-transaction-auth-group]]",
      ).optional(),
    }).brand<
      | `linkId:700726342337`
      | `text:AC.L1-B.1.II - Transaction & Function Control`
      | `type:group`
    >().describe(
      "AC.L1-B.1.II - Transaction & Function Control [linkId=700726342337 | codes=[access-control-transaction-function-control]]",
    ).optional(),
    acL1B1IiiExternalConnections: z.object({
      whatIsTheStatusOfYourControlsOverOutsideConnectionsInternetCloudToolsPersonalDevices:
        z.enum([
          "Fully implemented – Only approved external systems can connect; all activity is monitored.",
          "Partially implemented – Some external connections are controlled, but gaps remain.",
          "Not implemented – Any system or device can connect without restriction.",
          "Not applicable – No external systems connect to the environment in scope.",
        ]).brand<
          | `linkId:358071855489`
          | `text:What is the status of your controls over outside connections (internet, cloud tools, personal devices)?`
          | `type:choice`
        >().describe(
          "What is the status of your controls over outside connections (internet, cloud tools, personal devices)? [linkId=358071855489 | codes=[access-control-external-connections-status]]",
        ).optional(),
      notesEvidence: z.string().brand<
        `linkId:108304278260` | `text:Notes / Evidence ` | `type:string`
      >().describe(
        "Notes / Evidence  [linkId=108304278260 | codes=[access-control-external-connections-status-notes]]",
      ).optional(),
      externalSystemConnections: z.object({
        whatKindsOfOutsideSystemsOrDevicesConnectToYourCompanySNetworkOrDataThinkAboutEmailFileSharingPartnerPortalsOrEmployeeDevices:
          z.array(
            z.enum([
              "Cloud services – e.g., Microsoft 365, Google Workspace, Dropbox, Salesforce.",
              "Business partner networks – e.g., joint project portals, shared databases.",
              "Vendor/supplier systems – e.g., ERP integrations, supplier ordering platforms.",
              "Government systems and portals – e.g., DoD contractor portals, SAM.gov, PIEE.",
              "Personal devices (BYOD) – e.g., employees’ personal laptops, phones, or tablets.",
              "Remote access systems – e.g., VPN, Citrix, Microsoft RDP.",
              "No external connections – We keep all systems completely internal.",
            ]).brand<
              | `linkId:261758300502`
              | `text:What kinds of outside systems or devices connect to your company’s network or data? (Think about email, file sharing, partner portals, or employee devices.)`
              | `type:choice`
            >().describe(
              "What kinds of outside systems or devices connect to your company’s network or data? (Think about email, file sharing, partner portals, or employee devices.) [linkId=261758300502 | codes=[access-control-external-system-types]]",
            ),
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:681710464598` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=681710464598 | codes=[access-control-external-system-types-notes]]",
        ).optional(),
      }).brand<
        | `linkId:118413869969`
        | `text: External System Connections`
        | `type:group`
      >().describe(
        " External System Connections [linkId=118413869969 | codes=[access-control-external-systems-group]]",
      ).optional(),
      connectionVerificationMethods: z.object({
        howDoYouCheckThatOutsideSystemsAndDevicesAreSafeBeforeTheyConnectToYourNetwork:
          z.array(
            z.enum([
              "We use digital certificates and PKI to prove identity.",
              "We require VPN logins with authentication before allowing access.",
              "We set firewall rules or restrict by IP address so only approved connections get through.",
              "We use signed agreements with partners/vendors that spell out security requirements.",
              "We continuously monitor and log external connections to spot suspicious activity.",
            ]).brand<
              | `linkId:495111707033`
              | `text:How do you check that outside systems and devices are safe before they connect to your network?`
              | `type:choice`
            >().describe(
              "How do you check that outside systems and devices are safe before they connect to your network? [linkId=495111707033 | codes=[access-control-external-system-safety-check]]",
            ),
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:895273053564` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=895273053564 | codes=[access-control-external-system-safety-check-notes]]",
        ).optional(),
      }).brand<
        | `linkId:397995568740`
        | `text:Connection Verification Methods`
        | `type:group`
      >().describe(
        "Connection Verification Methods [linkId=397995568740 | codes=[access-control-connection-verification-group]]",
      ).optional(),
      connectionControlLimitations: z.object({
        whatLimitationsArePlacedOnExternalConnections: z.array(
          z.enum([
            "Time-based access restrictions",
            "Restrictions on data types that can be shared",
            "Limited to specific user groups",
            "Management approval required for each connection",
            "Comprehensive audit trails and logging",
          ]).brand<
            | `linkId:597499672942`
            | `text:What limitations are placed on external connections?`
            | `type:choice`
          >().describe(
            "What limitations are placed on external connections? [linkId=597499672942 | codes=[access-control-connection-limitations-list]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:197339830339` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=197339830339 | codes=[access-control-connection-limitations-notes]]",
        ).optional(),
      }).brand<
        | `linkId:354025378477`
        | `text:Connection Control Limitations`
        | `type:group`
      >().describe(
        "Connection Control Limitations [linkId=354025378477 | codes=[access-control-connection-limitations-group]]",
      ).optional(),
    }).brand<
      | `linkId:293091353060`
      | `text:AC.L1-B.1.III - External Connections`
      | `type:group`
    >().describe(
      "AC.L1-B.1.III - External Connections [linkId=293091353060 | codes=[access-control-external-connections]]",
    ).optional(),
    acL1B1IvControlPublicInformation: z.object({
      whatSTheStatusOfYourProcessToMakeSureSensitiveContractInformationFciIsnTAccidentallyPostedOnYourWebsiteSocialMediaOrOtherPublicSystems:
        z.enum([
          "Fully implemented – We have a written approval process, only authorized staff can post, and we review/remove public content regularly.",
          "Partially implemented – Some controls are in place (e.g., only certain staff can post), but no formal review or monitoring.",
          "Not implemented – Anyone can post content publicly without checks, and there is no process for review.",
        ]).brand<
          | `linkId:260717222110`
          | `text:What's the status of your process to make sure sensitive contract information (FCI) isn’t accidentally posted on your website, social media, or other public systems?`
          | `type:choice`
        >().describe(
          "What's the status of your process to make sure sensitive contract information (FCI) isn’t accidentally posted on your website, social media, or other public systems? [linkId=260717222110 | codes=[access-control-public-info-process-status]]",
        ).optional(),
      notesEvidence: z.string().brand<
        `linkId:813842964343` | `text:Notes / Evidence` | `type:string`
      >().describe(
        "Notes / Evidence [linkId=813842964343 | codes=[access-control-public-info-process-status-notes]]",
      ).optional(),
      publiclyAccessibleSystems: z.object({
        whatPubliclyAccessibleSystemsDoesYourOrganizationOperate: z.array(
          z.enum([
            "Company website",
            " Social media accounts",
            "Customer portals or self-service systems",
            "Corporate blog or news site",
            "Public forums or discussion boards",
            "No publicly accessible systems",
          ]).brand<
            | `linkId:660159010455`
            | `text:What publicly accessible systems does your organization operate?`
            | `type:choice`
          >().describe(
            "What publicly accessible systems does your organization operate? [linkId=660159010455 | codes=[access-control-public-systems-list]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:252003749158` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=252003749158 | codes=[access-control-public-systems-list-notes]]",
        ).optional(),
      }).brand<
        | `linkId:501427838641`
        | `text:Publicly Accessible Systems`
        | `type:group`
      >().describe(
        "Publicly Accessible Systems [linkId=501427838641 | codes=[access-control-public-systems-group]]",
      ).optional(),
      contentReviewProcess: z.object({
        howDoYouEnsureFciFederalContractInformationIsNotPostedOnPublicSystems: z
          .array(
            z.enum([
              "Pre-publication review and approval process",
              "Designated reviewers trained to identify FCI",
              "Automated content scanning for sensitive information",
              "Periodic audits of published content",
              "Procedures for rapid removal of inappropriate content",
            ]).brand<
              | `linkId:229261839700`
              | `text:How do you ensure FCI (Federal Contract Information) is not posted on public systems?`
              | `type:choice`
            >().describe(
              "How do you ensure FCI (Federal Contract Information) is not posted on public systems? [linkId=229261839700 | codes=[access-control-fci-posting-prevention-process]]",
            ),
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:633971923340` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=633971923340 | codes=[access-control-fci-posting-prevention-notes]]",
        ).optional(),
      }).brand<
        `linkId:786703783052` | `text:Content Review Process` | `type:group`
      >().describe(
        "Content Review Process [linkId=786703783052 | codes=[access-control-content-review-group]]",
      ).optional(),
      authorizedPublishingPersonnel: z.object({
        numberOfAuthorizedPersonnel: z.number().int().brand<
          | `linkId:374839487767`
          | `text:Number of authorized personnel:`
          | `type:integer`
        >().describe(
          "Number of authorized personnel: [linkId=374839487767 | codes=[access-control-authorized-personnel-count]]",
        ).optional(),
        chooseAllThatApply: z.array(
          z.enum([
            "Marketing department",
            "Communications/PR team",
            "Executive leadership",
            "IT administrators",
          ]).brand<
            | `linkId:177243885107`
            | `text:Choose all that apply:`
            | `type:choice`
          >().describe(
            "Choose all that apply: [linkId=177243885107 | codes=[access-control-authorized-personnel-depts]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:163760226494` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=163760226494 | codes=[access-control-authorized-personnel-notes]]",
        ).optional(),
      }).brand<
        | `linkId:815496752107`
        | `text:Authorized Publishing Personnel`
        | `type:group`
      >().describe(
        "Authorized Publishing Personnel [linkId=815496752107 | codes=[access-control-authorized-personnel-group]]",
      ).optional(),
    }).brand<
      | `linkId:942841103790`
      | `text:AC.L1-B.1.IV - Control Public Information`
      | `type:group`
    >().describe(
      "AC.L1-B.1.IV - Control Public Information [linkId=942841103790 | codes=[access-control-control-public-info]]",
    ).optional(),
  }).meta({
    "title":
      "Access Control Limit Information System Access To Authorized Users And Processes",
    "tsType":
      "AccessControlLimitInformationSystemAccessToAuthorizedUsersAndProcesses",
    "schemaConst":
      "accessControlLimitInformationSystemAccessToAuthorizedUsersAndProcessesSchema",
  });

export type AccessControlLimitInformationSystemAccessToAuthorizedUsersAndProcesses =
  z.infer<
    typeof accessControlLimitInformationSystemAccessToAuthorizedUsersAndProcessesSchema
  >;

export const identificationAuthenticationSchema = z.object({
  iaL1B1VIdentification: z.object({
    notesEvidence: z.string().brand<
      `linkId:608483664601` | `text:Notes / Evidence` | `type:text`
    >().describe(
      "Notes / Evidence [linkId=608483664601 | codes=[identification-authentication-identification-section-notes]]",
    ).optional(),
    whatIsTheStatusOfMakingSureAllEmployeesDevicesAndAutomatedToolsThatUseYourSystemsHaveUniqueIdsSoYouCanTellThemApart:
      z.enum([
        "Fully implemented – Every employee has their own login, devices are uniquely identified, and automated tools are tracked.",
        "Partially implemented – Most users/devices have unique IDs, but some accounts are still shared or not clearly identified.",
        "Not implemented – Users or devices share accounts, or there is no way to uniquely identify who/what is accessing systems.",
      ]).brand<
        | `linkId:362061549890`
        | `text:What is the status of making sure all employees, devices, and automated tools that use your systems have unique IDs so you can tell them apart?`
        | `type:choice`
      >().describe(
        "What is the status of making sure all employees, devices, and automated tools that use your systems have unique IDs so you can tell them apart? [linkId=362061549890 | codes=[identification-authentication-status-unique-ids]]",
      ).optional(),
    whatFormatDoYouUseToCreateEmployeeLoginIds: z.enum([
      " First name + last name (john.smith)",
      " First initial + last name (jsmith)",
      " Employee ID numbers (EMP001234)",
      " Department codes + names (IT-jsmith)",
    ]).brand<
      | `linkId:139461602895`
      | `text:What format do you use to create employee login IDs?`
      | `type:choice`
    >().describe(
      "What format do you use to create employee login IDs? [linkId=139461602895 | codes=[identification-authentication-employee-login-id-format]]",
    ).optional(),
    serviceAccountManagement: z.object({
      numberOfServiceAccountsSpecialLoginsUsedBySoftwareOrAutomatedToolsNotPeople:
        z.number().int().brand<
          | `linkId:179545641231`
          | `text:Number of service accounts (special logins used by software or automated tools, not people):`
          | `type:integer`
        >().describe(
          "Number of service accounts (special logins used by software or automated tools, not people): [linkId=179545641231 | codes=[identification-authentication-number-of-service-accounts]]",
        ).optional(),
      checkAllThatApply: z.array(
        z.enum([
          " Database services",
          " Web applications",
          " Backup processes",
          " Monitoring/logging services",
          "Security scanning tools",
        ]).brand<
          `linkId:753553198622` | `text:Check all that apply:` | `type:choice`
        >().describe("Check all that apply: [linkId=753553198622]"),
      ).optional(),
      notesEvidence: z.string().brand<
        `linkId:441172825241` | `text:Notes / Evidence` | `type:text`
      >().describe(
        "Notes / Evidence [linkId=441172825241 | codes=[identification-authentication-service-account-management-notes]]",
      ).optional(),
      doYouKeepAListOrSpreadsheetOfAllCompanyDevicesComputersPhonesServersEtcThatConnectToYourSystems:
        z.enum(["Yes", "No"]).brand<
          | `linkId:926744954268`
          | `text:Do you keep a list or spreadsheet of all company devices (computers, phones, servers, etc.) that connect to your systems?`
          | `type:choice`
        >().describe(
          "Do you keep a list or spreadsheet of all company devices (computers, phones, servers, etc.) that connect to your systems? [linkId=926744954268 | codes=[identification-authentication-company-device-inventory-list]]",
        ).optional(),
      howDoYouVerifyAPersonSIdentityBeforeGivingThemAccessToCompanySystems: z
        .array(
          z.enum([
            "HR verification with employee records",
            "Manager approval with written authorization",
            "Background check completion",
            "Photo identification verification",
          ]).brand<
            | `linkId:297397401977`
            | `text:How do you verify a person’s identity before giving them access to company systems?`
            | `type:choice`
          >().describe(
            "How do you verify a person’s identity before giving them access to company systems? [linkId=297397401977 | codes=[identification-authentication-user-identity-verification-process]]",
          ),
        ).optional(),
      notesEvidence2: z.string().brand<
        `linkId:627017348272` | `text:Notes / Evidence` | `type:text`
      >().describe(
        "Notes / Evidence [linkId=627017348272 | codes=[identification-authentication-user-identity-verification-notes]]",
      ).optional(),
    }).brand<
      `linkId:446911811643` | `text:Service Account Management` | `type:group`
    >().describe(
      "Service Account Management [linkId=446911811643 | codes=[identification-authentication-service-account-management]]",
    ).optional(),
    deviceInventory: z.object({
      workstationsLaptops: z.number().int().brand<
        `linkId:878410531769` | `text:Workstations/laptops:` | `type:integer`
      >().describe(
        "Workstations/laptops: [linkId=878410531769 | codes=[identification-authentication-device-count-workstations]]",
      ).optional(),
      servers: z.number().int().brand<
        `linkId:361034048943` | `text:Servers:` | `type:integer`
      >().describe(
        "Servers: [linkId=361034048943 | codes=[identification-authentication-device-count-servers]]",
      ).optional(),
      mobileDevices: z.number().int().brand<
        `linkId:424090205463` | `text:Mobile devices:` | `type:integer`
      >().describe(
        "Mobile devices: [linkId=424090205463 | codes=[identification-authentication-device-count-mobile]]",
      ).optional(),
      networkDevices: z.number().int().brand<
        `linkId:764441913827` | `text:Network devices:` | `type:integer`
      >().describe(
        "Network devices: [linkId=764441913827 | codes=[identification-authentication-device-count-network]]",
      ).optional(),
    }).brand<`linkId:543189099428` | `text:Device Inventory` | `type:group`>()
      .describe(
        "Device Inventory [linkId=543189099428 | codes=[identification-authentication-device-inventory]]",
      ).optional(),
    everyComputerPhoneOrServerShouldHaveAUniqueIdentifierSoYouKnowExactlyWhichDeviceIsConnectingHowDoYouUniquelyIdentifyEachDeviceThatConnectsToYourSystems:
      z.array(
        z.enum([
          "MAC addresses",
          "IP addresses (static)",
          "Computer/device names",
          "Asset tag numbers",
          "Serial numbers",
          "Certificates/digital signatures",
        ]).brand<
          | `linkId:359160217347`
          | `text:Every computer, phone, or server should have a unique identifier so you know exactly which device is connecting. How do you uniquely identify each device that connects to your systems?`
          | `type:choice`
        >().describe(
          "Every computer, phone, or server should have a unique identifier so you know exactly which device is connecting. How do you uniquely identify each device that connects to your systems? [linkId=359160217347 | codes=[identification-authentication-device-identification-methods]]",
        ),
      ).optional(),
    notesEvidence2: z.string().brand<
      `linkId:346437919917` | `text:Notes / Evidence` | `type:text`
    >().describe(
      "Notes / Evidence [linkId=346437919917 | codes=[identification-authentication-device-identification-methods-notes]]",
    ).optional(),
    supportingDocumentation: z.enum(["Yes", "No"]).brand<
      `linkId:157280172274` | `text:Supporting Documentation` | `type:choice`
    >().describe(
      "Supporting Documentation [linkId=157280172274 | codes=[identification-authentication-identification-supporting-docs]]",
    ).optional(),
    additionalNotes: z.string().brand<
      `linkId:382279609009` | `text:Additional Notes` | `type:text`
    >().describe(
      "Additional Notes [linkId=382279609009 | codes=[identification-authentication-identification-additional-notes]]",
    ).optional(),
  }).brand<
    `linkId:228228158249` | `text:IA.L1-B.1.V - Identification` | `type:group`
  >().describe(
    "IA.L1-B.1.V - Identification [linkId=228228158249 | codes=[identification-authentication-identification-overview]]",
  ).optional(),
  iaL1B1ViAuthentication: z.object({
    whatIsTheCurrentStatusOfTheControlsThatVerifyThatUsersAndDevicesAreWhoTheySayTheyAreBeforeGivingThemAccess:
      z.enum([
        "Fully implemented – Every user has a unique login and password (no shared accounts), default passwords are replaced, and all devices are authenticated before access.",
        "Partially implemented – Most users and devices are verified, but some shared or default accounts/devices are still in use.",
        "Not Implemented",
        "Not applicable – No systems in scope store or process FCI.",
      ]).brand<
        | `linkId:676336695824`
        | `text:What is the current status of the controls that verify that users and devices are who they say they are before giving them access?`
        | `type:choice`
      >().describe(
        "What is the current status of the controls that verify that users and devices are who they say they are before giving them access? [linkId=676336695824 | codes=[identification-authentication-status-authentication-controls]]",
      ).optional(),
    whatMethodsDoYouUseToConfirmAUserSIdentityBeforeTheyCanLogIn: z.array(
      z.enum([
        "Username and password – The most common method; each employee has a unique login and password.",
        "Multi-factor authentication (MFA) – Requires two or more proofs, such as a password plus a code texted to your phone.",
        "Smart cards / PIV cards – Physical cards employees insert or tap to log in.",
        "Biometric authentication – Uses fingerprints, facial recognition, or other personal traits.",
        "Digital certificates – Software-based “ID cards” that prove a device or user is trusted.",
        "Single sign-on (SSO) – One secure login gives access to multiple company applications.",
      ]).brand<
        | `linkId:901079756471`
        | `text:What methods do you use to confirm a user’s identity before they can log in?`
        | `type:choice`
      >().describe(
        "What methods do you use to confirm a user’s identity before they can log in? [linkId=901079756471 | codes=[identification-authentication-user-authentication-methods]]",
      ),
    ).optional(),
    notesEvidence: z.string().brand<
      `linkId:115035657570` | `text:Notes / Evidence` | `type:text`
    >().describe(
      "Notes / Evidence [linkId=115035657570 | codes=[identification-authentication-user-authentication-methods-notes]]",
    ).optional(),
    passwordRequirements: z.object({
      minimumLengthCharacters: z.number().int().brand<
        | `linkId:444552965098`
        | `text:Minimum length (characters):`
        | `type:integer`
      >().describe(
        "Minimum length (characters): [linkId=444552965098 | codes=[identification-authentication-password-min-length]]",
      ).optional(),
      passwordExpirationDays: z.number().int().brand<
        | `linkId:499668919305`
        | `text:Password expiration (days):`
        | `type:integer`
      >().describe(
        "Password expiration (days): [linkId=499668919305 | codes=[identification-authentication-password-expiration-days]]",
      ).optional(),
      passwordHistoryPasswordsRemembered: z.number().int().brand<
        | `linkId:190124104069`
        | `text:Password history (passwords remembered):`
        | `type:integer`
      >().describe(
        "Password history (passwords remembered): [linkId=190124104069 | codes=[identification-authentication-password-history-count]]",
      ).optional(),
      clickAllThatApply: z.array(
        z.enum([
          "Uppercase letters required",
          "Lowercase letters required",
          "Numbers required",
          "Special characters required",
        ]).brand<
          `linkId:404025003688` | `text:Click all that apply:` | `type:choice`
        >().describe("Click all that apply: [linkId=404025003688]"),
      ).optional(),
      notesEvidence: z.string().brand<
        `linkId:149539043632` | `text:Notes / Evidence` | `type:text`
      >().describe(
        "Notes / Evidence [linkId=149539043632 | codes=[identification-authentication-password-requirements-notes]]",
      ).optional(),
    }).brand<
      `linkId:459655669415` | `text:Password Requirements` | `type:group`
    >().describe(
      "Password Requirements [linkId=459655669415 | codes=[identification-authentication-password-requirements]]",
    ).optional(),
    multiFactorAuthenticationMfaMeansUsingMoreThanOneProofOfIdentityBeforeSomeoneCanLogInForExampleAPasswordPlusACodeTextedToYourPhoneOrAPasswordPlusAFingerprintScanDoYouUseMfa:
      z.enum([
        "Yes, for all users and systems",
        "Yes, for privileged accounts only",
        "Yes, for remote access only",
        "Yes, for critical systems only",
        "No, not implemented",
      ]).brand<
        | `linkId:928879235030`
        | `text:Multi-factor authentication (MFA) means using more than one proof of identity before someone can log in. For example, a password plus a code texted to your phone, or a password plus a fingerprint scan. Do you use MFA?`
        | `type:choice`
      >().describe(
        "Multi-factor authentication (MFA) means using more than one proof of identity before someone can log in. For example, a password plus a code texted to your phone, or a password plus a fingerprint scan. Do you use MFA? [linkId=928879235030 | codes=[identification-authentication-mfa-usage]]",
      ).optional(),
    howDoYouHandleDefaultUsernamesAndPasswordsThatComeWithNewSystemsOrSoftware:
      z.enum([
        "Always changed before deployment – IT changes default logins before the system is ever used.",
        "Changed during initial configuration – Defaults are replaced when the system is set up, but not necessarily before deployment.",
        "Users required to change on first login – The system forces a password change the first time someone logs in.",
        "No formal process – Default credentials may remain in place, creating a serious security risk.",
      ]).brand<
        | `linkId:830887074055`
        | `text:How do you handle default usernames and passwords that come with new systems or software?`
        | `type:choice`
      >().describe(
        "How do you handle default usernames and passwords that come with new systems or software? [linkId=830887074055 | codes=[identification-authentication-default-credential-handling]]",
      ).optional(),
    authenticationFailureHandling: z.object({
      numberOfFailedAttemptsBeforeLockout: z.number().int().brand<
        | `linkId:647413778355`
        | `text:Number of failed attempts before lockout:`
        | `type:integer`
      >().describe(
        "Number of failed attempts before lockout: [linkId=647413778355 | codes=[identification-authentication-failed-attempts-lockout]]",
      ).optional(),
      accountLockoutDurationMinutes: z.number().int().brand<
        | `linkId:552155632772`
        | `text:Account lockout duration (minutes):`
        | `type:integer`
      >().describe(
        "Account lockout duration (minutes): [linkId=552155632772 | codes=[identification-authentication-account-lockout-duration]]",
      ).optional(),
      clickAllThatApply: z.array(
        z.enum([
          "Administrator notification sent",
          " Security team alerted",
          "Logged for review",
        ]).brand<
          `linkId:947716241721` | `text:Click all that apply:` | `type:choice`
        >().describe("Click all that apply: [linkId=947716241721]"),
      ).optional(),
      notesEvidence: z.string().brand<
        `linkId:434988961472` | `text:Notes / Evidence` | `type:text`
      >().describe(
        "Notes / Evidence [linkId=434988961472 | codes=[identification-authentication-authentication-failure-handling-notes]]",
      ).optional(),
    }).brand<
      | `linkId:341175611920`
      | `text:Authentication Failure Handling`
      | `type:group`
    >().describe(
      "Authentication Failure Handling [linkId=341175611920 | codes=[identification-authentication-authentication-failure-handling]]",
    ).optional(),
    supportingDocumentation: z.enum(["Yes", "No"]).brand<
      `linkId:230111377333` | `text:Supporting Documentation` | `type:choice`
    >().describe(
      "Supporting Documentation [linkId=230111377333 | codes=[identification-authentication-authentication-supporting-docs]]",
    ).optional(),
    additionalNotes: z.string().brand<
      `linkId:939036015644` | `text:Additional Notes` | `type:text`
    >().describe(
      "Additional Notes [linkId=939036015644 | codes=[identification-authentication-authentication-additional-notes]]",
    ).optional(),
  }).brand<
    `linkId:865372145224` | `text:IA.L1-B.1.VI - Authentication` | `type:group`
  >().describe(
    "IA.L1-B.1.VI - Authentication [linkId=865372145224 | codes=[identification-authentication-authentication-overview]]",
  ).optional(),
}).meta({
  "title": "Identification & Authentication",
  "tsType": "IdentificationAuthentication",
  "schemaConst": "identificationAuthenticationSchema",
});

export type IdentificationAuthentication = z.infer<
  typeof identificationAuthenticationSchema
>;

export const physicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilitiesSchema =
  z.object({
    doYouStoreProcessOrHandleFederalContractInformationFciOnPhysicalMediaOrInOnSiteLocations:
      z.string().brand<
        | `linkId:242760824142`
        | `text:Do you store, process, or handle Federal Contract Information (FCI) on physical media or in on-site locations?`
        | `type:string`
      >().describe(
        "Do you store, process, or handle Federal Contract Information (FCI) on physical media or in on-site locations? [linkId=242760824142 | codes=[physical-protection-store- process-handle-physical-protection]]",
      ).optional(),
    peL1B1ViiiPhysicalAccessAuthorization: z.object({
      _1AuthorizedPersonnelInventory: z.object({
        fullTimeEmployees: z.number().int().brand<
          `linkId:436045572485` | `text:Full-time employees:` | `type:integer`
        >().describe(
          "Full-time employees: [linkId=436045572485 | codes=[physical-protection-full-time-employees-authorized]]",
        ).optional(),
        contractors: z.number().int().brand<
          `linkId:857782926958` | `text:Contractors:` | `type:integer`
        >().describe(
          "Contractors: [linkId=857782926958 | codes=[physical-protection-contractors-authorized]]",
        ).optional(),
        partTimeEmployees: z.number().int().brand<
          `linkId:944400994758` | `text:Part-time employees:` | `type:integer`
        >().describe(
          "Part-time employees: [linkId=944400994758 | codes=[physical-protection-part-time-employees-authorized]]",
        ).optional(),
        visitorsWithEscort: z.number().int().brand<
          | `linkId:571574306369`
          | `text:Visitors (with escort):`
          | `type:integer`
        >().describe(
          "Visitors (with escort): [linkId=571574306369 | codes=[physical-protection-visitors-escorts-authorized]]",
        ).optional(),
      }).brand<
        | `linkId:296125947947`
        | `text:1. Authorized Personnel Inventory`
        | `type:group`
      >().describe(
        "1. Authorized Personnel Inventory [linkId=296125947947 | codes=[physical-protection-authorized-personal-inventory]]",
      ).optional(),
      _2PhysicalAccessAreas: z.object({
        whatAreasRequireControlledPhysicalAccess: z.array(
          z.string().brand<
            | `linkId:702794466613`
            | `text:What areas require controlled physical access?`
            | `type:string`
          >().describe(
            "What areas require controlled physical access? [linkId=702794466613 | codes=[physical-protection-areas-controlled-physical-access]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:279391143609` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=279391143609 | codes=[physical-protection-access-notes-evidence]]",
        ).optional(),
      }).brand<
        `linkId:209389086115` | `text:2. Physical Access Areas` | `type:group`
      >().describe(
        "2. Physical Access Areas [linkId=209389086115 | codes=[physical-protection-physical-access-areas]]",
      ).optional(),
      _3AuthorizationProcess: z.object({
        whoAuthorizesPhysicalAccessToControlledAreas: z.array(
          z.string().brand<
            | `linkId:784352573703`
            | `text:Who authorizes physical access to controlled areas?`
            | `type:string`
          >().describe(
            "Who authorizes physical access to controlled areas? [linkId=784352573703 | codes=[physical-protection-authorize-physical-access-control-areas]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:159961192967` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=159961192967 | codes=[physical-protection-authorization-notes-evidence]]",
        ).optional(),
      }).brand<
        `linkId:869992586185` | `text:3. Authorization Process` | `type:group`
      >().describe(
        "3. Authorization Process [linkId=869992586185 | codes=[physical-protection-physical-protection-authorization-process]]",
      ).optional(),
      _4AccessCredentials: z.object({
        whatTypesOfPhysicalAccessCredentialsAreIssued: z.array(
          z.string().brand<
            | `linkId:773851219827`
            | `text:What types of physical access credentials are issued?`
            | `type:string`
          >().describe(
            "What types of physical access credentials are issued? [linkId=773851219827 | codes=[physical-protection-type-access-credentials-issued]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:614664633852` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=614664633852 | codes=[physical-protection-credentials-notes-evidence]]",
        ).optional(),
      }).brand<
        `linkId:263666472314` | `text:4. Access Credentials` | `type:group`
      >().describe(
        "4. Access Credentials [linkId=263666472314 | codes=[physical-protection-access-credentials]]",
      ).optional(),
      _5TimeBasedAccessRestrictions: z.object({
        areThereTimeBasedRestrictionsOnPhysicalAccess: z.array(
          z.string().brand<
            | `linkId:208747627440`
            | `text:Are there time-based restrictions on physical access?`
            | `type:string`
          >().describe(
            "Are there time-based restrictions on physical access? [linkId=208747627440 | codes=[physical-protection-time-based-restrictions-physical-access]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:864878261078` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=864878261078 | codes=[physical-protection-time-based-access-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:409121643490`
        | `text:5. Time-Based Access Restrictions`
        | `type:group`
      >().describe(
        "5. Time-Based Access Restrictions [linkId=409121643490 | codes=[physical-protection-time-based-access-restrictions]]",
      ).optional(),
      implementationStatus: z.string().brand<
        `linkId:660777712272` | `text:Implementation Status` | `type:string`
      >().describe(
        "Implementation Status [linkId=660777712272 | codes=[physical-protection-implementation-status]]",
      ).optional(),
      notesEvidence: z.string().brand<
        `linkId:158505675327` | `text:Notes / Evidence` | `type:string`
      >().describe(
        "Notes / Evidence [linkId=158505675327 | codes=[physical-protection-time-based-notes-evidence]]",
      ).optional(),
    }).brand<
      | `linkId:624769621183`
      | `text:PE.L1-B.1.VIII - Physical Access Authorization`
      | `type:group`
    >().describe(
      "PE.L1-B.1.VIII - Physical Access Authorization [linkId=624769621183 | codes=[physical-protection-physical-access-authorization]]",
    ).optional(),
    peL1B1IxManageVisitorsPhysicalAccess: z.object({
      _1VisitorEscortPolicy: z.object({
        doesYourOrganizationRequireAllVisitorsToBeEscorted: z.string().brand<
          | `linkId:684131391577`
          | `text:Does your organization require all visitors to be escorted?`
          | `type:string`
        >().describe(
          "Does your organization require all visitors to be escorted? [linkId=684131391577 | codes=[physical-protection-require-visitors-escort]]",
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:372121837424` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=372121837424 | codes=[physical-protection-notes-visitor-escort-evidence]]",
        ).optional(),
      }).brand<
        `linkId:984680126159` | `text:1. Visitor Escort Policy` | `type:group`
      >().describe(
        "1. Visitor Escort Policy [linkId=984680126159 | codes=[physical-protection-visitor-escort]]",
      ).optional(),
      _2VisitorIdentification: z.object({
        howAreVisitorsIdentifiedAndDistinguishedFromEmployees: z.array(
          z.string().brand<
            | `linkId:400470675855`
            | `text:How are visitors identified and distinguished from employees?`
            | `type:string`
          >().describe(
            "How are visitors identified and distinguished from employees? [linkId=400470675855 | codes=[physical-protection-visitors-identify-distinguished]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:739299710732` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=739299710732 | codes=[physical-protection-visitor-identification-notes-evidence]]",
        ).optional(),
      }).brand<
        `linkId:896661213301` | `text:2. Visitor Identification` | `type:group`
      >().describe(
        "2. Visitor Identification [linkId=896661213301 | codes=[physical-protection-visitor-identification]]",
      ).optional(),
      _3VisitorActivityMonitoring: z.object({
        howIsVisitorActivityMonitoredWhileOnPremises: z.array(
          z.string().brand<
            | `linkId:829474009766`
            | `text:How is visitor activity monitored while on premises?`
            | `type:string`
          >().describe(
            "How is visitor activity monitored while on premises? [linkId=829474009766 | codes=[physical-protection-visitor-activity-monitored-premises]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:398473749950` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=398473749950 | codes=[physical-protection-visitor-activity-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:588293653185`
        | `text:3. Visitor Activity Monitoring`
        | `type:group`
      >().describe(
        "3. Visitor Activity Monitoring [linkId=588293653185 | codes=[physical-protection-visitor-activity-monitoring]]",
      ).optional(),
      _4EscortAuthorization: z.object({
        whoIsAuthorizedToEscortVisitors: z.string().brand<
          | `linkId:422650784362`
          | `text:Who is authorized to escort visitors?`
          | `type:string`
        >().describe(
          "Who is authorized to escort visitors? [linkId=422650784362 | codes=[physical-protection-authorize-escort-visitors]]",
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:766282850057` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=766282850057 | codes=[physical-protection-escort-authorization-notes-evidence]]",
        ).optional(),
      }).brand<
        `linkId:286167746672` | `text:4. Escort Authorization` | `type:group`
      >().describe(
        "4. Escort Authorization [linkId=286167746672 | codes=[physical-protection-escort-authorization]]",
      ).optional(),
      implementationStatus: z.string().brand<
        `linkId:231843690847` | `text:Implementation Status` | `type:string`
      >().describe(
        "Implementation Status [linkId=231843690847 | codes=[physical-protection-implementation-status]]",
      ).optional(),
      notesEvidence: z.string().brand<
        `linkId:972038317766` | `text:Notes / Evidence` | `type:string`
      >().describe(
        "Notes / Evidence [linkId=972038317766 | codes=[physical-protection-implementation-notes-evidence]]",
      ).optional(),
    }).brand<
      | `linkId:197390251867`
      | `text:PE.L1-B.1.IX – Manage Visitors & Physical Access`
      | `type:group`
    >().describe(
      "PE.L1-B.1.IX – Manage Visitors & Physical Access [linkId=197390251867 | codes=[physical-protection-manage-visitors-physical-access]]",
    ).optional(),
    peL1B1IxPhysicalAccessLogs: z.object({
      _1AccessLoggingMethods: z.object({
        howDoYouLogPhysicalAccessToYourFacilities: z.array(
          z.string().brand<
            | `linkId:734633292283`
            | `text: How do you log physical access to your facilities?`
            | `type:string`
          >().describe(
            " How do you log physical access to your facilities? [linkId=734633292283 | codes=[physical-protection-log-physical-access-facilities]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:325061856971` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=325061856971 | codes=[physical-protection-access-logging-notes-evidence]]",
        ).optional(),
      }).brand<
        `linkId:492440543443` | `text:1. Access Logging Methods` | `type:group`
      >().describe(
        "1. Access Logging Methods [linkId=492440543443 | codes=[physical-protection-access-logging-methods]]",
      ).optional(),
      _2InformationCapturedInLogs: z.object({
        whatInformationIsCapturedInYourPhysicalAccessLogsInformationCapturedInLogs:
          z.array(
            z.string().brand<
              | `linkId:174905707594`
              | `text: What information is captured in your physical access logs Information Captured in Logs?`
              | `type:string`
            >().describe(
              " What information is captured in your physical access logs Information Captured in Logs? [linkId=174905707594 | codes=[physical-protection-information-physical-access-logs]]",
            ),
          ).optional(),
        notesEvidence: z.string().brand<
          `linkId:750143252884` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=750143252884 | codes=[physical-protection-information-capture-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:349759491673`
        | `text:2. Information Captured in Logs`
        | `type:group`
      >().describe(
        "2. Information Captured in Logs [linkId=349759491673 | codes=[physical-protection-information-capture-logs]]",
      ).optional(),
      _3LogRetentionAndReview: z.object({
        howLongArePhysicalAccessLogsRetained: z.string().brand<
          | `linkId:245305278102`
          | `text:How long are physical access logs retained?`
          | `type:string`
        >().describe(
          "How long are physical access logs retained? [linkId=245305278102 | codes=[physical-protection-physical-access-logs-retained]]",
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:571727427731` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=571727427731 | codes=[physical-protection-log-retention-notes-evidence]]",
        ).optional(),
        howFrequentlyAreAccessLogsReviewed: z.string().brand<
          | `linkId:741567851452`
          | `text:How frequently are access logs reviewed?`
          | `type:string`
        >().describe(
          "How frequently are access logs reviewed? [linkId=741567851452 | codes=[physical-protection-frequent-access-log-reviewed]]",
        ).optional(),
        notesEvidence2: z.string().brand<
          `linkId:910408738855` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=910408738855 | codes=[physical-protection-frequency-logs-notes-evidence]]",
        ).optional(),
        whoReviewsThePhysicalAccessLogs: z.array(
          z.string().brand<
            | `linkId:745836226925`
            | `text:Who reviews the physical access logs?`
            | `type:string`
          >().describe(
            "Who reviews the physical access logs? [linkId=745836226925 | codes=[physical-protection-review-physical-access-logs]]",
          ),
        ).optional(),
        notesEvidence3: z.string().brand<
          `linkId:361446942388` | `text:Notes / Evidence ` | `type:string`
        >().describe(
          "Notes / Evidence  [linkId=361446942388 | codes=[physical-protection-review-access-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:831615420801`
        | `text:3. Log Retention and Review `
        | `type:group`
      >().describe(
        "3. Log Retention and Review  [linkId=831615420801 | codes=[physical-protection-log-retention-review]]",
      ).optional(),
      implementationStatus: z.string().brand<
        `linkId:320438032270` | `text:Implementation Status` | `type:string`
      >().describe(
        "Implementation Status [linkId=320438032270 | codes=[physical-protection-implementation-status]]",
      ).optional(),
      notesEvidence: z.string().brand<
        `linkId:724862600014` | `text:Notes / Evidence` | `type:string`
      >().describe(
        "Notes / Evidence [linkId=724862600014 | codes=[physical-protection-implementation-notes-evidence]]",
      ).optional(),
    }).brand<
      | `linkId:430398414481`
      | `text:PE.L1-B.1.IX –Physical Access Logs`
      | `type:group`
    >().describe(
      "PE.L1-B.1.IX –Physical Access Logs [linkId=430398414481 | codes=[physical-protection-physical-access-logs]]",
    ).optional(),
    peL1B1IxManagePhysicalAccessDevices: z.object({
      _1PhysicalAccessDeviceInventory: z.object({
        whatTypesOfPhysicalAccessDevicesDoesYourOrganizationUse: z.array(
          z.string().brand<
            | `linkId:903629274308`
            | `text:What types of physical access devices does your organization use?`
            | `type:string`
          >().describe(
            "What types of physical access devices does your organization use? [linkId=903629274308 | codes=[physical-protection-types-physical-access-devices]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:896964575016` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=896964575016 | codes=[physical-protection-device-inventory-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:621187042559`
        | `text:1. Physical Access Device Inventory `
        | `type:group`
      >().describe(
        "1. Physical Access Device Inventory  [linkId=621187042559 | codes=[physical-protection-physical-access-device-inventory]]",
      ).optional(),
      _2DeviceControlAndManagement: z.object({
        howArePhysicalAccessDevicesControlledAndManaged: z.array(
          z.string().brand<
            | `linkId:173451266066`
            | `text:How are physical access devices controlled and managed?`
            | `type:string`
          >().describe(
            "How are physical access devices controlled and managed? [linkId=173451266066 | codes=[physical-protection-physical-access-devices-controlled]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:164071724457` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=164071724457 | codes=[physical-protection-device-control-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:250263340197`
        | `text:2. Device Control and Management `
        | `type:group`
      >().describe(
        "2. Device Control and Management  [linkId=250263340197 | codes=[physical-protection-device-control-management]]",
      ).optional(),
      _3DeviceSecurityMeasures: z.object({
        whatSecurityMeasuresProtectPhysicalAccessDevices: z.array(
          z.string().brand<
            | `linkId:911514884520`
            | `text:What security measures protect physical access devices?`
            | `type:string`
          >().describe(
            "What security measures protect physical access devices? [linkId=911514884520 | codes=[physical-protection-measures-protect-physical-access-devices]]",
          ),
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:653480882123` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=653480882123 | codes=[physical-protection-device-security-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:703507215918`
        | `text:3. Device Security Measures `
        | `type:group`
      >().describe(
        "3. Device Security Measures  [linkId=703507215918 | codes=[physical-protection-device-security-measures]]",
      ).optional(),
      _4DeviceMaintenanceAndUpdates: z.object({
        howFrequentlyAreElectronicAccessSystemsUpdated: z.string().brand<
          | `linkId:466342459779`
          | `text:How frequently are electronic access systems updated?`
          | `type:string`
        >().describe(
          "How frequently are electronic access systems updated? [linkId=466342459779 | codes=[physical-protection-electronic-access-systems-updated]]",
        ).optional(),
        notesEvidence: z.string().brand<
          `linkId:951698714660` | `text:Notes / Evidence` | `type:string`
        >().describe(
          "Notes / Evidence [linkId=951698714660 | codes=[physical-protection-device-maintenance-notes-evidence]]",
        ).optional(),
      }).brand<
        | `linkId:130535369896`
        | `text:4. Device Maintenance and Updates`
        | `type:group`
      >().describe(
        "4. Device Maintenance and Updates [linkId=130535369896 | codes=[physical-protection-device-maintenance-updates]]",
      ).optional(),
      implementationStatus: z.string().brand<
        `linkId:294892506040` | `text:Implementation Status` | `type:string`
      >().describe(
        "Implementation Status [linkId=294892506040 | codes=[physical-protection-implementation-status]]",
      ).optional(),
      notesEvidence: z.string().brand<
        `linkId:140603351800` | `text:Notes / Evidence ` | `type:string`
      >().describe(
        "Notes / Evidence  [linkId=140603351800 | codes=[physical-protection-implementation-notes-evidence]]",
      ).optional(),
    }).brand<
      | `linkId:806534035552`
      | `text:PE.L1-B.1.IX –Manage Physical Access Devices`
      | `type:group`
    >().describe(
      "PE.L1-B.1.IX –Manage Physical Access Devices [linkId=806534035552 | codes=[physical-protection-manage-physical-access-devices]]",
    ).optional(),
  }).meta({
    "title":
      "Physical Protection (Limit physical access to information systems and facilities)",
    "tsType":
      "PhysicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilities",
    "schemaConst":
      "physicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilitiesSchema",
  });

export type PhysicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilities =
  z.infer<
    typeof physicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilitiesSchema
  >;
