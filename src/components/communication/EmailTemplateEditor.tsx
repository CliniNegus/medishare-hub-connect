
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Plus, Save, Trash, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
  created_at: string;
  updated_at: string;
}

// Mock data for email templates
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Our Platform!',
    body: 'Hello {name},\n\nWelcome to our platform. We are excited to have you on board!\n\nBest regards,\n{organization}',
    type: 'welcome',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Password Reset',
    subject: 'Password Reset Request',
    body: 'Hello {name},\n\nWe received a request to reset your password. Click the link below to reset it:\n\n{link}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\n{organization}',
    type: 'notification',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const EmailTemplateEditor = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [templateType, setTemplateType] = useState('general');
  
  React.useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);
  
  const fetchTemplates = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Use mock data instead of Supabase query
      setTemplates(mockTemplates);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching email templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email templates',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };
  
  const createTemplate = async () => {
    if (!user || !templateName || !templateSubject || !templateBody) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSavingTemplate(true);
      
      const newTemplate: Template = {
        id: `temp-${Date.now()}`,
        name: templateName,
        subject: templateSubject,
        body: templateBody,
        type: templateType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add new template to state
      setTemplates(prev => [newTemplate, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Email template created successfully',
      });
      
      resetForm();
      setSavingTemplate(false);
    } catch (error) {
      console.error('Error creating email template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create email template',
        variant: 'destructive',
      });
      setSavingTemplate(false);
    }
  };
  
  const updateTemplate = async () => {
    if (!user || !selectedTemplate || !templateName || !templateSubject || !templateBody) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSavingTemplate(true);
      
      const updatedTemplate: Template = {
        ...selectedTemplate,
        name: templateName,
        subject: templateSubject,
        body: templateBody,
        type: templateType,
        updated_at: new Date().toISOString(),
      };
      
      // Update templates state
      setTemplates(prev => 
        prev.map(template => 
          template.id === selectedTemplate.id ? updatedTemplate : template
        )
      );
      
      toast({
        title: 'Success',
        description: 'Email template updated successfully',
      });
      
      resetForm();
      setSavingTemplate(false);
    } catch (error) {
      console.error('Error updating email template:', error);
      toast({
        title: 'Error',
        description: 'Failed to update email template',
        variant: 'destructive',
      });
      setSavingTemplate(false);
    }
  };
  
  const deleteTemplate = async (templateId: string) => {
    if (!user) return;
    
    try {
      // Remove template from state
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      
      toast({
        title: 'Success',
        description: 'Email template deleted successfully',
      });
      
      if (selectedTemplate?.id === templateId) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting email template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete email template',
        variant: 'destructive',
      });
    }
  };
  
  const selectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateSubject(template.subject);
    setTemplateBody(template.body);
    setTemplateType(template.type);
  };
  
  const resetForm = () => {
    setSelectedTemplate(null);
    setTemplateName('');
    setTemplateSubject('');
    setTemplateBody('');
    setTemplateType('general');
  };
  
  const sendTestEmail = async () => {
    if (!user || !templateSubject || !templateBody) {
      toast({
        title: 'Validation Error',
        description: 'Subject and body are required to send a test email',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      toast({
        title: 'Info',
        description: 'Test email functionality is currently unavailable in demo mode',
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test email',
        variant: 'destructive',
      });
    }
  };
  
  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>Please sign in to manage email templates</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-red-600" />
            <CardTitle>Email Templates</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetForm}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Template
          </Button>
        </div>
        <CardDescription>
          Create and manage email notification templates
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs defaultValue="editor" className="h-full flex flex-col">
          <div className="px-4 pt-2 border-b">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="editor">Template Editor</TabsTrigger>
              <TabsTrigger value="templates">All Templates</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="editor" className="flex-1 overflow-auto p-4 mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input 
                    id="template-name" 
                    value={templateName} 
                    onChange={e => setTemplateName(e.target.value)}
                    placeholder="e.g., Welcome Email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-type">Template Type</Label>
                  <Select value={templateType} onValueChange={setTemplateType}>
                    <SelectTrigger id="template-type">
                      <SelectValue placeholder="Select template type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="welcome">Welcome</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-subject">Email Subject</Label>
                <Input 
                  id="template-subject" 
                  value={templateSubject} 
                  onChange={e => setTemplateSubject(e.target.value)}
                  placeholder="Enter email subject"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-body">Email Body</Label>
                <div className="border rounded-md p-2 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-2">
                    Available variables: {'{name}'}, {'{organization}'}, {'{date}'}, {'{link}'}
                  </p>
                </div>
                <Textarea 
                  id="template-body" 
                  value={templateBody} 
                  onChange={e => setTemplateBody(e.target.value)}
                  placeholder="Enter email content..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <div className="space-x-2">
                  <Button 
                    variant="outline"
                    onClick={resetForm}
                    disabled={savingTemplate}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={sendTestEmail}
                    disabled={savingTemplate || !templateBody || !templateSubject}
                  >
                    Send Test Email
                  </Button>
                </div>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={selectedTemplate ? updateTemplate : createTemplate}
                  disabled={savingTemplate || !templateName || !templateSubject || !templateBody}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {selectedTemplate ? 'Update Template' : 'Save Template'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="flex-1 overflow-auto p-4 mt-0">
            {loading ? (
              <div className="flex justify-center p-4">Loading templates...</div>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <FileText className="h-12 w-12 text-gray-300 mb-2" />
                <p>No templates found</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    resetForm();
                    document.querySelector('[data-value="editor"]')?.click();
                  }}
                >
                  Create Your First Template
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map(template => (
                  <div 
                    key={template.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center">
                          <span className="mr-2">{template.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {template.type}
                          </Badge>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date(template.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-900 h-8 w-8 p-0"
                          onClick={() => selectTemplate(template)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                          onClick={() => deleteTemplate(template.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Create a Badge component locally since it wasn't imported
const Badge = ({
  variant = "default",
  className,
  children,
  ...props
}: {
  variant?: "default" | "secondary" | "destructive",
  className?: string,
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-gray-100 text-gray-800";
      case "destructive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-800 text-white";
    }
  };
  
  return (
    <div 
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getVariantClasses()} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default EmailTemplateEditor;
