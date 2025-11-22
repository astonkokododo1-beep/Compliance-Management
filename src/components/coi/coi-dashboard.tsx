'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function CoiDashboard() {
  const declarationStatusData = [
    { status: 'Submitted', count: 245 },
    { status: 'Under Review', count: 32 },
    { status: 'Approved', count: 198 },
    { status: 'Requires Mitigation', count: 15 },
  ]

  const highRiskConflicts = [
    {
      employee: 'Sarah Johnson',
      department: 'Procurement',
      conflictType: 'Vendor Relationship',
      riskScore: 85,
      status: 'Pending Review',
    },
    {
      employee: 'Michael Chen',
      department: 'Finance',
      conflictType: 'Outside Directorship',
      riskScore: 72,
      status: 'Mitigation Plan',
    },
    {
      employee: 'Emily Rodriguez',
      department: 'Sales',
      conflictType: 'Family Ownership',
      riskScore: 68,
      status: 'Approved',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Declarations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">Current cycle</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High-Risk Conflicts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mitigation Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Declaration Status</CardTitle>
            <CardDescription>Current cycle progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={declarationStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>High-Risk Conflicts</CardTitle>
            <CardDescription>Conflicts requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Conflict</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highRiskConflicts.map((conflict, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{conflict.employee}</p>
                        <p className="text-xs text-muted-foreground">{conflict.department}</p>
                      </div>
                    </TableCell>
                    <TableCell>{conflict.conflictType}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          conflict.riskScore >= 80
                            ? 'destructive'
                            : conflict.riskScore >= 60
                            ? 'secondary'
                            : 'default'
                        }
                      >
                        {conflict.riskScore}
                      </Badge>
                    </TableCell>
                    <TableCell>{conflict.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
