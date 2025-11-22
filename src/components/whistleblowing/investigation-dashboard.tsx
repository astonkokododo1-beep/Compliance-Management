'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, MessageSquare, Paperclip } from 'lucide-react'
import { db } from '@/lib/db'
import { useToast } from '@/components/ui/use-toast'

interface InvestigationDashboardProps {
  userId: string
  userRole: string
}

export function InvestigationDashboard({ userId, userRole }: InvestigationDashboardProps) {
  const [investigations, setInvestigations] = useState<any[]>([])
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch investigations
  useState(() => {
    loadInvestigations()
  })

  async function loadInvestigations() {
    const data = await db.investigation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { investigator: true },
    })
    setInvestigations(data)
  }

  async function updateCaseStatus(caseId: string, status: string) {
    setLoading(true)
    try {
      await db.investigation.update({
        where: { id: caseId },
        data: { status },
      })
      toast({ title: 'Case Updated' })
      loadInvestigations()
    } catch (error) {
      toast({ title: 'Update Failed', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function assignInvestigator(caseId: string, investigatorId: string) {
    setLoading(true)
    try {
      await db.investigation.update({
        where: { id: caseId },
        data: { assignedTo: investigatorId },
      })
      toast({ title: 'Investigator Assigned' })
      loadInvestigations()
    } catch (error) {
      toast({ title: 'Assignment Failed', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function addMessage(caseId: string) {
    if (!message.trim()) return

    setLoading(true)
    try {
      const investigation = await db.investigation.findUnique({ where: { id: caseId } })
      const messages = investigation?.messages || []
      
      await db.investigation.update({
        where: { id: caseId },
        data: {
          messages: [
            ...messages,
            {
              id: Math.random().toString(36).substring(7),
              author: userId,
              message,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      })
      setMessage('')
      toast({ title: 'Message Added' })
      loadInvestigations()
    } catch (error) {
      toast({ title: 'Failed to send message', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Investigations</CardTitle>
          <CardDescription>Manage whistleblowing cases and investigations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investigations.map((investigation) => (
                <TableRow key={investigation.id}>
                  <TableCell className="font-mono font-medium">{investigation.caseId}</TableCell>
                  <TableCell>{investigation.category}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(investigation.severity)}>
                      {investigation.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{investigation.status}</Badge>
                  </TableCell>
                  <TableCell>{investigation.investigator?.name || 'Unassigned'}</TableCell>
                  <TableCell>{new Date(investigation.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCase(investigation)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Case {investigation.caseId}</DialogTitle>
                          <DialogDescription>{investigation.category} - {investigation.severity} severity</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">{investigation.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Status</h4>
                              <Select
                                defaultValue={investigation.status}
                                onValueChange={(value) => updateCaseStatus(investigation.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="investigating">Investigating</SelectItem>
                                  <SelectItem value="review">Under Review</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Assign Investigator</h4>
                              <Input
                                placeholder="Investigator ID"
                                onBlur={(e) => assignInvestigator(investigation.id, e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Messages</h4>
                            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                              {investigation.messages?.map((msg: any) => (
                                <div key={msg.id} className="mb-3 p-2 bg-muted rounded">
                                  <p className="text-sm">{msg.message}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(msg.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                              {!investigation.messages?.length && (
                                <p className="text-sm text-muted-foreground">No messages yet</p>
                              )}
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <Textarea
                                placeholder="Add a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1"
                              />
                              <Button onClick={() => addMessage(investigation.id)} disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedCase(null)}>
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
