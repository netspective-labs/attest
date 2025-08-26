import { z } from "npm:zod@4.1.1";

export const systemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunicationsSchema = z.object({
  scL13131MonitorAndControlSystemCommunications: z.object({
    implementationStatus: z.string().brand<`linkId:954433842901` | `text:Implementation Status ` | `type:string`>().describe("Implementation Status  [linkId=954433842901]"),
    doYouHaveANetworkDiagramShowingSystemBoundariesKeyComponentsAndDataFlows: z.string().brand<`linkId:979372224491` | `text:Do you have a network diagram showing system boundaries, key components, and data flows?` | `type:string`>().describe("Do you have a network diagram showing system boundaries, key components, and data flows? [linkId=979372224491]").optional(),
    _1SystemBoundaryDefinition: z.object({
      externalBoundaryComponents: z.string().brand<`linkId:591770672887` | `text:External Boundary Components` | `type:text`>().describe("External Boundary Components [linkId=591770672887]").optional(),
      keyInternalBoundaryComponents: z.string().brand<`linkId:930792706809` | `text:Key Internal Boundary Components` | `type:text`>().describe("Key Internal Boundary Components [linkId=930792706809]").optional(),
    }).brand<`linkId:861774438513` | `text:1. System Boundary Definition` | `type:group`>().describe("1. System Boundary Definition [linkId=861774438513]").optional(),
    _2FirewallConfiguration: z.object({
      firewallManufacturerModel: z.string().brand<`linkId:843201435494` | `text:Firewall Manufacturer/Model` | `type:text`>().describe("Firewall Manufacturer/Model [linkId=843201435494]").optional(),
      firewallSoftwareFirmwareVersion: z.string().brand<`linkId:706452201694` | `text:Firewall Software/Firmware Version` | `type:text`>().describe("Firewall Software/Firmware Version [linkId=706452201694]").optional(),
      defaultDenyPolicyIsImplementedTrafficIsDeniedByDefaultUnlessExplicitlyPermitted: z.enum(["Yes", "No"]).brand<`linkId:949755108024` | `text:Default deny policy is implemented (traffic is denied by default unless explicitly permitted)` | `type:choice`>().describe("Default deny policy is implemented (traffic is denied by default unless explicitly permitted) [linkId=949755108024]").optional(),
      explicitlyAllowedServicesProtocols: z.string().brand<`linkId:963088071424` | `text:Explicitly Allowed Services/Protocols` | `type:text`>().describe("Explicitly Allowed Services/Protocols [linkId=963088071424]").optional(),
      explicitlyDeniedServicesProtocols: z.string().brand<`linkId:122305830447` | `text:Explicitly Denied Services/Protocols` | `type:text`>().describe("Explicitly Denied Services/Protocols [linkId=122305830447]").optional(),
    }).brand<`linkId:835757897200` | `text:2. Firewall Configuration` | `type:group`>().describe("2. Firewall Configuration [linkId=835757897200]").optional(),
    _3MonitoringImplementation: z.object({
      howDoYouMonitorCommunicationsAtSystemBoundaries: z.array(z.enum(["Firewall logs and analysis", "Intrusion detection/prevention systems", "Network monitoring tools", "SIEM system integration", "Manual log review"]).brand<`linkId:847131102373` | `text:How do you monitor communications at system boundaries?` | `type:choice`>().describe("How do you monitor communications at system boundaries? [linkId=847131102373]")).optional(),
    }).brand<`linkId:434121826556` | `text:3. Monitoring Implementation` | `type:group`>().describe("3. Monitoring Implementation [linkId=434121826556]").optional(),
    supportingDocumentation: z.string().brand<`linkId:794317413983` | `text:Supporting Documentation` | `type:text`>().describe("Supporting Documentation [linkId=794317413983]").optional(),
    additionalNotes: z.string().brand<`linkId:782731881405` | `text:Additional Notes` | `type:text`>().describe("Additional Notes [linkId=782731881405]").optional(),
  }).brand<`linkId:617514452468` | `text:SC.L1-3.13.1 - Monitor and control system communications` | `type:group`>().describe("SC.L1-3.13.1 - Monitor and control system communications [linkId=617514452468]").optional(),
  scL13135ImplementSubnetworksForPubliclyAccessibleComponents: z.object({
    implementationStatus: z.string().brand<`linkId:274150359667` | `text:Implementation Status ` | `type:string`>().describe("Implementation Status  [linkId=274150359667]"),
    _1PubliclyAccessibleSystemComponents: z.object({
      whatPubliclyAccessibleSystemComponentsDoesYourOrganizationOperate: z.array(z.string().brand<`linkId:956471776047` | `text:What publicly accessible system components does your organization operate?` | `type:string`>().describe("What publicly accessible system components does your organization operate? [linkId=956471776047]")).optional(),
    }).brand<`linkId:194546217130` | `text:1. Publicly Accessible System Components` | `type:group`>().describe("1. Publicly Accessible System Components [linkId=194546217130]").optional(),
    _2NetworkSeparationImplementation: z.object({
      howArePubliclyAccessibleSystemsSeparatedFromInternalNetworks: z.array(z.string().brand<`linkId:517448335213` | `text:How are publicly accessible systems separated from internal networks?` | `type:string`>().describe("How are publicly accessible systems separated from internal networks? [linkId=517448335213]")).optional(),
    }).brand<`linkId:560463506575` | `text:2. Network Separation Implementation` | `type:group`>().describe("2. Network Separation Implementation [linkId=560463506575]").optional(),
    _3AccessControlBetweenNetworks: z.object({
      whatControlsPreventUnauthorizedAccessFromPublicNetworksToInternalNetworks: z.array(z.string().brand<`linkId:634425708590` | `text:What controls prevent unauthorized access from public networks to internal networks?` | `type:string`>().describe("What controls prevent unauthorized access from public networks to internal networks? [linkId=634425708590]")).optional(),
    }).brand<`linkId:126262667735` | `text:3. Access Control Between Networks` | `type:group`>().describe("3. Access Control Between Networks [linkId=126262667735]").optional(),
    _4DmzPublicNetworkMonitoring: z.object({
      howDoYouMonitorActivityInYourPublicFacingNetworkSegments: z.array(z.string().brand<`linkId:536378863536` | `text:How do you monitor activity in your public-facing network segments?` | `type:string`>().describe("How do you monitor activity in your public-facing network segments? [linkId=536378863536]")).optional(),
    }).brand<`linkId:414442892901` | `text:4. DMZ/Public Network Monitoring` | `type:group`>().describe("4. DMZ/Public Network Monitoring [linkId=414442892901]").optional(),
    supportingDocumentation: z.string().brand<`linkId:980001173858` | `text:Supporting Documentation` | `type:text`>().describe("Supporting Documentation [linkId=980001173858]").optional(),
    additionalNotes: z.string().brand<`linkId:597392284230` | `text:Additional Notes` | `type:text`>().describe("Additional Notes [linkId=597392284230]").optional(),
  }).brand<`linkId:587208645662` | `text:SC.L1-3.13.5 - Implement subnetworks for publicly accessible components` | `type:group`>().describe("SC.L1-3.13.5 - Implement subnetworks for publicly accessible components [linkId=587208645662]").optional(),
}).meta({"title":"System & Communications Protection (Monitor, control, and protect organizational communications)","tsType":"SystemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunications","schemaConst":"systemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunicationsSchema"});

export type SystemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunications = z.infer<typeof systemCommunicationsProtectionMonitorControlAndProtectOrganizationalCommunicationsSchema>;


