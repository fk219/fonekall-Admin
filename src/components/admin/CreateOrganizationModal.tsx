import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Building2, DollarSign, Settings, Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  support_email: z.string().email('Please enter a valid support email'),
  domain: z.string().optional(),
  plan: z.enum(['starter', 'professional', 'enterprise'], {
    required_error: 'Please select a plan',
  }),
  per_minute_rate: z.coerce.number().positive('Per-minute rate must be positive'),
  credit_balance: z.coerce.number().min(0, 'Initial credits must be 0 or greater'),
  monthly_call_limit: z.coerce.number().int().positive('Monthly call limit must be a positive integer'),
  auto_recharge_enabled: z.boolean(),
  auto_recharge_amount: z.coerce.number().positive('Auto-recharge amount must be positive').optional(),
  low_credit_threshold: z.coerce.number().positive('Low credit threshold must be positive').optional(),
  admin_email: z.string().email('Please enter a valid admin email'),
  admin_first_name: z.string().min(1, 'First name is required'),
  admin_last_name: z.string().min(1, 'Last name is required'),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateOrganizationModal({ isOpen, onClose, onSuccess }: CreateOrganizationModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      email: '',
      support_email: '',
      domain: '',
      plan: 'starter' as const,
      per_minute_rate: 0.05,
      credit_balance: 100,
      monthly_call_limit: 1000,
      auto_recharge_enabled: false,
      auto_recharge_amount: 100,
      low_credit_threshold: 10,
      admin_email: '',
      admin_first_name: '',
      admin_last_name: '',
    },
  });

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      setLoading(true);

      // Create organization with admin contact info
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: data.name,
          email: data.email,
          support_email: data.support_email,
          domain: data.domain || null,
          plan: data.plan,
          per_minute_rate: data.per_minute_rate,
          credit_balance: data.credit_balance,
          monthly_call_limit: data.monthly_call_limit,
          current_month_calls: 0,
          is_active: true,
          auto_recharge_enabled: data.auto_recharge_enabled,
          auto_recharge_amount: data.auto_recharge_enabled && data.auto_recharge_amount 
            ? data.auto_recharge_amount 
            : null,
          low_credit_threshold: data.low_credit_threshold || null,
          branding: {
            admin_contact: {
              email: data.admin_email,
              first_name: data.admin_first_name,
              last_name: data.admin_last_name,
            }
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Record initial credit transaction
      if (data.credit_balance > 0) {
        await supabase.from('credit_transactions').insert({
          organization_id: orgData.id,
          transaction_type: 'addition',
          amount: data.credit_balance,
          balance_before: 0,
          balance_after: data.credit_balance,
          description: 'Initial credit allocation',
          reference_type: 'manual',
          reference_id: orgData.id,
        });
      }

      toast({
        title: "Organization Created",
        description: `${data.name} has been successfully created. Admin user can be invited separately.`,
      });

      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Create New Organization
          </DialogTitle>
          <DialogDescription>
            Set up a new organization with billing configuration and admin account
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">
                  <Building2 className="w-4 h-4 mr-2" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="billing">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Billing
                </TabsTrigger>
                <TabsTrigger value="admin">
                  <Users className="w-4 h-4 mr-2" />
                  Admin Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter organization name" data-testid="input-org-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="contact@organization.com" data-testid="input-org-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="support_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="support@organization.com" data-testid="input-support-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="organization.com" data-testid="input-domain" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Plan *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-plan">
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="billing" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="per_minute_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Per-Minute Calling Rate (USD) *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" min="0" placeholder="0.05" data-testid="input-per-minute-rate" />
                      </FormControl>
                      <FormDescription>
                        Cost charged per minute of calling
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="credit_balance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Credit Balance (USD) *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" min="0" placeholder="100.00" data-testid="input-credit-balance" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthly_call_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Call Limit *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" placeholder="1000" data-testid="input-call-limit" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="auto_recharge_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto-Recharge</FormLabel>
                        <FormDescription>
                          Automatically add credits when balance is low
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-auto-recharge"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('auto_recharge_enabled') && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="auto_recharge_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Auto-Recharge Amount (USD)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" min="0" placeholder="100.00" data-testid="input-auto-recharge-amount" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="low_credit_threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Low Credit Threshold (USD)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" min="0" placeholder="10.00" data-testid="input-low-credit-threshold" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-4">
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    Store admin contact information. Admin user accounts should be created via secure invitation flow separately.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="admin_first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John" data-testid="input-admin-firstname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="admin_last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Doe" data-testid="input-admin-lastname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="admin_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Contact Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="admin@organization.com" data-testid="input-admin-email" />
                      </FormControl>
                      <FormDescription>
                        Primary contact for this organization's administration
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="btn-premium"
                data-testid="button-create-org"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Create Organization
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
