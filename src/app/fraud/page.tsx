import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { FraudDetectionPanel } from '@/components/fraud/fraud-detection-panel'
import { FraudAnalytics } from '@/components/fraud/fraud-analytics'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function FraudPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fraud Analytics Engine</h1>
        <p className="text-muted-foreground">Multi-vector fraud detection and prevention</p>
      </div>

      <Tabs defaultValue="detection" className="space-y-6">
        <TabsList>
          <TabsTrigger value="detection">Fraud Detection</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="cases">Investigation Queue</TabsTrigger>
        </TabsList>
        <TabsContent value="detection">
          <FraudDetectionPanel />
        </TabsContent>
        <TabsContent value="analytics">
          <FraudAnalytics />
        </TabsContent>
        <TabsContent value="cases">
          <p>Investigation queue and case management</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