export const mediaProtectionProtectInformationOnDigitalAndNonDigitalMediaSchema = z.object({
  doYouHaveAMediaDisposalPolicy: z.enum(["Yes", "No"]).brand<`linkId:957584520694` | `text:Do you have a Media Disposal Policy?` | `type:choice`>().describe("Do you have a Media Disposal Policy? [linkId=957584520694]").optional(),
  implementationStatus: z.enum(["Fully Implemented", "Partially Implemented", "Not Implemented"]).brand<`linkId:272642906092` | `text:Implementation Status` | `type:choice`>().describe("Implementation Status [linkId=272642906092]").optional(),
  policyElements: z.object({
    confirmThatYourMediaDisposalPolicyIncludesTheFollowingElementsClickAllThatApply: z.array(z.enum(["Types of media covered by policy (Policy defines all types of media that may contain FCI (hard drives, SSDs, USB drives, etc.))", "Identification methods for FCI-containing media (Procedures for identifying media that contains or may contain FCI)", "Sanitization methods by media type (Specific sanitization methods appropriate for each media type)", "Destruction methods by media type (Specific destruction methods appropriate for each media type)", "Verification requirements (Procedures to verify sanitization or destruction was successful)", "Documentation requirements (Required records of sanitization and destruction activities)", "Roles and responsibilities (Designation of who is responsible for each aspect of media disposal)", "Compliance with relevant standards (References to NIST SP 800-88 or other applicable standards)"]).brand<`linkId:698818405059` | `text:Confirm that your media disposal policy includes the following elements (click all that apply):` | `type:choice`>().describe("Confirm that your media disposal policy includes the following elements (click all that apply): [linkId=698818405059]")).optional(),
  }).brand<`linkId:393852162334` | `text:Policy Elements` | `type:group`>().describe("Policy Elements [linkId=393852162334]").optional(),
}).meta({"title":"Media Protection (Protect information on digital and non-digital media)","tsType":"MediaProtectionProtectInformationOnDigitalAndNonDigitalMedia","schemaConst":"mediaProtectionProtectInformationOnDigitalAndNonDigitalMediaSchema"});

export type MediaProtectionProtectInformationOnDigitalAndNonDigitalMedia = z.infer<typeof mediaProtectionProtectInformationOnDigitalAndNonDigitalMediaSchema>;


