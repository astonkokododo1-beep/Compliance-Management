'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export function FraudAnalytics() {
  const fraudTypeData = [
    { name: 'Duplicate Receipts', value: 35, color: '#dc2626' },
    { name: 'Photoshopped Documents', value: 25, color: '#f59e0b' },
    { name: 'Shell Companies', value: 20, color: '#3b82f6' },
    { name: 'Benford Violations', value: 20, color: '#059669' },
  ]

  const timeToDetection = [
    { month: 'Jan', hours: 48 },
    { month: 'Feb', hours: 36 },
    { month: 'Mar', hours: 24 },
    { month: 'Apr', hours: 18 },
    { month: 'May', hours: 12 },
    { month: 'Jun', hours: 8 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fraud Type Distribution</CardTitle>
            <CardDescription>Breakdown of detected fraud schemes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fraudTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {fraudTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time to Detection</CardTitle>
            <CardDescription>Average hours to detect fraud (improving)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeToDetection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#059669" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Fraud detection system effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Precision</h4>
              <div className="text-3xl font-bold">94.1%</div>
              <p className="text-sm text-muted-foreground">True positives / Total alerts</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Recall</h4>
              <div className="text-3xl font-bold">89.3%</div>
              <p className="text-sm text-muted-foreground">Fraud caught / Total fraud</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Cost Savings</h4>
              <div className="text-3xl font-bold">$2.4M</div>
              <p className="text-sm text-muted-foreground">YTD prevented losses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
