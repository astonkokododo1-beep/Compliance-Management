import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { CoiDeclarationForm } from '@/components/coi/coi-declaration-form'
import { CoiDashboard } from '@/components/coi/coi-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function CoiPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conflict of Interest Management</h1>
        <p className="text-muted-foreground">Declare and manage conflicts of interest</p>
      </div>

      <Tabs defaultValue="declare" className="space-y-6">
        <TabsList>
          <TabsTrigger value="declare">Annual Declaration</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="network">Relationship Network</TabsTrigger>
        </TabsList>
        <TabsContent value="declare">
          <CoiDeclarationForm userId={session.user.id} />
        </TabsContent>
        <TabsContent value="dashboard">
          <CoiDashboard />
        </TabsContent>
        <TabsContent value="network">
          <div className="grid gap-4">
            <p>Interactive relationship network visualization will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
