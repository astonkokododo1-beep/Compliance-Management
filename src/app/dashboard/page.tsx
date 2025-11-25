import { AlertTriangle, CheckCircle, Clock, TrendingUp, Users, FileText, Shield } from 'lucide-react'
import { RiskTrendChart, ComplianceStatusChart } from '@/components/dashboard/dashboard-charts'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Fetch dashboard metrics
  const [
    totalPolicies,
    pendingDeclarations,
    openInvestigations,
    totalUsers,
    recentDeclarations,
  ] = await Promise.all([
    db.policy.count(),
    db.declaration.count({ where: { status: 'pending' } }),
    db.investigation.count({ where: { status: 'open' } }),
    db.user.count(),
    db.declaration.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
  ])

  const riskData = [
    { month: 'Jan', risk: 65 },
    { month: 'Feb', risk: 72 },
    { month: 'Mar', risk: 68 },
    { month: 'Apr', risk: 75 },
    { month: 'May', risk: 82 },
    { month: 'Jun', risk: 78 },
  ]

  const categoryData = [
    { name: 'GHE', value: 35, color: '#3b82f6' },
    { name: 'COI', value: 25, color: '#059669' },
    { name: 'ABAC', value: 20, color: '#f59e0b' },
    { name: 'Fraud', value: 20, color: '#dc2626' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session.user?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPolicies}</div>
            <p className="text-xs text-muted-foreground">Active documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeclarations}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openInvestigations}</div>
            <p className="text-xs text-muted-foreground">Active investigations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Trends</CardTitle>
            <CardDescription>Risk score over last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskTrendChart data={riskData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Case Distribution</CardTitle>
            <CardDescription>By compliance area</CardDescription>
          </CardHeader>
          <CardContent>
            <ComplianceStatusChart data={categoryData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest declarations and submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDeclarations.map((declaration) => (
              <div key={declaration.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-medium">{declaration.type}</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted by {declaration.author.name} • {' '}
                    {new Date(declaration.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    declaration.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                    declaration.status === 'approved' && 'bg-green-100 text-green-800',
                    declaration.status === 'rejected' && 'bg-red-100 text-red-800'
                  )}
                >
                  {declaration.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
