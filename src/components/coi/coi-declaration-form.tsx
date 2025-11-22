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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/lib/db'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
  // Personal Relationships
  familyInIndustry: z.boolean().default(false),
  familyDetails: z.string().optional(),
  
  // Financial Interests
  outsideDirectorship: z.boolean().default(false),
  directorshipDetails: z.string().optional(),
  
  shareholdings: z.boolean().default(false),
  shareholdingDetails: z.string().optional(),
  
  // Vendor Relationships
  vendorRelationship: z.boolean().default(false),
  vendorDetails: z.string().optional(),
  
  // Other Employment
  secondaryEmployment: z.boolean().default(false),
  employmentDetails: z.string().optional(),
  
  // Gifts/Benefits
  significantBenefits: z.boolean().default(false),
  benefitsDetails: z.string().optional(),
})

interface CoiDeclarationFormProps {
  userId: string
}

export function CoiDeclarationForm({ userId }: CoiDeclarationFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyInIndustry: false,
      familyDetails: '',
      outsideDirectorship: false,
      directorshipDetails: '',
      shareholdings: false,
      shareholdingDetails: '',
      vendorRelationship: false,
      vendorDetails: '',
      secondaryEmployment: false,
      employmentDetails: '',
      significantBenefits: false,
      benefitsDetails: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      // Filter out false/empty responses
      const conflicts = Object.entries(values)
        .filter(([key, value]) => {
          if (typeof value === 'boolean') return value
          if (typeof value === 'string') return value.trim().length > 0
          return false
        })
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

      await db.declaration.create({
        data: {
          type: 'COI',
          data: JSON.stringify(conflicts),
          riskScore: Object.keys(conflicts).length > 2 ? 75 : Object.keys(conflicts).length > 0 ? 45 : 10,
          status: Object.keys(conflicts).length > 0 ? 'pending' : 'approved',
          createdBy: userId,
        },
      })

      toast({
        title: 'COI Declaration Submitted',
        description: 'Your conflict of interest declaration has been recorded',
      })

      form.reset()
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your declaration',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const watchAll = form.watch()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Annual Conflict of Interest Declaration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">Personal & Family Relationships</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="familyInIndustry"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Family members in industry
                        </FormLabel>
                        <FormDescription>
                          Do you have family members working for competitors, vendors, or clients?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {watchAll.familyInIndustry && (
                  <FormField
                    control={form.control}
                    name="familyDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provide Details</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe relationships, companies, positions..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">Financial Interests</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="outsideDirectorship"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Outside directorships
                        </FormLabel>
                        <FormDescription>
                          Do you hold any board positions or directorships outside the company?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchAll.outsideDirectorship && (
                  <FormField
                    control={form.control}
                    name="directorshipDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Details</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Company name, role, nature of business..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="shareholdings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Significant shareholdings
                        </FormLabel>
                        <FormDescription>
                          Do you own >5% of any company we do business with?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchAll.shareholdings && (
                  <FormField
                    control={form.control}
                    name="shareholdingDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shareholding Details</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Company name, percentage owned, relationship to us..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">Vendor & Business Relationships</h3>
              <FormField
                control={form.control}
                name="vendorRelationship"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Close relationships with vendors/clients
                      </FormLabel>
                      <FormDescription>
                        Do you have personal relationships that could influence business decisions?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchAll.vendorRelationship && (
                <FormField
                  control={form.control}
                  name="vendorDetails"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Relationship Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Name of vendor/client, nature of relationship, potential impact..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </section>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : 'Submit Declaration'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
