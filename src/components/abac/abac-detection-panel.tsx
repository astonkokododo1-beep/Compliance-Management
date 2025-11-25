'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, TrendingUp, Users } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AbacDetectionPanel() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      employee: 'Ahmed K.',
      riskScore: 91,
      indicators: [
        '$5,000 dinner with Gov. Official (7 days ago)',
        '$2M contract signed with official\'s ministry (today)',
        '3 similar patterns in past 18 months',
      ],
      status: 'Open',
    },
    {
      id: 2,
      employee: 'Sarah M.',
      riskScore: 78,
      indicators: [
        '$12,000 commission to intermediary (unusual %)',
        'Payment timing: 2 days before deal closure',
      ],
      status: 'Investigating',
    },
    {
      id: 3,
      employee: 'David L.',
      riskScore: 65,
      indicators: [
        'Luxury travel expenses to high-risk jurisdiction',
        'No clear business justification',
      ],
      status: 'Under Review',
    },
  ])

  const trendData = [
    { month: 'Jan', redFlags: 12 },
    { month: 'Feb', redFlags: 19 },
    { month: 'Mar', redFlags: 15 },
    { month: 'Apr', redFlags: 23 },
    { month: 'May', redFlags: 28 },
    { month: 'Jun', redFlags: 31 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Red Flags This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">31</div>
            <p className="text-xs text-muted-foreground">+24% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High-Risk Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Above threshold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Government Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">vs 97.1% last quarter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Red Flag Trends</CardTitle>
            <CardDescription>Monthly detection patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="redFlags" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk by Category</CardTitle>
            <CardDescription>Alert distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium">High-Risk Interactions</span>
                </div>
                <Badge variant="destructive">12</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">Commission Anomalies</span>
                </div>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Third-Party Risk</span>
                </div>
                <Badge variant="outline">11</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>Transactions requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Indicators</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.employee}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        alert.riskScore >= 80
                          ? 'destructive'
                          : alert.riskScore >= 60
                            ? 'secondary'
                            : 'default'
                      }
                    >
                      {alert.riskScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ul className="text-sm text-muted-foreground">
                      {alert.indicators.map((indicator, idx) => (
                        <li key={idx}>• {indicator}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{alert.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Investigate</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
