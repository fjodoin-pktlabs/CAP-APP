export interface WhatIfAnalysisResult {
  "@odata.context": string
  value: Policy[]
}

export interface Policy {
  id: string
  templateId: string | null
  displayName: string
  createdDateTime: string
  modifiedDateTime: string | null
  state: "enabled" | "disabled"
  policyApplies: boolean
  analysisReasons: string
  partialEnablementStrategy: any
  sessionControls: any
  conditions: {
    userRiskLevels: string[]
    signInRiskLevels: string[]
    clientAppTypes: string[]
    servicePrincipalRiskLevels: string[]
    insiderRiskLevels: any
    clients: any
    platforms: any
    locations: any
    times: any
    deviceStates: any
    devices: any
    clientApplications: any
    authenticationFlows: any
    applications: {
      includeApplications: string[]
      excludeApplications: string[]
      includeUserActions: string[]
      includeAuthenticationContextClassReferences: string[]
      applicationFilter: any
      networkAccess: any
      globalSecureAccess: any
    }
    users: {
      includeUsers: string[]
      excludeUsers: string[]
      includeGroups: string[]
      excludeGroups: string[]
      includeRoles: string[]
      excludeRoles: string[]
      includeGuestsOrExternalUsers: any
      excludeGuestsOrExternalUsers: any
    }
  }
  grantControls: {
    operator: string
    builtInControls: string[]
    customAuthenticationFactors: string[]
    termsOfUse: string[]
    authenticationStrength: any
  }
}