export const systemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlawsSchema = z.object({
  flawIdentificationProcess: z.object({
    howDoesYourOrganizationIdentifySystemFlawsAndVulnerabilities: z.array(z.enum(["Automated vulnerability scanning", "Vendor security notifications and bulletins", "Penetration testing", "Regular security assessments", "Threat intelligence feeds", "Incident response and forensics"]).brand<`linkId:758011605310` | `text:How does your organization identify system flaws and vulnerabilities?` | `type:choice`>().describe("How does your organization identify system flaws and vulnerabilities? [linkId=758011605310]")).optional(),
  }).brand<`linkId:544004255685` | `text:Flaw Identification Process` | `type:group`>().describe("Flaw Identification Process [linkId=544004255685]").optional(),
  flawReportingAndTracking: z.object({
    howAreIdentifiedFlawsReportedAndTracked: z.array(z.enum(["Formal tracking system or database", "Automatic management notification", "Risk assessment and prioritization", "Communication to affected stakeholders", "Detailed documentation of findings"]).brand<`linkId:854540559647` | `text:How are identified flaws reported and tracked?` | `type:choice`>().describe("How are identified flaws reported and tracked? [linkId=854540559647]")).optional(),
  }).brand<`linkId:603452357063` | `text:Flaw Reporting and Tracking` | `type:group`>().describe("Flaw Reporting and Tracking [linkId=603452357063]").optional(),
  flawCorrectionTimeline: z.object({
    whatAreYourTargetTimeframesForCorrectingIdentifiedFlaws: z.object({
      criticalSeverityFlaws: z.enum(["Immediate (within hours)", "Within 24 hours", "Within 72 hours", "Within 1 week"]).brand<`linkId:885354230428` | `text:Critical Severity Flaws:` | `type:choice`>().describe("Critical Severity Flaws: [linkId=885354230428]").optional(),
      highSeverityFlaws: z.enum(["Within 1 week", "Within 2 weeks", "Within 1 month"]).brand<`linkId:149460684671` | `text:High Severity Flaws:` | `type:choice`>().describe("High Severity Flaws: [linkId=149460684671]").optional(),
      mediumLowSeverityFlaws: z.enum(["Within 1 month", "Within 1 quarter", "Next scheduled maintenance window"]).brand<`linkId:119144494365` | `text:Medium/Low Severity Flaws:` | `type:choice`>().describe("Medium/Low Severity Flaws: [linkId=119144494365]").optional(),
    }).brand<`linkId:802989461197` | `text:What are your target timeframes for correcting identified flaws?` | `type:group`>().describe("What are your target timeframes for correcting identified flaws? [linkId=802989461197]").optional(),
  }).brand<`linkId:702845194175` | `text:Flaw Correction Timeline` | `type:group`>().describe("Flaw Correction Timeline [linkId=702845194175]").optional(),
  patchManagementProcess: z.object({
    howAreSecurityPatchesAndUpdatesManaged: z.enum(["Testing in non-production environment before deployment", "Formal change control process", "Rollback procedures in case of issues", "Automated patch deployment capabilities", "Emergency patching procedures for critical flaws", "Documentation of all patches applied"]).brand<`linkId:896010001522` | `text:How are security patches and updates managed?` | `type:choice`>().describe("How are security patches and updates managed? [linkId=896010001522]").optional(),
  }).brand<`linkId:535096646220` | `text:Patch Management Process` | `type:group`>().describe("Patch Management Process [linkId=535096646220]").optional(),
  additionalNotesOrComments: z.string().brand<`linkId:731360730463` | `text:Additional Notes or Comments` | `type:text`>().describe("Additional Notes or Comments [linkId=731360730463]").optional(),
  supportingDocumentation: z.string().brand<`linkId:231346071278` | `text:Supporting Documentation` | `type:text`>().describe("Supporting Documentation [linkId=231346071278]").optional(),
  siL13142MaliciousCodeProtection: z.object({
    doYouHaveAMaliciousCodeProtectionPolicyDocument: z.enum(["Yes", "No"]).brand<`linkId:892692932760` | `text:Do you have a malicious code protection policy document?` | `type:choice`>().describe("Do you have a malicious code protection policy document? [linkId=892692932760]").optional(),
  }).brand<`linkId:340771388729` | `text:SI.L1-3.14.2 - Malicious Code Protection` | `type:group`>().describe("SI.L1-3.14.2 - Malicious Code Protection [linkId=340771388729]").optional(),
  protectionLocations: z.object({
    selectAllLocationsWhereMaliciousCodeProtectionIsImplemented: z.array(z.enum(["Email Gateway", "Web Proxy/Gateway", "Perimeter Firewall", "VPN Gateway", "Endpoints (Workstations, Laptops)", "Servers", "Mobile Devices"]).brand<`linkId:457010911238` | `text:Select all locations where malicious code protection is implemented:` | `type:choice`>().describe("Select all locations where malicious code protection is implemented: [linkId=457010911238]")).optional(),
  }).brand<`linkId:120577885697` | `text:Protection Locations` | `type:group`>().describe("Protection Locations [linkId=120577885697]").optional(),
  implementationDetails: z.object({
    primaryAntiMalwareProductSolutionEGMicrosoftDefenderMcAfeeSymantec: z.string().brand<`linkId:149423997720` | `text:Primary Anti-Malware Product/Solution: e.g., Microsoft Defender, McAfee, Symantec` | `type:string`>().describe("Primary Anti-Malware Product/Solution: e.g., Microsoft Defender, McAfee, Symantec [linkId=149423997720]").optional(),
    antiMalwareVersionReleaseVersionNumberOrReleaseIdentifier: z.string().brand<`linkId:343942743605` | `text:Anti-Malware Version/Release: Version number or release identifier` | `type:string`>().describe("Anti-Malware Version/Release: Version number or release identifier [linkId=343942743605]").optional(),
    implementationScopeDescribeTheScopeOfYourAntiMalwareImplementationEGAllCompanyEndpointsSpecificServers: z.string().brand<`linkId:581419297519` | `text:Implementation Scope: Describe the scope of your anti-malware implementation (e.g., all company endpoints, specific servers)` | `type:text`>().describe("Implementation Scope: Describe the scope of your anti-malware implementation (e.g., all company endpoints, specific servers) [linkId=581419297519]").optional(),
    realTimeProtectionEnabled: z.enum(["Yes", "No"]).brand<`linkId:394557514652` | `text:Real-Time Protection Enabled:` | `type:choice`>().describe("Real-Time Protection Enabled: [linkId=394557514652]").optional(),
    centrallyManaged: z.enum(["Yes", "No"]).brand<`linkId:137330973781` | `text:Centrally Managed:` | `type:choice`>().describe("Centrally Managed: [linkId=137330973781]").optional(),
  }).brand<`linkId:123297792461` | `text:Implementation Details` | `type:group`>().describe("Implementation Details [linkId=123297792461]").optional(),
  additionalNotesOrComments2: z.string().brand<`linkId:750023247979` | `text:Additional Notes or Comments` | `type:text`>().describe("Additional Notes or Comments [linkId=750023247979]").optional(),
  supportingDocumentation2: z.string().brand<`linkId:278751204941` | `text:Supporting Documentation` | `type:text`>().describe("Supporting Documentation [linkId=278751204941]").optional(),
  updateFrequency: z.object({
    howFrequentlyAreMaliciousCodeProtectionMechanismsUpdated: z.enum(["Real-time updates (as available)", "Hourly", "Daily", "Weekly", "Manual updates only"]).brand<`linkId:830996907328` | `text:How frequently are malicious code protection mechanisms updated?` | `type:choice`>().describe("How frequently are malicious code protection mechanisms updated? [linkId=830996907328]").optional(),
  }).brand<`linkId:370529733824` | `text:Update Frequency` | `type:group`>().describe("Update Frequency [linkId=370529733824]").optional(),
  updateManagementProcess: z.object({
    howAreMaliciousCodeProtectionUpdatesManaged: z.array(z.enum(["Automatic updates enabled", "Centralized update management system", "Verification of successful updates", "Rollback capability for problematic updates", "Testing of updates before deployment", "Notification of update status and failures"]).brand<`linkId:733457774453` | `text:How are malicious code protection updates managed?` | `type:choice`>().describe("How are malicious code protection updates managed? [linkId=733457774453]")).optional(),
  }).brand<`linkId:400782620614` | `text:Update Management Process` | `type:group`>().describe("Update Management Process [linkId=400782620614]").optional(),
  additionalNotesOrComments3: z.string().brand<`linkId:660268414578` | `text:Additional Notes or Comments` | `type:text`>().describe("Additional Notes or Comments [linkId=660268414578]").optional(),
  supportingDocumentation3: z.string().brand<`linkId:717091491475` | `text:Supporting Documentation` | `type:text`>().describe("Supporting Documentation [linkId=717091491475]").optional(),
  doYouHaveASystemScanningPolicyDocumentationFileScanningPolicyAndScanningProcedureDocumentation: z.enum(["Yes", "No"]).brand<`linkId:470606272303` | `text:Do you have a system scanning policy documentation, file scanning policy, and scanning procedure documentation?` | `type:choice`>().describe("Do you have a system scanning policy documentation, file scanning policy, and scanning procedure documentation? [linkId=470606272303]").optional(),
  antiMalwareImplementation: z.object({
    doesYourOrganizationHaveAntivirusAntiMalwareSoftwareInstalledOnAllSystems: z.enum(["Yes", "No", "Partially (some systems only)"]).brand<`linkId:189466095401` | `text:Does your organization have antivirus/anti-malware software installed on all systems?` | `type:choice`>().describe("Does your organization have antivirus/anti-malware software installed on all systems? [linkId=189466095401]").optional(),
    whatAntivirusAntiMalwareSolutionIsCurrentlyDeployedEGMicrosoftDefenderNortonMcAfeeEtc: z.string().brand<`linkId:694425083943` | `text:What antivirus/anti-malware solution is currently deployed? e.g., Microsoft Defender, Norton, McAfee, etc.` | `type:string`>().describe("What antivirus/anti-malware solution is currently deployed? e.g., Microsoft Defender, Norton, McAfee, etc. [linkId=694425083943]").optional(),
  }).brand<`linkId:359679551926` | `text:Anti-Malware Implementation` | `type:group`>().describe("Anti-Malware Implementation [linkId=359679551926]").optional(),
  periodicScanningImplementation: z.object({
    howFrequentlyAreFullSystemScansConducted: z.enum(["Daily", "Weekily", "Bi-weekly", "Monthly", "Quarterly", "Custom Schedule"]).brand<`linkId:508929065591` | `text:How frequently are full system scans conducted?` | `type:choice`>().describe("How frequently are full system scans conducted? [linkId=508929065591]").optional(),
    whatLevelOfThoroughnessIsUsedForPeriodicScans: z.enum(["Quick Scan (critical files only)", "Standard Scan (system files and common user directories)", "Full Scan (entire file system)", "Custom Scan (specific directories)"]).brand<`linkId:889472415570` | `text:What level of thoroughness is used for periodic scans?` | `type:choice`>().describe("What level of thoroughness is used for periodic scans? [linkId=889472415570]").optional(),
  }).brand<`linkId:558460360931` | `text:Periodic Scanning Implementation` | `type:group`>().describe("Periodic Scanning Implementation [linkId=558460360931]").optional(),
  realTimeScanningFileIntegrity: z.object({
    areFilesFromExternalSourcesScannedInRealTime: z.enum(["Yes", "No", "Partially (some sources only)"]).brand<`linkId:740865411316` | `text:Are files from external sources scanned in real-time?` | `type:choice`>().describe("Are files from external sources scanned in real-time? [linkId=740865411316]").optional(),
  }).brand<`linkId:527252274149` | `text:Real-time Scanning & File Integrity` | `type:group`>().describe("Real-time Scanning & File Integrity [linkId=527252274149]").optional(),
  whichExternalSourcesAreScanned: z.array(z.enum(["Internet Downloads", "Email Attachments", "Removable Media", "Cloud Storage", "Network Shares", "Other External Sources"]).brand<`linkId:146442608630` | `text:Which external sources are scanned?` | `type:choice`>().describe("Which external sources are scanned? [linkId=146442608630]")).optional(),
  doYouEmployFileIntegrityMonitoringForCriticalSystemFiles: z.enum(["Yes", "No", "Planned"]).brand<`linkId:842602142275` | `text:Do you employ file integrity monitoring for critical system files?` | `type:choice`>().describe("Do you employ file integrity monitoring for critical system files? [linkId=842602142275]").optional(),
  resultsHandlingTesting: z.object({
    howAreScanResultsReviewedAndDocumentedDescribeYourProcessForReviewingAndDocumentingScanResults: z.string().brand<`linkId:707425868010` | `text:How are scan results reviewed and documented? Describe your process for reviewing and documenting scan results...` | `type:text`>().describe("How are scan results reviewed and documented? Describe your process for reviewing and documenting scan results... [linkId=707425868010]").optional(),
    whatIsYourResponseTimeframeWhenMalwareOrVulnerabilitiesAreDetected: z.enum(["Immediate (within hours)", "Within 24 hours", "Within 48 hours", "Within a week", "Other (specify in notes)"]).brand<`linkId:986030389075` | `text:What is your response timeframe when malware or vulnerabilities are detected?` | `type:choice`>().describe("What is your response timeframe when malware or vulnerabilities are detected? [linkId=986030389075]").optional(),
    describeYourRemediationProcessForIdentifiedIssuesDescribeYourProcessForRemediatingIssuesDetectedDuringScanning: z.string().brand<`linkId:164191875680` | `text:Describe your remediation process for identified issues: Describe your process for remediating issues detected during scanning...` | `type:text`>().describe("Describe your remediation process for identified issues: Describe your process for remediating issues detected during scanning... [linkId=164191875680]").optional(),
    hasScanningEffectivenessBeenTested: z.enum(["Yes", "No"]).brand<`linkId:967054991522` | `text:Has scanning effectiveness been tested?` | `type:choice`>().describe("Has scanning effectiveness been tested? [linkId=967054991522]").optional(),
  }).brand<`linkId:123247885877` | `text:Results Handling & Testing` | `type:group`>().describe("Results Handling & Testing [linkId=123247885877]").optional(),
  hasScanningEffectivenessBeenTested: z.string().brand<`linkId:892462719670` | `text:Has scanning effectiveness been tested?` | `type:text`>().describe("Has scanning effectiveness been tested? [linkId=892462719670]").optional(),
  supportingDocumentation4: z.string().brand<`linkId:901609884580` | `text:Supporting Documentation` | `type:text`>().describe("Supporting Documentation [linkId=901609884580]").optional(),
}).meta({"title":"System & Information Integrity (Identify, report, and correct information system flaws)","tsType":"SystemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlaws","schemaConst":"systemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlawsSchema"});

