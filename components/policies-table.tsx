"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Search, CheckCircle2, XCircle } from "lucide-react"
import type { Policy } from "@/types/graph-types"

interface PoliciesTableProps {
  policies: Policy[]
  onSelectPolicy: (id: string) => void
}

export function PoliciesTable({ policies, onSelectPolicy }: PoliciesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Policy>("displayName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof Policy) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredPolicies = policies.filter((policy) =>
    policy.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    if (sortField === "createdDateTime") {
      const dateA = new Date(a[sortField] || 0).getTime()
      const dateB = new Date(b[sortField] || 0).getTime()
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    }

    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search policies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                Sort by <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("displayName")}>
                Name {sortField === "displayName" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("state")}>
                State {sortField === "state" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("createdDateTime")}>
                Created Date {sortField === "createdDateTime" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Applies</TableHead>
              <TableHead>Analysis Reason</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Template</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPolicies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No policies found
                </TableCell>
              </TableRow>
            ) : (
              sortedPolicies.map((policy) => (
                <TableRow
                  key={policy.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelectPolicy(policy.id)}
                >
                  <TableCell className="font-medium">{policy.displayName}</TableCell>
                  <TableCell>
                    <Badge variant={policy.state === "enabled" ? "default" : "secondary"}>{policy.state}</Badge>
                  </TableCell>
                  <TableCell>
                    {policy.policyApplies ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {policy.analysisReasons === "notSet" ? "N/A" : policy.analysisReasons}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(policy.createdDateTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {policy.templateId ? (
                      <Badge variant="outline" className="font-mono text-xs">
                        {policy.templateId.substring(0, 8)}...
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Custom</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
