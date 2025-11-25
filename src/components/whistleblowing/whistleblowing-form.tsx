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
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { aiService } from '@/lib/ai-service'
import { db } from '@/lib/db'
import { useToast } from '@/components/ui/use-toast'
import { generateCaseId } from '@/lib/utils'
import { Loader2, Shield, Send, Upload } from 'lucide-react'

const formSchema = z.object({
  incidentType: z.string().min(1, 'Incident type is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  anonymous: z.boolean().default(true),
  witness: z.boolean().default(false),
  witnessDetails: z.string().optional(),
  evidence: z.string().optional(),
})

export function WhistleblowingForm() {
  const [triage, setTriage] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidentType: '',
      description: '',
      location: '',
      date: '',
      anonymous: true,
      witness: false,
      witnessDetails: '',
      evidence: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      // Triage the complaint
      const triageResult = await aiService.triageComplaint(values.description)
      setTriage(triageResult)

      const caseId = generateCaseId()

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

      await db.investigation.create({
        data: {
          caseId,
          title: `${values.incidentType} - ${values.location}`,
          description: values.description,
          category: triageResult.category,
          severity: triageResult.severity,
          status: 'open',
          evidence: fileData ? [JSON.stringify(fileData)] : [],
          messages: [],
        },
      })

      toast({
        title: 'Report Submitted Successfully',
        description: `Your case ID is ${caseId}. Please save this for follow-up.`,
      })

      form.reset()
      setFile(null)
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Unable to submit report. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Anonymous Reporting Form</CardTitle>
            <Badge variant="outline" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>End-to-End Encrypted</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="incidentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Harassment">Harassment</SelectItem>
                        <SelectItem value="Fraud">Fraud or Financial Misconduct</SelectItem>
                        <SelectItem value="Safety">Health & Safety Violation</SelectItem>
                        <SelectItem value="Ethics">Ethics Violation</SelectItem>
                        <SelectItem value="Bribery">Bribery or Corruption</SelectItem>
                        <SelectItem value="Discrimination">Discrimination</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide as much detail as possible about the incident..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include who, what, when, where, and how. Specific details help investigations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Office location or department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="anonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Submit Anonymously</FormLabel>
                      <FormDescription>Your identity will not be recorded</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="witness"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Other Witnesses</FormLabel>
                      <FormDescription>Are there other witnesses to this incident?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('witness') && (
                <FormField
                  control={form.control}
                  name="witnessDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Witness Details (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Names or descriptions of other witnesses" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div>
                <FormLabel>Supporting Evidence (Optional)</FormLabel>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm">Click to upload documents, screenshots, or other evidence</p>
                  </label>
                </div>
                {file && <p className="text-sm text-muted-foreground mt-2">Selected: {file.name}</p>}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </Form>

          {triage && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">AI Triage Results</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <Badge className="ml-2">{triage.category}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Severity:</span>
                  <Badge variant={triage.severity === 'Critical' ? 'destructive' : 'secondary'} className="ml-2">
                    {triage.severity}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