export type SystemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlaws = z.infer<typeof systemInformationIntegrityIdentifyReportAndCorrectInformationSystemFlawsSchema>;


export const identificationAuthenticationVerifyIdentitiesOfUsersAndProcessesSchema = z.object({
  implementationStatus: z.enum(["Fully Implemented", "Partially Implemented", "Not Implemented"]).brand<`linkId:362061549890` | `text:Implementation Status` | `type:choice`>().describe("Implementation Status [linkId=362061549890]").optional(),
  userIdentificationStandards: z.enum(["First name + last name (john.smith)", "First initial + last name (jsmith)", "Employee ID numbers (EMP001234)", "Department codes + names (IT-jsmith)"]).brand<`linkId:139461602895` | `text:User Identification Standards` | `type:choice`>().describe("User Identification Standards [linkId=139461602895]").optional(),
  serviceAccountManagement: z.object({
    numberOfServiceAccounts: z.number().int().brand<`linkId:179545641231` | `text:Number of service accounts:` | `type:integer`>().describe("Number of service accounts: [linkId=179545641231]").optional(),
    checkAllThatApply: z.array(z.enum(["Database services", "Web applications", "Backup processes", "Monitoring/logging services", "Security scanning tools"]).brand<`linkId:753553198622` | `text:Check all that apply:` | `type:choice`>().describe("Check all that apply: [linkId=753553198622]")).optional(),
    doYouHaveADeviceInventorySpreadsheet: z.enum(["Yes", "No"]).brand<`linkId:926744954268` | `text:Do you have a device inventory spreadsheet?` | `type:choice`>().describe("Do you have a device inventory spreadsheet? [linkId=926744954268]").optional(),
  }).brand<`linkId:446911811643` | `text:Service Account Management` | `type:group`>().describe("Service Account Management [linkId=446911811643]").optional(),
  deviceIdentification: z.array(z.enum(["MAC addresses", "IP addresses (static)", "Computer/device names", "Asset tag numbers", "Serial numbers", "Certificates/digital signatures"]).brand<`linkId:359160217347` | `text:Device Identification` | `type:choice`>().describe("Device Identification [linkId=359160217347]")).optional(),
  deviceInventory: z.object({
    workstationsLaptops: z.number().int().brand<`linkId:878410531769` | `text:Workstations/laptops:` | `type:integer`>().describe("Workstations/laptops: [linkId=878410531769]").optional(),
    servers: z.number().int().brand<`linkId:361034048943` | `text:Servers:` | `type:integer`>().describe("Servers: [linkId=361034048943]").optional(),
    mobileDevices: z.number().int().brand<`linkId:424090205463` | `text:Mobile devices:` | `type:integer`>().describe("Mobile devices: [linkId=424090205463]").optional(),
    networkDevices: z.number().int().brand<`linkId:764441913827` | `text:Network devices:` | `type:integer`>().describe("Network devices: [linkId=764441913827]").optional(),
  }).brand<`linkId:543189099428` | `text:Device Inventory` | `type:group`>().describe("Device Inventory [linkId=543189099428]").optional(),
  identityVerificationProcess: z.array(z.enum(["HR verification with employee records", "Manager approval with written authorization", "Background check completion", "Photo identification verification"]).brand<`linkId:297397401977` | `text:Identity Verification Process` | `type:choice`>().describe("Identity Verification Process [linkId=297397401977]")).optional(),
  supportingDocumentation: z.enum(["Yes", "No"]).brand<`linkId:210356958517` | `text:Supporting Documentation` | `type:choice`>().describe("Supporting Documentation [linkId=210356958517]").optional(),
  additionalNotes: z.string().brand<`linkId:268793244463` | `text:Additional Notes` | `type:text`>().describe("Additional Notes [linkId=268793244463]").optional(),
  implementationStatus2: z.enum(["Fully Implemented", "Partially Implemented", "Not Implemented"]).brand<`linkId:676336695824` | `text:Implementation Status` | `type:choice`>().describe("Implementation Status [linkId=676336695824]").optional(),
  userAuthenticationMethods: z.array(z.enum(["Username and password", "Multi-factor authentication (MFA)", "Smart cards/PIV cards", "Biometric authentication", "Digital certificates", "Single sign-on (SSO)"]).brand<`linkId:901079756471` | `text:User Authentication Methods` | `type:choice`>().describe("User Authentication Methods [linkId=901079756471]")).optional(),
  passwordRequirements: z.object({
    minimumLengthCharacters: z.number().int().brand<`linkId:444552965098` | `text:Minimum length (characters):` | `type:integer`>().describe("Minimum length (characters): [linkId=444552965098]").optional(),
    passwordExpirationDays: z.number().int().brand<`linkId:499668919305` | `text:Password expiration (days):` | `type:integer`>().describe("Password expiration (days): [linkId=499668919305]").optional(),
    passwordHistoryPasswordsRemembered: z.number().int().brand<`linkId:190124104069` | `text:Password history (passwords remembered):` | `type:integer`>().describe("Password history (passwords remembered): [linkId=190124104069]").optional(),
    clickAllThatApply: z.array(z.enum(["Uppercase letters required", "Lowercase letters required", "Numbers required", "Special characters required"]).brand<`linkId:404025003688` | `text:Click all that apply:` | `type:choice`>().describe("Click all that apply: [linkId=404025003688]")).optional(),
  }).brand<`linkId:459655669415` | `text:Password Requirements` | `type:group`>().describe("Password Requirements [linkId=459655669415]").optional(),
  multiFactorAuthentication: z.enum(["Yes, for all users and systems", "Yes, for privileged accounts only", "Yes, for remote access only", "Yes, for critical systems only", "No, not implemented"]).brand<`linkId:928879235030` | `text:Multi-Factor Authentication` | `type:choice`>().describe("Multi-Factor Authentication [linkId=928879235030]").optional(),
  defaultCredentialManagement: z.enum(["Always changed before deployment", "Changed during initial configuration", "Users required to change on first login", "No formal process"]).brand<`linkId:830887074055` | `text:Default Credential Management` | `type:choice`>().describe("Default Credential Management [linkId=830887074055]").optional(),
  authenticationFailureHandling: z.object({
    numberOfFailedAttemptsBeforeLockout: z.number().int().brand<`linkId:647413778355` | `text:Number of failed attempts before lockout:` | `type:integer`>().describe("Number of failed attempts before lockout: [linkId=647413778355]").optional(),
    accountLockoutDurationMinutes: z.number().int().brand<`linkId:552155632772` | `text:Account lockout duration (minutes):` | `type:integer`>().describe("Account lockout duration (minutes): [linkId=552155632772]").optional(),
    clickAllThatApply: z.array(z.enum(["Administrator notification sent", "Security team alerted", "Logged for review"]).brand<`linkId:947716241721` | `text:Click all that apply:` | `type:choice`>().describe("Click all that apply: [linkId=947716241721]")).optional(),
  }).brand<`linkId:341175611920` | `text:Authentication Failure Handling` | `type:group`>().describe("Authentication Failure Handling [linkId=341175611920]").optional(),
  supportingDocumentation2: z.enum(["Yes", "No"]).brand<`linkId:230111377333` | `text:Supporting Documentation` | `type:choice`>().describe("Supporting Documentation [linkId=230111377333]").optional(),
  additionalNotes2: z.string().brand<`linkId:939036015644` | `text:Additional Notes` | `type:text`>().describe("Additional Notes [linkId=939036015644]").optional(),
}).meta({"title":"Identification & Authentication (Verify identities of users and processes)","tsType":"IdentificationAuthenticationVerifyIdentitiesOfUsersAndProcesses","schemaConst":"identificationAuthenticationVerifyIdentitiesOfUsersAndProcessesSchema"});

