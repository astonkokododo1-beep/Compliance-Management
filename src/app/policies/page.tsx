import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PolicyGenerator } from '@/components/policies/policy-generator'
import { PolicyLibrary } from '@/components/policies/policy-library'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function PoliciesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  const policies = await db.policy.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Policy Management</h1>
        <p className="text-muted-foreground">Create, manage, and analyze compliance policies</p>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">Policy Library</TabsTrigger>
          <TabsTrigger value="generator">AI Policy Generator</TabsTrigger>
          <TabsTrigger value="analyzer">Gap Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="library">
          <PolicyLibrary policies={policies} />
        </TabsContent>
        <TabsContent value="generator">
          <PolicyGenerator />
        </TabsContent>
        <TabsContent value="analyzer">
          <div className="grid gap-4">
            <p>Upload existing policy for AI-powered gap analysis</p>
            {/* Gap analysis component would go here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
