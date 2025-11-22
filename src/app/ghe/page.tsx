import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { GiftDeclarationForm } from '@/components/ghe/gift-declaration-form'
import { GheDashboard } from '@/components/ghe/ghe-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function GhePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gift, Hospitality & Entertainment</h1>
        <p className="text-muted-foreground">Manage and monitor gift declarations with AI risk assessment</p>
      </div>

      <Tabs defaultValue="declare" className="space-y-6">
        <TabsList>
          <TabsTrigger value="declare">New Declaration</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="history">My History</TabsTrigger>
        </TabsList>
        <TabsContent value="declare">
          <GiftDeclarationForm userId={session.user.id} />
        </TabsContent>
        <TabsContent value="dashboard">
          <GheDashboard />
        </TabsContent>
        <TabsContent value="history">
          <p>Declaration history will appear here</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