export type IdentificationAuthenticationVerifyIdentitiesOfUsersAndProcesses = z.infer<typeof identificationAuthenticationVerifyIdentitiesOfUsersAndProcessesSchema>;


export const companyInformationSchema = z.object({
  organizationName: z.string().brand<`linkId:715544477968` | `text:Organization Name` | `type:string`>().describe("Organization Name [linkId=715544477968]"),
  formCompletedBy: z.string().brand<`linkId:655141523763` | `text:Form Completed By` | `type:string`>().describe("Form Completed By [linkId=655141523763]"),
  positionTitle: z.string().brand<`linkId:761144039651` | `text:Position/Title` | `type:string`>().describe("Position/Title [linkId=761144039651]").optional(),
  emailAddress: z.string().brand<`linkId:441278853405` | `text:Email Address` | `type:string`>().describe("Email Address [linkId=441278853405]"),
  workPhone: z.string().brand<`linkId:375736159279` | `text:Work Phone` | `type:string`>().describe("Work Phone [linkId=375736159279]"),
  mobilePhone: z.string().brand<`linkId:948589414714` | `text:Mobile Phone` | `type:string`>().describe("Mobile Phone [linkId=948589414714]"),
  assessmentDate: z.string().brand<`linkId:276403539223` | `text:Assessment Date` | `type:date`>().describe("Assessment Date [linkId=276403539223]").optional(),
  industry: z.string().brand<`linkId:789286873476` | `text:Industry` | `type:string`>().describe("Industry [linkId=789286873476]").optional(),
  employeeCount: z.string().brand<`linkId:697235963218` | `text:Employee Count` | `type:string`>().describe("Employee Count [linkId=697235963218]").optional(),
  contractTypes: z.string().brand<`linkId:863463230823` | `text:Contract Types` | `type:text`>().describe("Contract Types [linkId=863463230823]").optional(),
  organizationIdentifiers: z.object({
    cageCode: z.string().brand<`linkId:805221373063` | `text:CAGE Code` | `type:string`>().describe("CAGE Code [linkId=805221373063]").optional(),
    dunsNumber: z.string().brand<`linkId:374784155003` | `text:DUNS Number` | `type:string`>().describe("DUNS Number [linkId=374784155003]").optional(),
  }).brand<`linkId:127163950314` | `text:Organization Identifiers` | `type:group`>().describe("Organization Identifiers [linkId=127163950314]").optional(),
}).meta({"title":"Company Information","tsType":"CompanyInformation","schemaConst":"companyInformationSchema"});

export type CompanyInformation = z.infer<typeof companyInformationSchema>;


