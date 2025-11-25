'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { aiService } from '@/lib/ai-service'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/lib/db'
import { encryptData } from '@/lib/utils'
import { Loader2, Upload, AlertCircle } from 'lucide-react'

const formSchema = z.object({
  value: z.number().min(1, 'Value must be greater than 0'),
  source: z.string().min(1, 'Source is required'),
  description: z.string().min(1, 'Description is required'),
  recipientRole: z.string().min(1, 'Recipient role is required'),
  timing: z.string().min(1, 'Timing details required'),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  businessPurpose: z.string().min(1, 'Business purpose is required'),
})

interface GiftDeclarationFormProps {
  userId: string
}

export function GiftDeclarationForm({ userId }: GiftDeclarationFormProps) {
  const [riskAssessment, setRiskAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: 0,
      source: '',
      description: '',
      recipientRole: '',
      timing: '',
      jurisdiction: '',
      businessPurpose: '',
    },
  })

  async function assessRisk(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const assessment = await aiService.assessGiftRisk({
        value: values.value,
        source: values.source,
        recipientRole: values.recipientRole,
        timing: values.timing,
        frequency: 1,
        jurisdiction: values.jurisdiction,
      })
      setRiskAssessment(assessment)
    } catch (error) {
      toast({
        title: 'Risk Assessment Failed',
        description: 'Unable to assess risk at this time',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!riskAssessment) {
      toast({
        title: 'Risk Assessment Required',
        description: 'Please assess risk before submitting',
        variant: 'destructive',
      })
      return
    }

    try {
      let fileData = null
      if (file) {
        const buffer = await file.arrayBuffer()
        fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: Buffer.from(buffer).toString('base64'),
        }
      }

      await db.declaration.create({
        data: {
          type: 'GHE',
          data: encryptData(JSON.stringify({
            ...values,
            riskAssessment,
          })),
          riskScore: riskAssessment.riskScore,
          status: riskAssessment.recommendation === 'Auto-approve' ? 'approved' : 'pending',
          attachments: fileData ? [JSON.stringify(fileData)] : [],
          createdBy: userId,
        },
      })

      toast({
        title: 'Declaration Submitted',
        description: 'Your gift declaration has been submitted for review',
      })

      form.reset()
      setRiskAssessment(null)
      setFile(null)
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your declaration',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Gift Declaration Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gift Value (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source (Vendor/Client Name)</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the gift/hospitality" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipientRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Role/Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Executive">Executive</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Procurement">Procurement</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timing Context</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 7 days before contract signing" {...field} />
                    </FormControl>
                    <FormDescription>
                      Any relevant timing information (proximity to decisions/contracts)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UAE">UAE</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="US">US</SelectItem>
                        <SelectItem value="EU">EU</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Purpose</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Explain the legitimate business purpose" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Label>Supporting Documents (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm">Click to upload receipt or supporting document</p>
                  </label>
                </div>
                {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  onClick={form.handleSubmit(assessRisk)}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Assess Risk'}
                </Button>
                <Button type="submit" disabled={!riskAssessment || loading}>
                  Submit Declaration
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          {riskAssessment ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Risk Score</span>
                  <Badge
                    variant={
                      riskAssessment.riskLevel === 'Critical'
                        ? 'destructive'
                        : riskAssessment.riskLevel === 'High'
                          ? 'destructive'
                          : riskAssessment.riskLevel === 'Medium'
                            ? 'secondary'
                            : 'default'
                    }
                  >
                    {riskAssessment.riskLevel}
                  </Badge>
                </div>
                <Progress value={riskAssessment.riskScore} className="h-2" />
                <p className="text-2xl font-bold mt-2">{riskAssessment.riskScore}/100</p>
              </div>

              {riskAssessment.redFlags?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    Red Flags Detected
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {riskAssessment.redFlags.map((flag: string, index: number) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Recommendation</h4>
                <p className="text-sm text-muted-foreground">{riskAssessment.recommendation}</p>
              </div>

              {riskAssessment.requiredApprovers && (
                <div>
                  <h4 className="font-medium mb-2">Required Approvers</h4>
                  <ul className="text-sm text-muted-foreground">
                    {riskAssessment.requiredApprovers.map((approver: string, index: number) => (
                      <li key={index}>• {approver}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Risk assessment will appear here after clicking "Assess Risk"</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
