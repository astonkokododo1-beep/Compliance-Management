import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AbacDetectionPanel } from '@/components/abac/abac-detection-panel'
import { AbacAlerts } from '@/components/abac/abac-alerts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function AbacPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Anti-Bribery & Anti-Corruption</h1>
        <p className="text-muted-foreground">AI-powered transaction surveillance and risk detection</p>
      </div>

      <Tabs defaultValue="detection" className="space-y-6">
        <TabsList>
          <TabsTrigger value="detection">Transaction Monitoring</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="third-parties">Third-Party Risk</TabsTrigger>
        </TabsList>
        <TabsContent value="detection">
          <AbacDetectionPanel />
        </TabsContent>
        <TabsContent value="alerts">
          <AbacAlerts />
        </TabsContent>
        <TabsContent value="third-parties">
          <p>Third-party risk scoring dashboard</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