export const physicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilitiesSchema = z.object({
  peL13101PhysicalAccessAuthorization: z.object({
    _1AuthorizedPersonnelInventory: z.object({
      fullTimeEmployees: z.number().int().brand<`linkId:436045572485` | `text:Full-time employees:` | `type:integer`>().describe("Full-time employees: [linkId=436045572485]").optional(),
      contractors: z.number().int().brand<`linkId:857782926958` | `text:Contractors:` | `type:integer`>().describe("Contractors: [linkId=857782926958]").optional(),
      partTimeEmployees: z.number().int().brand<`linkId:944400994758` | `text:Part-time employees:` | `type:integer`>().describe("Part-time employees: [linkId=944400994758]").optional(),
      visitorsWithEscort: z.number().int().brand<`linkId:571574306369` | `text:Visitors (with escort):` | `type:integer`>().describe("Visitors (with escort): [linkId=571574306369]").optional(),
    }).brand<`linkId:296125947947` | `text:1. Authorized Personnel Inventory` | `type:group`>().describe("1. Authorized Personnel Inventory [linkId=296125947947]").optional(),
    _2PhysicalAccessAreas: z.object({
      whatAreasRequireControlledPhysicalAccess: z.array(z.string().brand<`linkId:702794466613` | `text:What areas require controlled physical access?` | `type:string`>().describe("What areas require controlled physical access? [linkId=702794466613]")).optional(),
    }).brand<`linkId:209389086115` | `text:2. Physical Access Areas` | `type:group`>().describe("2. Physical Access Areas [linkId=209389086115]").optional(),
    _3AuthorizationProcess: z.object({
      whoAuthorizesPhysicalAccessToControlledAreas: z.array(z.string().brand<`linkId:784352573703` | `text:Who authorizes physical access to controlled areas?` | `type:string`>().describe("Who authorizes physical access to controlled areas? [linkId=784352573703]")).optional(),
    }).brand<`linkId:869992586185` | `text:3. Authorization Process` | `type:group`>().describe("3. Authorization Process [linkId=869992586185]").optional(),
    _4AccessCredentials: z.object({
      whatTypesOfPhysicalAccessCredentialsAreIssued: z.array(z.string().brand<`linkId:773851219827` | `text:What types of physical access credentials are issued?` | `type:string`>().describe("What types of physical access credentials are issued? [linkId=773851219827]")).optional(),
    }).brand<`linkId:263666472314` | `text:4. Access Credentials` | `type:group`>().describe("4. Access Credentials [linkId=263666472314]").optional(),
    _5TimeBasedAccessRestrictions: z.object({
      areThereTimeBasedRestrictionsOnPhysicalAccess: z.array(z.string().brand<`linkId:208747627440` | `text:Are there time-based restrictions on physical access?` | `type:string`>().describe("Are there time-based restrictions on physical access? [linkId=208747627440]")).optional(),
    }).brand<`linkId:409121643490` | `text:5. Time-Based Access Restrictions` | `type:group`>().describe("5. Time-Based Access Restrictions [linkId=409121643490]").optional(),
    implementationStatus: z.string().brand<`linkId:660777712272` | `text:Implementation Status` | `type:string`>().describe("Implementation Status [linkId=660777712272]").optional(),
  }).brand<`linkId:624769621183` | `text:PE.L1-3.10.1 - Physical Access Authorization` | `type:group`>().describe("PE.L1-3.10.1 - Physical Access Authorization [linkId=624769621183]").optional(),
  peL13103EscortVisitors: z.object({
    _1VisitorEscortPolicy: z.object({
      doesYourOrganizationRequireAllVisitorsToBeEscorted: z.array(z.string().brand<`linkId:684131391577` | `text:Does your organization require all visitors to be escorted?` | `type:string`>().describe("Does your organization require all visitors to be escorted? [linkId=684131391577]")).optional(),
    }).brand<`linkId:984680126159` | `text:1. Visitor Escort Policy` | `type:group`>().describe("1. Visitor Escort Policy [linkId=984680126159]").optional(),
    _2VisitorIdentification: z.object({
      howAreVisitorsIdentifiedAndDistinguishedFromEmployees: z.array(z.string().brand<`linkId:400470675855` | `text:How are visitors identified and distinguished from employees?` | `type:string`>().describe("How are visitors identified and distinguished from employees? [linkId=400470675855]")).optional(),
    }).brand<`linkId:896661213301` | `text:2. Visitor Identification` | `type:group`>().describe("2. Visitor Identification [linkId=896661213301]").optional(),
    _3VisitorActivityMonitoring: z.object({
      howIsVisitorActivityMonitoredWhileOnPremises: z.array(z.string().brand<`linkId:829474009766` | `text:How is visitor activity monitored while on premises?` | `type:string`>().describe("How is visitor activity monitored while on premises? [linkId=829474009766]")).optional(),
    }).brand<`linkId:588293653185` | `text:3. Visitor Activity Monitoring` | `type:group`>().describe("3. Visitor Activity Monitoring [linkId=588293653185]").optional(),
    _4EscortAuthorization: z.object({
      whoIsAuthorizedToEscortVisitors: z.array(z.string().brand<`linkId:422650784362` | `text:Who is authorized to escort visitors?` | `type:string`>().describe("Who is authorized to escort visitors? [linkId=422650784362]")).optional(),
    }).brand<`linkId:286167746672` | `text:4. Escort Authorization` | `type:group`>().describe("4. Escort Authorization [linkId=286167746672]").optional(),
    implementationStatus: z.string().brand<`linkId:231843690847` | `text:Implementation Status` | `type:string`>().describe("Implementation Status [linkId=231843690847]").optional(),
  }).brand<`linkId:197390251867` | `text:PE.L1-3.10.3 - Escort Visitors` | `type:group`>().describe("PE.L1-3.10.3 - Escort Visitors [linkId=197390251867]").optional(),
  peL13104PhysicalAccessLogs: z.object({
    _1AccessLoggingMethods: z.object({
      howDoYouLogPhysicalAccessToYourFacilities: z.array(z.string().brand<`linkId:734633292283` | `text:How do you log physical access to your facilities?` | `type:string`>().describe("How do you log physical access to your facilities? [linkId=734633292283]")).optional(),
    }).brand<`linkId:492440543443` | `text:1. Access Logging Methods` | `type:group`>().describe("1. Access Logging Methods [linkId=492440543443]").optional(),
    _2InformationCapturedInLogs: z.object({
      whatInformationIsCapturedInYourPhysicalAccessLogsInformationCapturedInLogs: z.array(z.string().brand<`linkId:174905707594` | `text:What information is captured in your physical access logs Information Captured in Logs?` | `type:string`>().describe("What information is captured in your physical access logs Information Captured in Logs? [linkId=174905707594]")).optional(),
    }).brand<`linkId:349759491673` | `text:2. Information Captured in Logs` | `type:group`>().describe("2. Information Captured in Logs [linkId=349759491673]").optional(),
    _3LogRetentionAndReview: z.object({
      howLongArePhysicalAccessLogsRetained: z.string().brand<`linkId:245305278102` | `text:How long are physical access logs retained?` | `type:string`>().describe("How long are physical access logs retained? [linkId=245305278102]").optional(),
      howFrequentlyAreAccessLogsReviewed: z.string().brand<`linkId:741567851452` | `text:How frequently are access logs reviewed?` | `type:string`>().describe("How frequently are access logs reviewed? [linkId=741567851452]").optional(),
      whoReviewsThePhysicalAccessLogs: z.array(z.string().brand<`linkId:745836226925` | `text:Who reviews the physical access logs?` | `type:string`>().describe("Who reviews the physical access logs? [linkId=745836226925]")).optional(),
    }).brand<`linkId:831615420801` | `text:3. Log Retention and Review ` | `type:group`>().describe("3. Log Retention and Review  [linkId=831615420801]").optional(),
    implementationStatus: z.string().brand<`linkId:320438032270` | `text:Implementation Status` | `type:string`>().describe("Implementation Status [linkId=320438032270]").optional(),
  }).brand<`linkId:430398414481` | `text:PE.L1-3.10.4 - Physical Access Logs` | `type:group`>().describe("PE.L1-3.10.4 - Physical Access Logs [linkId=430398414481]").optional(),
  peL13105ManagePhysicalAccessDevices: z.object({
    _1PhysicalAccessDeviceInventory: z.object({
      whatTypesOfPhysicalAccessDevicesDoesYourOrganizationUse: z.array(z.string().brand<`linkId:903629274308` | `text:What types of physical access devices does your organization use?` | `type:string`>().describe("What types of physical access devices does your organization use? [linkId=903629274308]")).optional(),
    }).brand<`linkId:621187042559` | `text:1. Physical Access Device Inventory ` | `type:group`>().describe("1. Physical Access Device Inventory  [linkId=621187042559]").optional(),
    _2DeviceControlAndManagement: z.object({
      howArePhysicalAccessDevicesControlledAndManaged: z.array(z.string().brand<`linkId:173451266066` | `text:How are physical access devices controlled and managed?` | `type:string`>().describe("How are physical access devices controlled and managed? [linkId=173451266066]")).optional(),
    }).brand<`linkId:250263340197` | `text:2. Device Control and Management ` | `type:group`>().describe("2. Device Control and Management  [linkId=250263340197]").optional(),
    _3DeviceSecurityMeasures: z.object({
      whatSecurityMeasuresProtectPhysicalAccessDevices: z.array(z.string().brand<`linkId:911514884520` | `text:What security measures protect physical access devices?` | `type:string`>().describe("What security measures protect physical access devices? [linkId=911514884520]")).optional(),
    }).brand<`linkId:703507215918` | `text:3. Device Security Measures ` | `type:group`>().describe("3. Device Security Measures  [linkId=703507215918]").optional(),
    _4DeviceMaintenanceAndUpdates: z.object({
      howFrequentlyAreElectronicAccessSystemsUpdated: z.string().brand<`linkId:466342459779` | `text:How frequently are electronic access systems updated?` | `type:string`>().describe("How frequently are electronic access systems updated? [linkId=466342459779]").optional(),
    }).brand<`linkId:130535369896` | `text:4. Device Maintenance and Updates` | `type:group`>().describe("4. Device Maintenance and Updates [linkId=130535369896]").optional(),
    implementationStatus: z.string().brand<`linkId:294892506040` | `text:Implementation Status` | `type:string`>().describe("Implementation Status [linkId=294892506040]").optional(),
  }).brand<`linkId:806534035552` | `text:PE.L1-3.10.5 - Manage Physical Access Devices` | `type:group`>().describe("PE.L1-3.10.5 - Manage Physical Access Devices [linkId=806534035552]").optional(),
}).meta({"title":"Physical Protection (Limit physical access to information systems and facilities)","tsType":"PhysicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilities","schemaConst":"physicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilitiesSchema"});

