'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, TrendingUp, Receipt } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function FraudDetectionPanel() {
  const [activeTab, setActiveTab] = useState('expense')

  const expenseAlerts = [
    {
      id: 'EXP-001',
      employee: 'John Smith',
      amount: '$2,450',
      description: 'Client dinner - duplicate receipt detected',
      confidence: 94,
      status: 'Flagged',
    },
    {
      id: 'EXP-002',
      employee: 'Maria Garcia',
      amount: '$890',
      description: 'Hotel booking - photoshopped receipt',
      confidence: 87,
      status: 'Under Review',
    },
  ]

  const vendorAlerts = [
    {
      id: 'VEN-001',
      vendor: 'Global Consulting Ltd.',
      riskIndicators: ['Recently incorporated', 'P.O. Box address', 'High payment frequency'],
      riskScore: 82,
      status: 'High Risk',
    },
  ]

  const financialAlerts = [
    {
      id: 'FIN-001',
      department: 'APAC Operations',
      anomaly: 'Journal entries deviate from Benford"s Law',
      confidence: 76,
      status: 'Investigating',
    },
  ]

  const fraudTrendData = [
    { month: 'Jan', cases: 5 },
    { month: 'Feb', cases: 8 },
    { month: 'Mar', cases: 6 },
    { month: 'Apr', cases: 12 },
    { month: 'May', cases: 15 },
    { month: 'Jun', cases: 11 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-muted-foreground">+15% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Potential Loss Prevented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$127K</div>
            <p className="text-xs text-muted-foreground">YTD</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Investigations Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.3%</div>
            <p className="text-xs text-muted-foreground">False positive rate: 7.7%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="expense">Expense Fraud</TabsTrigger>
          <TabsTrigger value="vendor">Vendor Fraud</TabsTrigger>
          <TabsTrigger value="financial">Financial Statement</TabsTrigger>
        </TabsList>

        <TabsContent value="expense">
          <Card>
            <CardHeader>
              <CardTitle>Expense Fraud Detection</CardTitle>
              <CardDescription>Automated receipt and expense analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>AI Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-mono">{alert.id}</TableCell>
                      <TableCell>{alert.employee}</TableCell>
                      <TableCell>{alert.amount}</TableCell>
                      <TableCell>{alert.description}</TableCell>
                      <TableCell>
                        <Badge>{alert.confidence}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{alert.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Investigate</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendor">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Fraud Detection</CardTitle>
              <CardDescription>Shell company and duplicate vendor detection</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Risk Indicators</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.vendor}</TableCell>
                      <TableCell>
                        <ul className="text-sm text-muted-foreground">
                          {alert.riskIndicators.map((indicator, idx) => (
                            <li key={idx}>• {indicator}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{alert.riskScore}</Badge>
                      </TableCell>
                      <TableCell>{alert.status}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Review</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Statement Fraud Detection</CardTitle>
              <CardDescription>Statistical analysis and anomaly detection</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Anomaly Type</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-mono">{alert.id}</TableCell>
                      <TableCell>{alert.department}</TableCell>
                      <TableCell>{alert.anomaly}</TableCell>
                      <TableCell>
                        <Badge>{alert.confidence}%</Badge>
                      </TableCell>
                      <TableCell>{alert.status}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Analyze</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Detection Trends</CardTitle>
          <CardDescription>Monthly detection patterns across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fraudTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cases" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
