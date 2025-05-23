
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Play, 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Settings,
  Eye,
  EyeOff,
  Globe,
  User,
  Smartphone,
  AlertTriangle,
  Zap
} from 'lucide-react';

// Microsoft first-party applications from entra-caps.py
const FIRST_PARTY_APPS = {
    "AAD App Management":"f0ae4899-d877-4d3c-ae25-679e38eea492",
    "AAD Request Verification Service - PROD":"c728155f-7b2a-4502-a08b-b8af9b269319",
    "AADReporting":"1b912ec3-a9dd-4c4d-a53e-76aa7adb28d7",
    "aciapi":"c5b17a4f-cc6f-4649-9480-684280a2af3a",
    "Azure AD Application Proxy":"47ee738b-3f1a-4fc7-ab11-37e4822b007e",
    "Azure AD Identity Governance - Entitlement Management":"810dcf14-1858-4bf2-8134-4c369fa3235b",
    "Azure AD Identity Protection":"fc68d9e5-1f76-45ef-99aa-214805418498",
    "Azure AD Notification":"fc03f97a-9db0-4627-a216-ec98ce54e018",
    "Azure Advisor":"c39c9bac-9d1f-4dfb-aa29-27f6365e5cb7",
    "Azure Cloud Shell":"2233b157-f44d-4812-b777-036cdaf9a96e",
    "Azure Credential Configuration Endpoint Service":"ea890292-c8c8-4433-b5ea-b09d0668e1a6",
    "Azure ESTS Service":"00000001-0000-0000-c000-000000000000",
    "Azure Information Protection":"5b20c633-9a48-4a5f-95f6-dae91879051f",
    "Azure Management Groups":"f2c304cf-8e7e-4c3f-8164-16299ad9d272",
    "Azure MFA StrongAuthenticationService":"b5a60e17-278b-4c92-a4e2-b9262e66bb28",
    "Azure Multi-Factor Auth Client":"981f26a1-7f43-403b-a875-f8b09b8cd720",
    "Azure Multi-Factor Auth Connector":"1f5530b3-261a-47a9-b357-ded261e17918",
    "Azure Portal":"c44b4083-3bb0-49c1-b47d-974e53cbdf3c",
    "Azure RBAC Data Plane":"5861f7fb-5582-4c1a-83c0-fc5ffdb531a6",
    "Azure Resource Graph":"509e4652-da8d-478d-a730-e9d4a1996ca4",
    "Azure Resource Manager":"797f4846-ba00-4fd7-ba43-dac1f8f63013",
    "AzureSupportCenter":"37182072-3c9c-4f6a-a4b3-b3f91cacffce",
    "Billing RP":"80dbdb39-4f33-4799-8b6f-711b5e3e61b6",
    "Bing":"9ea1ad79-fdb6-4f9a-8bc3-2b70f96e34c7",
    "CABProvisioning":"5da7367f-09c8-493e-8fd4-638089cddec3",
    "Cloud Infrastructure Entitlement Management":"b46c3ac5-9da6-418f-a849-0a07a10b3c6c",
    "ComplianceAuthServer":"9e5d84af-8971-422f-968a-354cd675ae5b",
    "CompliancePolicy":"644c1b11-f63f-45fa-826b-a9d2801db711",
    "Configuration Manager Microservice":"557c67cf-c916-4293-8373-d584996f60ae",
    "Connectors":"48af08dc-f6d2-435f-b2a7-069abd99c086",
    "Cortana at Work Service":"2a486b53-dbd2-49c0-a2bc-278bdfc30833",
    "Cortana Runtime Service":"81473081-50b9-469a-b9d8-303109583ecb",
    "CPIM Service":"bb2a2e3a-c5e7-4f0a-88e0-8e01fd3fc1f4",
    "Defender for Storage Advanced Threat Protection Resource Provider":"080765e3-9336-4461-b934-310acccb907d",
    "DeploymentScheduler":"8bbf8725-b3ca-4468-a217-7c8da873186e",
    "Device Registration Service":"01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9",
    "fj-breakglass":"5a11c236-81d8-4eb7-ae17-13e98027285b",
    "Graph Connector Service":"56c1da01-2129-48f7-9355-af6d59d42766",
    "Graph Explorer":"de8bc8b5-d9f9-48b1-a8ad-b748da725064",
    "IAM Supportability":"a57aca87-cbc0-4f3c-8b9e-dc095fdc8978",
    "IAMTenantCrawler":"66244124-575c-4284-92bc-fdd00e669cea",
    "Intune CMDeviceService":"14452459-6fa6-4ec0-bc50-1528a1a06bf0",
    "Intune Compliance Client Prod":"a882f5bd-2492-44fe-bb55-a811aab59451",
    "Intune DeviceDirectory ConfidentialClient":"7e313d81-57dd-4bdd-906e-337963583de3",
    "Intune Grouping and Targeting Client Prod":"fd14a986-6fe4-409a-883e-cdec1009cd54",
    "Intune Provisioning Client":"f1346770-5b25-470b-88bd-d5744ab7952c",
    "IpLicensingService":"189cf920-d3d8-4133-9145-23adcc6824fa",
    "IPSubstrate":"4c8f074c-e32b-4ba7-b072-0f39d71daf51",
    "Lifecycle Workflows":"ce79fdc4-cd1d-4ea5-8139-e74d7dbe0bb7",
    "LLMTesting":"fb4d2b00-6152-4e4b-bbd7-8b39551a5558",
    "M365 Admin Services":"6b91db1b-f05b-405a-a0b2-e3f60b28d645",
    "M365 License Manager":"aeb86249-8ea3-49e2-900b-54cc8e308f85",
    "Marketplace Api":"f738ef14-47dc-4564-b53b-45069484ccc7",
    "Marketplace SaaS v2":"5b712e99-51a3-41ce-86ff-046e0081c5c0",
    "MarketplaceAPI ISV":"20e940b3-4c77-4b0b-9a53-9e16a1b010a7",
    "MCAPI Authorization Prod":"d73f4b35-55c9-48c7-8b10-651f6f2acb2e",
    "MDC Data Sensitivity":"bd6d9218-235b-4abd-b3be-9ff157dcf36c",
    "Microsoft 365 Security and Compliance Center":"80ccca67-54bd-44ab-8625-4b79c4dc7775",
    "Microsoft App Access Panel":"0000000c-0000-0000-c000-000000000000",
    "Microsoft Approval Management":"65d91a3d-ab74-42e6-8a2f-0add61688c74",
    "Microsoft Azure AD Identity Protection":"a3dfc3c6-2c7d-4f42-aeec-b2877f9bce97",
    "Microsoft Azure App Service":"abfa0a7c-a6b6-4736-8310-5855508787cd",
    "Microsoft Azure Policy Insights":"1d78a85d-813d-46f0-b496-dd72f50a3ec0",
    "Microsoft Azure Signup Portal":"8e0e8db5-b713-4e91-98e6-470fed0aa4c2",
    "Microsoft Cloud App Security":"05a65629-4c1b-48c1-a78b-804c4abdd4af",
    "Microsoft Commerce Accounts Service":"bf9fc203-c1ff-4fd4-878b-323642e462ec",
    "Microsoft Defender for APIs Resource Provider":"56823b05-67d8-413a-b6ab-ad19d7710cf2",
    "Microsoft Defender for Cloud Apps - Customer Experience":"ac6dbf5e-1087-4434-beb2-0ebf7bd1b883",
    "Microsoft Defender For Cloud Billing":"e3a3c6d7-bd80-4be5-88da-c2226a5d9328",
    "Microsoft Defender for Cloud CIEM":"a70c8393-7c0c-4c1e-916a-811bd476ee11",
    "Microsoft Defender for Cloud Defender Kubernetes Agent":"6e2cffc9-52e7-4bfa-8155-be5c1dacd81c",
    "Microsoft Defender For Cloud Discovery":"ee45196f-bd15-4010-9a66-c8497a97a873",
    "Microsoft Defender for Cloud for AI":"1efb1569-5fd6-4938-8b8d-9f3aa07c658d",
    "Microsoft Defender for Cloud MultiCloud Onboarding":"81172f0f-5d81-47c7-96f6-49c58b60d192",
    "Microsoft Defender for Cloud Pricing Resource Provider":"cbff9545-769a-4b41-b76e-fbb069e8727e",
    "Microsoft Defender for Cloud Scanner Resource Provider":"e0ccf59d-5a20-4a87-a122-f42842cdb86a",
    "Microsoft Defender for Cloud Servers Scanner Resource Provider":"0c7668b5-3260-4ad0-9f53-34ed54fa19b2",
    "Microsoft Defender For Cloud":"6b5b3617-ba00-46f6-8770-1849282a189a",
    "Microsoft Device Management Checkin":"ca0a114d-6fbc-46b3-90fa-2ec954794ddb",
    "Microsoft Device Management EMM API":"8ae6a0b1-a07f-4ec9-927a-afb8d39da81c",
    "Microsoft Exchange Online Protection":"00000007-0000-0ff1-ce00-000000000000",
    "Microsoft Graph Change Tracking":"0bf30f3b-4a52-48df-9a82-234910c4a086",
    "Microsoft Graph Command Line Tools":"14d82eec-204b-4c2f-b7e8-296a70dab67e",
    "Microsoft Graph Connectors Core":"f8f7a2aa-e116-4ba6-8aea-ca162cfa310d",
    "Microsoft Graph":"00000003-0000-0000-c000-000000000000",
    "Microsoft Information Protection API":"40775b29-2688-46b6-a3b5-b256bd04df9f",
    "Microsoft Information Protection Sync Service":"870c4f2e-85b6-4d43-bdda-6ed9a579b725",
    "Microsoft Intune Advanced Threat Protection Integration":"794ded15-70c6-4bcd-a0bb-9b7ad530a01a",
    "Microsoft Intune API":"c161e42e-d4df-4a3d-9b42-e7a3c31f59d4",
    "Microsoft Intune SCCM Connector":"63e61dc2-f593-4a6f-92b9-92e4d2c03d4f",
    "Microsoft Intune Service Discovery":"9cb77803-d937-493e-9a3b-4b49de3f5a74",
    "Microsoft Intune Web Company Portal":"74bcdadc-2fdc-4bb3-8459-76d06952a0e9",
    "Microsoft Intune":"0000000a-0000-0000-c000-000000000000",
    "Microsoft Mobile Application Management":"0a5f63c0-b750-4f38-a71c-4fc0d58b89e2",
    "Microsoft Modern Contact Master":"224a7b82-46c9-4d6b-8db0-7360fb444681",
    "Microsoft Office 365 Portal":"00000006-0000-0ff1-ce00-000000000000",
    "Microsoft password reset service":"93625bc8-bfe2-437a-97e0-3d0060024faa",
    "Microsoft People Cards Service":"394866fc-eedb-4f01-8536-3ff84b16be2a",
    "Microsoft Policy Insights Provider Data Plane":"8cae6e77-e04e-42ce-b5cb-50d82bce26b1",
    "Microsoft Rights Management Services Default":"934d626a-1ead-4a36-a77d-12ec63b87a0d",
    "Microsoft Rights Management Services":"00000012-0000-0000-c000-000000000000",
    "Microsoft Service Trust":"d6fdaa33-e821-4211-83d0-cf74736489e1",
    "Microsoft Threat Protection":"8ee8fdad-f234-4243-8f3b-15c294843740",
    "Microsoft Windows AutoPilot Service API":"cbfda01c-c883-45aa-aedc-e7a484615620",
    "Microsoft_Azure_Support":"959678cf-d004-4c22-82a6-d2ce549a58b8",
    "Microsoft.Azure.SyncFabric":"00000014-0000-0000-c000-000000000000",
    "Microsoft.SMIT":"8fca0a66-c008-4564-a876-ab3ae0fd5cff",
    "MicrosoftGuestConfiguration":"e935b4a5-8968-416d-8414-caed51c782a9",
    "MS-PIM":"01fc33a7-78ba-4d2f-a4b7-768e336e890e",
    "My Apps":"2793995e-0a7d-40d7-bd35-6968ba142197",
    "My Profile":"8c59ead7-d703-4a27-9e55-c96a0054c8d2",
    "Narada Notification Service":"51b5e278-ed7e-42c6-8787-7ff93e92f577",
    "O365 Demeter":"982bda36-4632-4165-a46a-9863b1bbcf7d",
    "O365 Secure Score":"8b3391f4-af01-4ee8-b4ea-9871b2499735",
    "o365.servicecommunications.microsoft.com":"cb1bda4c-1213-4e8b-911a-0a8c83c5d3b7",
    "OCaaS Client Interaction Service":"c2ada927-a9e2-4564-aae2-70775a2fa0af",
    "OCaaS Experience Management Service":"6e99704e-62d5-40f6-b2fe-90aafbe3a710",
    "OCaaS Worker Services":"167e2ded-f32d-49f5-8a10-308b921bc7ee",
    "Office 365 Configure":"aa9ecb1e-fd53-4aaa-a8fe-7a54de2c1334",
    "Office 365 Exchange Online":"00000002-0000-0ff1-ce00-000000000000",
    "Office 365 Information Protection":"2f3f02c9-5679-4a5c-a605-0de55b07d135",
    "Office 365 Management APIs":"c5393580-f805-4401-95e8-94b7a6ef2fc2",
    "Office 365 Search Service":"66a88757-258c-4c72-893c-3e8bed4d6899",
    "Office 365 SharePoint Online":"00000003-0000-0ff1-ce00-000000000000",
    "Office365 Shell SS-Server Default":"6872b314-67ab-4a16-98e7-a663b0f772c3",
    "Office365 Shell WCSS-Server Default":"a68e1e61-ad4f-45b6-897d-0a1ea8786345",
    "Office365 Zoom":"0d38933a-0bbd-41ca-9ebd-28c4b5ba7cb7",
    "Office365DirectorySynchronizationService":"18af356b-c4fd-4f52-9899-d09d21397ab7",
    "OfficeClientService":"0f698dd4-f011-4d23-a33e-b36416dcb1e6",
    "OMSAuthorizationServicePROD":"50d8616b-fd4f-4fac-a1c9-a6a9440d7fe0",
    "OneProfile Service":"b2cc270f-563e-4d8a-af47-f00963a71dcd",
    "P2P Server":"0cf38140-1727-4074-99df-39ad2cd515e3",
    "People Profile Event Proxy":"65c8bd9e-caac-4816-be98-0692f41191bc",
    "phish-test":"c90373ac-0190-4d29-870a-d213a63acda1",
    "Policy Administration Service":"0469d4cd-df37-4d93-8a61-f8c75b809164",
    "policy enforcer":"fbb123dc-fe45-41fe-ad9f-e42ab0769328",
    "PowerApps Service":"475226c6-020e-4fb2-8a90-7a972cbfc1d4",
    "PROD Microsoft Defender For Cloud XDR":"3f6aecb4-6dbf-4e45-9141-440abdced562",
    "Request Approvals Read Platform":"d8c767ef-3e9a-48c4-aef9-562696539b39",
    "Signup":"b4bddae8-ab25-483e-8670-df09b9f1d0ea",
    "Skype for Business Online":"00000004-0000-0ff1-ce00-000000000000",
    "Substrate Instant Revocation Pipeline":"eace8149-b661-472f-b40d-939f89085bd4",
    "TenantSearchProcessors":"abc63b55-0325-4305-9e1e-3463b182a6dc",
    "TI-1P-APP":"b6a1fec6-8029-456b-81ed-de7754615362",
    "Windows Azure Active Directory":"00000002-0000-0000-c000-000000000000",
    "Windows Azure Security Resource Provider":"8edd93e1-2103-40b4-bd70-6e34e586362d",
    "Windows Store for Business":"45a330b1-b1ec-4cc1-9161-9f03992aa49f",
    "WindowsDefenderATP":"fc780465-2017-40d4-a0c5-307022471b92",
    "WindowsUpdate-Service":"6f0478d5-61a3-4897-a2f2-de09a5a90c7f"
};