export type PhysicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilities = z.infer<typeof physicalProtectionLimitPhysicalAccessToInformationSystemsAndFacilitiesSchema>;


export const accessControlLimitInformationSystemAccessToAuthorizedUsersAndProcessesSchema = z.object({
  doYouHaveAnAccessControlPolicy: z.enum(["Yes", "No - if no, would you like help creating one for your company?"]).brand<`linkId:744146359806` | `text:Do you have an Access Control Policy?` | `type:choice`>().describe("Do you have an Access Control Policy? [linkId=744146359806]").optional(),
  implementationStatus: z.enum(["Fully Implemented", "Partially Implemented", "Not Implemented"]).brand<`linkId:184584712182` | `text:Implementation Status` | `type:choice`>().describe("Implementation Status [linkId=184584712182]").optional(),
  accessControlPolicyElements: z.object({
    doesYourOrganizationHaveADocumentedAccessControlPolicyThatAddresses: z.array(z.enum(["Purpose, scope, roles, and responsibilities", "Management commitment", "Coordination among organizational entities", "Compliance requirements"]).brand<`linkId:669545773690` | `text:Does your organization have a documented access control policy that addresses:` | `type:choice`>().describe("Does your organization have a documented access control policy that addresses: [linkId=669545773690]")).optional(),
  }).brand<`linkId:480722725067` | `text:Access Control Policy Elements` | `type:group`>().describe("Access Control Policy Elements [linkId=480722725067]").optional(),
  userAccountRegistry: z.object({
    activeUserAccounts: z.number().int().brand<`linkId:927965645729` | `text:Active user accounts:` | `type:integer`>().describe("Active user accounts: [linkId=927965645729]").optional(),
    inactiveDisabledUserAccounts: z.number().int().brand<`linkId:903940962912` | `text:Inactive/disabled user accounts:` | `type:integer`>().describe("Inactive/disabled user accounts: [linkId=903940962912]").optional(),
    serviceAccounts: z.number().int().brand<`linkId:338820008158` | `text:Service accounts:` | `type:integer`>().describe("Service accounts: [linkId=338820008158]").optional(),
    sharedAccounts: z.number().int().brand<`linkId:673437974050` | `text:Shared accounts:` | `type:integer`>().describe("Shared accounts: [linkId=673437974050]").optional(),
  }).brand<`linkId:217670863053` | `text:User Account Registry` | `type:group`>().describe("User Account Registry [linkId=217670863053]").optional(),
  principleOfLeastPrivilegeImplementation: z.object({
    howIsThePrincipleOfLeastPrivilegeImplemented: z.enum(["Fully implemented across all systems", "Partially implemented", "Not implemented"]).brand<`linkId:368418823104` | `text:How is the principle of least privilege implemented?` | `type:choice`>().describe("How is the principle of least privilege implemented? [linkId=368418823104]").optional(),
  }).brand<`linkId:159744780603` | `text:Principle of Least Privilege Implementation` | `type:group`>().describe("Principle of Least Privilege Implementation [linkId=159744780603]").optional(),
  accountManagementProcesses: z.object({
    howAreAccountLifecycleProcessesManaged: z.array(z.enum(["Automated identity management system", "Manual process with approval workflow", "Integration with HR systems", "Regular account reviews and recertification"]).brand<`linkId:341135397442` | `text:How are account lifecycle processes managed?` | `type:choice`>().describe("How are account lifecycle processes managed? [linkId=341135397442]")).optional(),
  }).brand<`linkId:589953648417` | `text:Account Management Processes` | `type:group`>().describe("Account Management Processes [linkId=589953648417]").optional(),
  accountReviewFrequency: z.object({
    howFrequentlyAreUserAccountsReviewedForValidityAndAppropriateAccess: z.enum(["Monthly", "Quarterly", "Annually", "Other (specify):"]).brand<`linkId:563546854643` | `text:How frequently are user accounts reviewed for validity and appropriate access?` | `type:choice`>().describe("How frequently are user accounts reviewed for validity and appropriate access? [linkId=563546854643]").optional(),
  }).brand<`linkId:789082578732` | `text:Account Review Frequency` | `type:group`>().describe("Account Review Frequency [linkId=789082578732]").optional(),
  implementationStatus2: z.enum(["Fully Implemented", "Partially Implemented", "Not Implemented"]).brand<`linkId:316234331937` | `text:Implementation Status` | `type:choice`>().describe("Implementation Status [linkId=316234331937]").optional(),
  transactionControlImplementation: z.object({
    howDoYouLimitUserAccessToSpecificTransactionsAndFunctions: z.array(z.enum(["Role-based access control (RBAC)", "Function-based permissions (create, read, update, delete)", "Application-level access controls", "Time-based access restrictions", "Location-based access restrictions"]).brand<`linkId:589002798804` | `text:How do you limit user access to specific transactions and functions?` | `type:choice`>().describe("How do you limit user access to specific transactions and functions? [linkId=589002798804]")).optional(),
  }).brand<`linkId:899089109837` | `text:Transaction Control Implementation` | `type:group`>().describe("Transaction Control Implementation [linkId=899089109837]").optional(),
  functionRestrictionsByRole: z.object({
    whatTypesOfFunctionsAreRestrictedBasedOnUserRoles: z.array(z.enum(["Administrative functions (user management, system configuration)", "Financial transactions and approvals", "Data export and bulk download functions", "Report generation and access", "System-level commands and utilities"]).brand<`linkId:525896610609` | `text:What types of functions are restricted based on user roles?` | `type:choice`>().describe("What types of functions are restricted based on user roles? [linkId=525896610609]")).optional(),
  }).brand<`linkId:561249826496` | `text:Function Restrictions by Role` | `type:group`>().describe("Function Restrictions by Role [linkId=561249826496]").optional(),
  transactionAuthorizationRequirements: z.object({
    howAreHighRiskTransactionsAuthorized: z.array(z.enum(["Manager approval required", "Two-person authorization", "Automated business rules and limits", "No special authorization required"]).brand<`linkId:859148329958` | `text:How are high-risk transactions authorized?` | `type:choice`>().describe("How are high-risk transactions authorized? [linkId=859148329958]")).optional(),
  }).brand<`linkId:338456195634` | `text:Transaction Authorization Requirements` | `type:group`>().describe("Transaction Authorization Requirements [linkId=338456195634]").optional(),
  implementationStatus3: z.enum(["Fully Implemented", "Partially Implemented", "Not Implemented"]).brand<`linkId:358071855489` | `text:Implementation Status` | `type:choice`>().describe("Implementation Status [linkId=358071855489]").optional(),
  externalSystemConnections: z.object({
    whatTypesOfExternalSystemsDoesYourOrganizationConnectTo: z.array(z.enum(["Cloud services (email, file storage, applications)", "Business partner networks", "Vendor/supplier systems", "Government systems and portals", "Personal devices (BYOD)", "Remote access system", "No external connections"]).brand<`linkId:261758300502` | `text:What types of external systems does your organization connect to?` | `type:choice`>().describe("What types of external systems does your organization connect to? [linkId=261758300502]")).optional(),
  }).brand<`linkId:118413869969` | `text:External System Connections` | `type:group`>().describe("External System Connections [linkId=118413869969]").optional(),
  connectionVerificationMethods: z.object({
    howDoYouVerifyExternalSystemConnections: z.array(z.enum(["Digital certificates and PKI", "VPN connections with authentication", "Firewall rules and IP restrictions", "Signed interconnection agreements", "Continuous monitoring and logging"]).brand<`linkId:495111707033` | `text:How do you verify external system connections?` | `type:choice`>().describe("How do you verify external system connections? [linkId=495111707033]")).optional(),
  }).brand<`linkId:397995568740` | `text:Connection Verification Methods` | `type:group`>().describe("Connection Verification Methods [linkId=397995568740]").optional(),
  connectionControlLimitations: z.object({
    whatLimitationsArePlacedOnExternalConnections: z.array(z.enum(["Time-based access restrictions", "Restrictions on data types that can be shared", "Limited to specific user groups", "Management approval required for each connection", "Comprehensive audit trails and logging"]).brand<`linkId:597499672942` | `text:What limitations are placed on external connections?` | `type:choice`>().describe("What limitations are placed on external connections? [linkId=597499672942]")).optional(),
  }).brand<`linkId:354025378477` | `text:Connection Control Limitations` | `type:group`>().describe("Connection Control Limitations [linkId=354025378477]").optional(),
  implementationStatus4: z.enum(["Fully Implemented", "Partially Implemented", "Not Implemented"]).brand<`linkId:260717222110` | `text:Implementation Status` | `type:choice`>().describe("Implementation Status [linkId=260717222110]").optional(),
  publiclyAccessibleSystems: z.object({
    whatPubliclyAccessibleSystemsDoesYourOrganizationOperate: z.array(z.enum(["Company website", "Social media accounts", "Customer portals or self-service systems", "Corporate blog or news site", "Public forums or discussion boards", "No publicly accessible systems"]).brand<`linkId:660159010455` | `text:What publicly accessible systems does your organization operate?` | `type:choice`>().describe("What publicly accessible systems does your organization operate? [linkId=660159010455]")).optional(),
  }).brand<`linkId:501427838641` | `text:Publicly Accessible Systems` | `type:group`>().describe("Publicly Accessible Systems [linkId=501427838641]").optional(),
  contentReviewProcess: z.object({
    howDoYouEnsureFciIsNotPostedOnPublicSystems: z.array(z.enum(["Pre-publication review and approval process", "Designated reviewers trained to identify FCI", "Automated content scanning for sensitive information", "Periodic audits of published content", "Procedures for rapid removal of inappropriate content"]).brand<`linkId:229261839700` | `text:How do you ensure FCI is not posted on public systems?` | `type:choice`>().describe("How do you ensure FCI is not posted on public systems? [linkId=229261839700]")).optional(),
  }).brand<`linkId:786703783052` | `text:Content Review Process` | `type:group`>().describe("Content Review Process [linkId=786703783052]").optional(),
  authorizedPublishingPersonnel: z.object({
    numberOfAuthorizedPersonnel: z.number().int().brand<`linkId:374839487767` | `text:Number of authorized personnel:` | `type:integer`>().describe("Number of authorized personnel: [linkId=374839487767]").optional(),
    chooseAllThatApply: z.array(z.enum(["Marketing department", "Communications/PR team", "Executive leadership", "IT administrators"]).brand<`linkId:177243885107` | `text:Choose all that apply:` | `type:choice`>().describe("Choose all that apply: [linkId=177243885107]")).optional(),
  }).brand<`linkId:815496752107` | `text:Authorized Publishing Personnel` | `type:group`>().describe("Authorized Publishing Personnel [linkId=815496752107]").optional(),
}).meta({"title":"Access Control (Limit information system access to authorized users and processes)","tsType":"AccessControlLimitInformationSystemAccessToAuthorizedUsersAndProcesses","schemaConst":"accessControlLimitInformationSystemAccessToAuthorizedUsersAndProcessesSchema"});

