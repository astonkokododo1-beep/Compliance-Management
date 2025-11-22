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
import { aiService } from '@/lib/ai-service'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  policyType: z.string().min(1, 'Policy type is required'),
  industry: z.string().min(1, 'Industry is required'),
  companyType: z.string().min(1, 'Company type is required'),
  jurisdictions: z.string().min(1, 'At least one jurisdiction is required'),
  riskLevel: z.enum(['Low', 'Medium', 'High']),
  specificRequirements: z.string().optional(),
})

export function PolicyGenerator() {
  const [generatedPolicy, setGeneratedPolicy] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policyType: '',
      industry: '',
      companyType: '',
      jurisdictions: '',
      riskLevel: 'Medium',
      specificRequirements: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const context = {
        type: values.policyType,
        industry: values.industry,
        companyType: values.companyType,
        jurisdictions: values.jurisdictions.split(',').map((j) => j.trim()),
        riskLevel: values.riskLevel,
        specificRequirements: values.specificRequirements,
      }

      const result = await aiService.generatePolicy(context)
      setGeneratedPolicy(result.content)
      toast({
        title: 'Policy Generated',
        description: 'AI has successfully generated your compliance policy',
      })
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'There was an error generating the policy',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generate Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="policyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Anti-Bribery">Anti-Bribery</SelectItem>
                        <SelectItem value="Data Privacy">Data Privacy</SelectItem>
                        <SelectItem value="Conflict of Interest">Conflict of Interest</SelectItem>
                        <SelectItem value="Gift & Hospitality">Gift & Hospitality</SelectItem>
                        <SelectItem value="Whistleblowing">Whistleblowing</SelectItem>
                        <SelectItem value="Code of Conduct">Code of Conduct</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Financial Services">Financial Services</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Energy">Energy</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Subsidiary">Subsidiary</SelectItem>
                        <SelectItem value="Non-profit">Non-profit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jurisdictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating Jurisdictions (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., UAE, UK, US" {...field} />
                    </FormControl>
                    <FormDescription>Countries where you operate</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="riskLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specificRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Requirements (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any specific requirements or focus areas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Policy...
                  </>
                ) : (
                  'Generate Policy'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Policy</CardTitle>
        </CardHeader>
        <CardContent>
          {generatedPolicy ? (
            <div className="prose max-w-none overflow-auto max-h-[600px]">
              <pre className="whitespace-pre-wrap font-sans text-sm">{generatedPolicy}</pre>
            </div>
          ) : (
            <p className="text-muted-foreground">Generated policy will appear here...</p>
          )}
          {generatedPolicy && (
            <Button
              className="mt-4"
              onClick={() => {
                navigator.clipboard.writeText(generatedPolicy)
                toast({ title: 'Copied to clipboard' })
              }}
            >
              Copy Policy
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
