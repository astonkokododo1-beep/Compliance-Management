import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { WhistleblowingForm } from '@/components/whistleblowing/whistleblowing-form'
import { InvestigationDashboard } from '@/components/whistleblowing/investigation-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function WhistleblowingPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user is investigator or has special access
  const isInvestigator = session.user.role === 'INVESTIGATOR' || session.user.role === 'ADMIN'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Whistleblowing & Investigations</h1>
        <p className="text-muted-foreground">Anonymous reporting and case management</p>
      </div>

      <Tabs defaultValue={isInvestigator ? "dashboard" : "report"} className="space-y-6">
        <TabsList>
          <TabsTrigger value="report">New Report</TabsTrigger>
          <TabsTrigger value="dashboard">Investigations</TabsTrigger>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="report">
          <WhistleblowingForm />
        </TabsContent>
        <TabsContent value="dashboard">
          <InvestigationDashboard userId={session.user.id} userRole={session.user.role} />
        </TabsContent>
        <TabsContent value="reports">
          <p>Your submitted reports will appear here</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