const USER_AGENTS = {
  "Chrome Windows": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Firefox Windows": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Edge Windows": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
  "Safari macOS": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
  "Chrome Android": "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
  "iOS Safari": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1"
};

const DEVICE_PLATFORMS = [
  "windows", "macOS", "linux", "iOS", "android", "windowsPhone"
];

const CLIENT_APP_TYPES = [
  "browser", "mobileAppsAndDesktopClients", "exchangeActiveSync", "other"
];

const COUNTRIES = [
  "US", "CA", "GB", "DE", "FR", "IT", "ES", "AU", "JP", "BR", "IN", "CN"
];

export default function EnhancedCAPApp() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [accessToken, setAccessToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedApps, setSelectedApps] = useState<{ id: string; name: string }[]>([]);
  const [customAppId, setCustomAppId] = useState("");
  const [customAppName, setCustomAppName] = useState("");
  
  // Spoofing options
  const [spoofOptions, setSpoofOptions] = useState({
    devicePlatform: "windows",
    clientAppType: "browser",
    country: "US",
    userAgent: USER_AGENTS["Chrome Windows"],
    customUserAgent: "",
    useCustomUserAgent: false
  });
  
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [uploadedData, setUploadedData] = useState(null);
  const [appSearchTerm, setAppSearchTerm] = useState("");

  const handleAppToggle = (appId: string, appName: string) => {
    setSelectedApps(prev => {
      const exists = prev.find(app => app.id === appId);
      if (exists) {
        return prev.filter(app => app.id !== appId);
      } else {
        return [...prev, { id: appId, name: appName }];
      }
    });
  };

  const addCustomApp = () => {
    if (customAppId && customAppName) {
      const exists = selectedApps.find(app => app.id === customAppId);
      if (!exists) {
        setSelectedApps(prev => [...prev, { id: customAppId, name: customAppName }]);
        setCustomAppId("");
        setCustomAppName("");
      }
    }
  };

  const selectAllApps = () => {
    const allApps = Object.entries(FIRST_PARTY_APPS).map(([name, id]) => ({ id, name }));
    setSelectedApps(allApps);
  };

  const clearAllApps = () => {
    setSelectedApps([]);
  };

  // Filter first-party apps based on search term
  const filteredFirstPartyApps = Object.entries(FIRST_PARTY_APPS).filter(([name, id]) =>
    name.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
    id.toLowerCase().includes(appSearchTerm.toLowerCase())
  );

  const getUserObjectId = async (upn: string, token: string) => {
    const url = `https://graph.microsoft.com/v1.0/users/${upn}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': spoofOptions.useCustomUserAgent ? spoofOptions.customUserAgent : spoofOptions.userAgent
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get user: ${response.status} ${response.statusText}`);
    }
    
    const user = await response.json();
    return user.id;
  };

  const evaluateAccess = async (userId: any, token: string, appIds: string[]) => {
    const payload = {
      signInIdentity: {
        "@odata.type": "#microsoft.graph.userSignIn",
        userId: userId
      },
      signInContext: {
        "@odata.type": "#microsoft.graph.applicationContext",
        includeApplications: appIds
      },
      signInConditions: {
        devicePlatform: spoofOptions.devicePlatform,
        clientAppType: spoofOptions.clientAppType,
        country: spoofOptions.country
      },
      appliedPoliciesOnly: false
    };

    const response = await fetch('https://graph.microsoft.com/beta/identity/conditionalAccess/evaluate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': spoofOptions.useCustomUserAgent ? spoofOptions.customUserAgent : spoofOptions.userAgent
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    return response.json();
  };

  const runAnalysis = async () => {
    if (!accessToken || !username || selectedApps.length === 0) {
      setError("Please provide access token, username, and select at least one application");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      // Get user object ID
      const userId = await getUserObjectId(username, accessToken);
      
      // Get app IDs
      const appIds = selectedApps.map(app => app.id);
      
      // Evaluate access
      const result = await evaluateAccess(userId, accessToken, appIds);
      
      setAnalysisResults(result);
      setActiveTab("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportResults = () => {
    if (analysisResults) {
      const dataStr = JSON.stringify(analysisResults, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `cap-analysis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === "string") {
            const data = JSON.parse(result);
            setUploadedData(data);
            setActiveTab("uploaded-results");
          } else {
            setError("Invalid file content");
          }
        } catch (err) {
          setError("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const getAppNameById = (appId: string) => {
    const foundApp = selectedApps.find(app => app.id === appId);
    if (foundApp) return foundApp.name;
    
    // Check first-party apps
    const firstPartyApp = Object.entries(FIRST_PARTY_APPS).find(([_, id]) => id === appId);
    if (firstPartyApp) return firstPartyApp[0];
    
    return appId; // Return ID if name not found
  };

  const renderAnalysisResults = (data: any) => {
    if (!data || !data.value) return null;

    const policies = data.value;
    const totalPolicies = policies.length;
    const appliedPolicies = policies.filter((p: { policyApplies: any; }) => p.policyApplies).length;
    const enabledPolicies = policies.filter((p: { state: string; }) => p.state === "enabled").length;

    // Sort policies: triggered ones first, then by name
    const sortedPolicies = [...policies].sort((a, b) => {
      if (a.policyApplies && !b.policyApplies) return -1;
      if (!a.policyApplies && b.policyApplies) return 1;
      return a.displayName.localeCompare(b.displayName);
    });

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Policies</CardDescription>
              <CardTitle className="text-2xl">{totalPolicies}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Enabled Policies</CardDescription>
              <CardTitle className="text-2xl">{enabledPolicies}</CardTitle>
            </CardHeader>
          </Card>
          <Card className={appliedPolicies > 0 ? "border-orange-500 bg-orange-50" : ""}>
            <CardHeader className="pb-2">
              <CardDescription>Policies Triggered</CardDescription>
              <CardTitle className={`text-2xl ${appliedPolicies > 0 ? "text-orange-600" : ""}`}>
                {appliedPolicies}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Analysis Details */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">User:</Label>
                <p className="text-sm text-muted-foreground">{username}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Applications Tested:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedApps.map(app => (
                    <Badge key={app.id} variant="outline">{app.name}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Conditions:</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                  <div>Platform: <Badge variant="secondary">{spoofOptions.devicePlatform}</Badge></div>
                  <div>App Type: <Badge variant="secondary">{spoofOptions.clientAppType}</Badge></div>
                  <div>Country: <Badge variant="secondary">{spoofOptions.country}</Badge></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Triggered Policies Alert */}
        {appliedPolicies > 0 && (
          <Alert className="border-orange-500 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700">
              <strong>{appliedPolicies} Conditional Access {appliedPolicies === 1 ? 'Policy' : 'Policies'} triggered!</strong> 
              {" "}These policies would affect the user's sign-in experience.
            </AlertDescription>
          </Alert>
        )}

        {/* Policy Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Policy Results
              {appliedPolicies > 0 && <Zap className="h-5 w-5 text-orange-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {sortedPolicies.map((policy: any, index: number) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 ${
                      policy.policyApplies 
                        ? "border-orange-500 bg-orange-50 shadow-md" 
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{policy.displayName}</h4>
                        {policy.policyApplies && (
                          <Badge variant="destructive" className="bg-orange-600">
                            TRIGGERED
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={policy.state === "enabled" ? "default" : "secondary"}>
                          {policy.state}
                        </Badge>
                        {policy.policyApplies ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>ID: <code className="bg-muted px-1 rounded text-xs">{policy.id}</code></p>
                      
                      {/* Show why the policy triggered or didn't trigger */}
                      {policy.policyApplies ? (
                        <div className="bg-orange-100 p-3 rounded border border-orange-200">
                          <p className="font-medium text-orange-800 text-sm mb-2">🔥 Policy Triggered!</p>
                          
                          {/* Show analysis reason if available */}
                          {policy.analysisReasons && policy.analysisReasons !== "notSet" && (
                            <div className="mb-2">
                              <span className="font-medium text-orange-800 text-xs">Trigger Reason: </span>
                              <Badge variant="outline" className="text-xs bg-orange-50 border-orange-300 text-orange-700">
                                {policy.analysisReasons}
                              </Badge>
                            </div>
                          )}
                          
                          {/* Show target applications */}
                          {policy.conditions?.applications?.includeApplications && (
                            <div>
                              <p className="font-medium text-orange-800 text-xs mb-1">Target Applications:</p>
                              <div className="flex flex-wrap gap-1">
                                {policy.conditions.applications.includeApplications.map((appId: string) => (
                                  <Badge key={appId} variant="outline" className="text-xs bg-white border-orange-300">
                                    {appId === "All" ? "All Applications" : getAppNameById(appId)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Show target users/roles if specific */}
                          {policy.conditions?.users && (
                            <div className="mt-2">
                              {policy.conditions.users.includeUsers?.length > 0 && !policy.conditions.users.includeUsers.includes("All") && (
                                <div className="mb-1">
                                  <span className="font-medium text-orange-800 text-xs">Target Users: </span>
                                  <Badge variant="outline" className="text-xs bg-white border-orange-300">
                                    {policy.conditions.users.includeUsers.length} specific user(s)
                                  </Badge>
                                </div>
                              )}
                              {policy.conditions.users.includeRoles?.length > 0 && (
                                <div className="mb-1">
                                  <span className="font-medium text-orange-800 text-xs">Target Roles: </span>
                                  <Badge variant="outline" className="text-xs bg-white border-orange-300">
                                    {policy.conditions.users.includeRoles.length} admin role(s)
                                  </Badge>
                                </div>
                              )}
                              {policy.conditions.users.includeUsers?.includes("All") && (
                                <div className="mb-1">
                                  <span className="font-medium text-orange-800 text-xs">Target Users: </span>
                                  <Badge variant="outline" className="text-xs bg-white border-orange-300">
                                    All Users
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          <p className="font-medium text-green-800 text-xs mb-1">✅ Policy Not Triggered</p>
                          {policy.analysisReasons && policy.analysisReasons !== "notSet" && (
                            <div>
                              <span className="text-green-700 text-xs">Reason: </span>
                              <Badge variant="outline" className="text-xs bg-green-50 border-green-300 text-green-700">
                                {policy.analysisReasons}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Grant Controls */}
                      {policy.grantControls?.builtInControls?.length > 0 && (
                        <div>
                          <span className="font-medium">Required Controls: </span>
                          {policy.grantControls.builtInControls.map((control: string) => (
                            <Badge key={control} variant="outline" className="ml-1">
                              {control}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Session Controls */}
                      {policy.sessionControls && Object.keys(policy.sessionControls).length > 0 && (
                        <div>
                          <span className="font-medium">Session Controls: </span>
                          {Object.keys(policy.sessionControls).map((control: string) => (
                            <Badge key={control} variant="outline" className="ml-1">
                              {control}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Enhanced Microsoft Graph CAP Analyzer</h1>
          <p className="text-muted-foreground">
            Analyze Conditional Access Policies with spoofing capabilities
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="uploaded-results">Upload Results</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="token">Access Token</Label>
                    <div className="relative">
                      <Input
                        id="token"
                        type={showToken ? "text" : "password"}
                        placeholder="Enter your access token"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowToken(!showToken)}
                      >
                        {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="username">Username (UPN)</Label>
                    <Input
                      id="username"
                      placeholder="user@domain.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Spoofing Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Spoofing Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Device Platform</Label>
                    <Select
                      value={spoofOptions.devicePlatform}
                      onValueChange={(value) => setSpoofOptions(prev => ({...prev, devicePlatform: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEVICE_PLATFORMS.map(platform => (
                          <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Client App Type</Label>
                    <Select
                      value={spoofOptions.clientAppType}
                      onValueChange={(value) => setSpoofOptions(prev => ({...prev, clientAppType: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CLIENT_APP_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Select
                      value={spoofOptions.country}
                      onValueChange={(value) => setSpoofOptions(prev => ({...prev, country: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="custom-ua"
                        checked={spoofOptions.useCustomUserAgent}
                        onCheckedChange={(checked) => setSpoofOptions(prev => ({...prev, useCustomUserAgent: checked === true}))}
                      />
                      <Label htmlFor="custom-ua">Use Custom User Agent</Label>
                    </div>
                    {spoofOptions.useCustomUserAgent ? (
                      <Input
                        placeholder="Enter custom user agent"
                        value={spoofOptions.customUserAgent}
                        onChange={(e) => setSpoofOptions(prev => ({...prev, customUserAgent: e.target.value}))}
                      />
                    ) : (
                      <Select
                        value={spoofOptions.userAgent}
                        onValueChange={(value) => setSpoofOptions(prev => ({...prev, userAgent: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(USER_AGENTS).map(([name, ua]) => (
                            <SelectItem key={name} value={ua}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Application Selection */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Application Selection</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={selectAllApps} variant="outline" size="sm">
                      Select All
                    </Button>
                    <Button onClick={clearAllApps} variant="outline" size="sm">
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Selected Apps ({selectedApps.length})</Label>
                    <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-lg min-h-[60px]">
                      {selectedApps.map(app => (
                        <Badge
                          key={app.id}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleAppToggle(app.id, app.name)}
                        >
                          {app.name} ×
                        </Badge>
                      ))}
                      {selectedApps.length === 0 && (
                        <span className="text-muted-foreground text-sm">No applications selected</span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Microsoft First-Party Applications</Label>
                    {/* Search bar for first-party apps */}
                    <div className="mt-2 mb-3">
                      <Input
                        placeholder="Search applications..."
                        value={appSearchTerm}
                        onChange={(e) => setAppSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <ScrollArea className="h-48 border rounded-lg p-3">
                      <div className="space-y-2">
                        {filteredFirstPartyApps.length > 0 ? (
                          filteredFirstPartyApps.map(([name, id]) => (
                            <div key={id} className="flex items-center space-x-2">
                              <Checkbox
                                id={id}
                                checked={selectedApps.some(app => app.id === id)}
                                onCheckedChange={() => handleAppToggle(id, name)}
                              />
                              <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
                                {name}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No applications found matching "{appSearchTerm}"
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator />

                  <div>
                    <Label>Add Custom Application</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="App Name"
                        value={customAppName}
                        onChange={(e) => setCustomAppName(e.target.value)}
                      />
                      <Input
                        placeholder="Application ID"
                        value={customAppId}
                        onChange={(e) => setCustomAppId(e.target.value)}
                      />
                      <Button onClick={addCustomApp} disabled={!customAppId || !customAppName}>
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Controls */}
              <Card className="lg:col-span-2">
                <CardContent className="pt-6">
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex gap-4">
                    <Button
                      onClick={runAnalysis}
                      disabled={isAnalyzing || !accessToken || !username || selectedApps.length === 0}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Label htmlFor="upload">Upload Results:</Label>
                      <Input
                        id="upload"
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="w-auto"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analysis Results</CardTitle>
                  {analysisResults && (
                    <Button onClick={exportResults} variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Results
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {analysisResults ? (
                  renderAnalysisResults(analysisResults)
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No analysis results yet. Run an analysis to see results here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uploaded-results">
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Results</CardTitle>
              </CardHeader>
              <CardContent>
                {uploadedData ? (
                  renderAnalysisResults(uploadedData)
                ) : (
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Upload a JSON file to view analysis results here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings & Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Required Permissions</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your access token needs the following permissions:
                  </p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Policy.Read.All (to read conditional access policies)</li>
                    <li>• User.Read.All (to resolve user UPN to object ID)</li>
                    <li>• Application.Read.All (for application information)</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Spoofing Capabilities</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    This tool allows you to test conditional access policies under different conditions:
                  </p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• <strong>Device Platform:</strong> Simulate different operating systems</li>
                    <li>• <strong>Client App Type:</strong> Test browser vs mobile app scenarios</li>
                    <li>• <strong>Country:</strong> Simulate sign-ins from different locations</li>
                    <li>• <strong>User Agent:</strong> Spoof different browsers and devices</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">How to Get an Access Token</h3>
                  <ol className="text-sm space-y-1 ml-4">
                    <li>1. Use Azure CLI: <code className="bg-muted px-1 rounded">az account get-access-token --resource https://graph.microsoft.com</code></li>
                    <li>2. Use PowerShell with Microsoft.Graph module</li>
                    <li>3. Use roadtx for token acquisition and testing</li>
                    <li>4. Register an app in Azure AD with required permissions</li>
                  </ol>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Security Notice</h3>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This tool is for authorized testing only. Ensure you have permission to test against the target tenant.
                      Access tokens are processed locally in your browser and not sent to any external servers.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}