export type AccessControlLimitInformationSystemAccessToAuthorizedUsersAndProcesses = z.infer<typeof accessControlLimitInformationSystemAccessToAuthorizedUsersAndProcessesSchema>;


export const policyFrameworkAssessmentPolicyImplementationAllCmmcLevel1PracticesSchema = z.object({
  policyDevelopmentAndApproval: z.object({
    whoIsResponsibleForDevelopingAndApprovingCmmcRelatedPolicies: z.array(z.enum(["Chief Information Officer", "Chief Information Security Officer", "Chief Executive Officer", "Legal/Compliance Department", "IT Security Team"]).brand<`linkId:527949557496` | `text:Who is responsible for developing and approving CMMC-related policies?` | `type:choice`>().describe("Who is responsible for developing and approving CMMC-related policies? [linkId=527949557496]")).optional(),
  }).brand<`linkId:590810573907` | `text:Policy Development and Approval` | `type:group`>().describe("Policy Development and Approval [linkId=590810573907]").optional(),
  policyReviewAndUpdateProcedures: z.object({
    howFrequentlyAreCmmcRelatedPoliciesReviewedAndUpdated: z.array(z.enum(["Quarterly", "Bi-annually", "Annually", "When regulations change", "No formal schedule"]).brand<`linkId:992068463537` | `text:How frequently are CMMC-related policies reviewed and updated?` | `type:choice`>().describe("How frequently are CMMC-related policies reviewed and updated? [linkId=992068463537]")).optional(),
  }).brand<`linkId:441079114846` | `text:Policy Review and Update Procedures` | `type:group`>().describe("Policy Review and Update Procedures [linkId=441079114846]").optional(),
  employeeTrainingOnPolicies: z.object({
    whatTrainingIsProvidedToEmployeesOnCmmcRelatedPolicies: z.array(z.enum(["Initial security awareness training", "Role-specific policy training", "Annual refresher training", "just-in-time training for policy changes", "No formal training program"]).brand<`linkId:472951321809` | `text:What training is provided to employees on CMMC-related policies?` | `type:choice`>().describe("What training is provided to employees on CMMC-related policies? [linkId=472951321809]")).optional(),
  }).brand<`linkId:401642968533` | `text:Employee Training on Policies` | `type:group`>().describe("Employee Training on Policies [linkId=401642968533]").optional(),
  policyComplianceMonitoring: z.object({
    howIsComplianceWithCmmcRelatedPoliciesMonitored: z.array(z.enum(["Regular internal audits", "Automated compliance monitoring", "Self-assessment questionnaires", "Manager reviews and attestations", "Third-party assessments"]).brand<`linkId:758349008850` | `text:How is compliance with CMMC-related policies monitored?` | `type:choice`>().describe("How is compliance with CMMC-related policies monitored? [linkId=758349008850]")).optional(),
  }).brand<`linkId:237023742748` | `text:Policy Compliance Monitoring` | `type:group`>().describe("Policy Compliance Monitoring [linkId=237023742748]").optional(),
  policyExceptionManagement: z.object({
    howAreExceptionsToCmmcRelatedPoliciesManaged: z.array(z.enum(["Formal exception request process", "Risk assessment for exceptions", "Compensating controls for exceptions", "Regular review of approved exceptions", "No formal exception process"]).brand<`linkId:255836550808` | `text:How are exceptions to CMMC-related policies managed?` | `type:choice`>().describe("How are exceptions to CMMC-related policies managed? [linkId=255836550808]")).optional(),
  }).brand<`linkId:260429244098` | `text:Policy Exception Management` | `type:group`>().describe("Policy Exception Management [linkId=260429244098]").optional(),
  additionalNotes: z.string().brand<`linkId:795388091631` | `text:Additional Notes` | `type:text`>().describe("Additional Notes [linkId=795388091631]").optional(),
}).meta({"title":"Policy Framework Assessment (Policy Implementation - All CMMC Level 1 Practices)","tsType":"PolicyFrameworkAssessmentPolicyImplementationAllCmmcLevel1Practices","schemaConst":"policyFrameworkAssessmentPolicyImplementationAllCmmcLevel1PracticesSchema"});

export type PolicyFrameworkAssessmentPolicyImplementationAllCmmcLevel1Practices = z.infer<typeof policyFrameworkAssessmentPolicyImplementationAllCmmcLevel1PracticesSchema>;
