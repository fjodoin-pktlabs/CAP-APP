"use client"

import type { Policy } from "@/types/graph-types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Calendar, Shield, Lock } from "lucide-react"

interface PolicyDetailsProps {
  policy: Policy
}

export function PolicyDetails({ policy }: PolicyDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{policy.displayName}</CardTitle>
              <CardDescription>ID: {policy.id}</CardDescription>
            </div>
            <Badge variant={policy.state === "enabled" ? "default" : "secondary"} className="ml-2">
              {policy.state}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="font-medium mr-2">Policy Applies:</span>
                {policy.policyApplies ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Yes
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" /> No
                  </span>
                )}
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="font-medium mr-2">Created:</span>
                {new Date(policy.createdDateTime).toLocaleString()}
              </div>

              {policy.templateId && (
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium block">Template ID:</span>
                    <code className="text-xs bg-muted p-1 rounded">{policy.templateId}</code>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="font-medium mr-2">Analysis Reason:</span>
                <Badge variant="outline">{policy.analysisReasons === "notSet" ? "N/A" : policy.analysisReasons}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Lock className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium block">Grant Controls:</span>
                  <div className="mt-1">
                    <div>
                      <span className="text-muted-foreground">Operator:</span> {policy.grantControls?.operator}
                    </div>
                    <div className="mt-1">
                      <span className="text-muted-foreground">Controls:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {policy.grantControls?.builtInControls.map((control, i) => (
                          <Badge key={i} variant="secondary">
                            {control}
                          </Badge>
                        ))}
                        {policy.grantControls?.builtInControls.length === 0 && (
                          <span className="text-muted-foreground text-sm">None specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="applications">
        <TabsList className="mb-4">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Applications</CardTitle>
              <CardDescription>Application conditions for this policy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Include Applications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {policy.conditions.applications?.includeApplications.map((app, i) => (
                      <Badge key={i} variant="outline">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>

                {policy.conditions.applications?.excludeApplications.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Exclude Applications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.conditions.applications.excludeApplications.map((app, i) => (
                        <Badge key={i} variant="outline">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {policy.conditions.applications?.includeUserActions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Include User Actions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.conditions.applications.includeUserActions.map((action, i) => (
                        <Badge key={i} variant="outline">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Users</CardTitle>
              <CardDescription>User conditions for this policy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Include Users:</h4>
                  <div className="flex flex-wrap gap-2">
                    {policy.conditions.users?.includeUsers.length > 0 ? (
                      policy.conditions.users.includeUsers.map((user, i) => (
                        <Badge key={i} variant="outline">
                          {user}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">None specified</span>
                    )}
                  </div>
                </div>

                {policy.conditions.users?.excludeUsers.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Exclude Users:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.conditions.users.excludeUsers.map((user, i) => (
                        <Badge key={i} variant="outline">
                          {user}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {policy.conditions.users?.includeRoles.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Include Roles:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.conditions.users.includeRoles.map((role, i) => (
                        <Badge key={i} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {policy.conditions.users?.excludeRoles.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Exclude Roles:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.conditions.users.excludeRoles.map((role, i) => (
                        <Badge key={i} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Other Conditions</CardTitle>
              <CardDescription>Additional conditions for this policy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Client App Types:</h4>
                  <div className="flex flex-wrap gap-2">
                    {policy.conditions.clientAppTypes.map((type, i) => (
                      <Badge key={i} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {policy.conditions.signInRiskLevels.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Sign-in Risk Levels:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.conditions.signInRiskLevels.map((risk, i) => (
                        <Badge key={i} variant="outline">
                          {risk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {policy.conditions.userRiskLevels.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">User Risk Levels:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.conditions.userRiskLevels.map((risk, i) => (
                        <Badge key={i} variant="outline">
                          {risk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
