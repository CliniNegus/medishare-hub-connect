
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const ZohoIntegration = () => {
  const { toast } = useToast();
  const [booksApiKey, setBooksApiKey] = useState('');
  const [crmApiKey, setCrmApiKey] = useState('');
  const [booksWebhookUrl, setBooksWebhookUrl] = useState('');
  const [crmWebhookUrl, setCrmWebhookUrl] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleConnectBooks = async () => {
    setConnecting(true);
    try {
      // This is a placeholder for the actual implementation
      // In a real implementation, you would use the Zoho Books API to connect
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Zoho Books connected successfully.",
        });
        setConnecting(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to Zoho Books.",
        variant: "destructive",
      });
      setConnecting(false);
    }
  };

  const handleConnectCRM = async () => {
    setConnecting(true);
    try {
      // This is a placeholder for the actual implementation
      // In a real implementation, you would use the Zoho CRM API to connect
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Zoho CRM connected successfully.",
        });
        setConnecting(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to Zoho CRM.",
        variant: "destructive",
      });
      setConnecting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Zoho Integration</CardTitle>
        <CardDescription>Connect your Zoho Books and CRM accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="books">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="books">Zoho Books</TabsTrigger>
            <TabsTrigger value="crm">Zoho CRM</TabsTrigger>
          </TabsList>
          <TabsContent value="books" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="books-api-key">API Key</Label>
              <Input 
                id="books-api-key" 
                value={booksApiKey} 
                onChange={(e) => setBooksApiKey(e.target.value)}
                placeholder="Enter your Zoho Books API key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="books-webhook">Webhook URL (Optional)</Label>
              <Input 
                id="books-webhook" 
                value={booksWebhookUrl} 
                onChange={(e) => setBooksWebhookUrl(e.target.value)}
                placeholder="Enter webhook URL for notifications"
              />
            </div>
            <Button 
              onClick={handleConnectBooks} 
              disabled={!booksApiKey || connecting}
              className="w-full"
            >
              {connecting ? "Connecting..." : "Connect Zoho Books"}
            </Button>
          </TabsContent>
          <TabsContent value="crm" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="crm-api-key">API Key</Label>
              <Input 
                id="crm-api-key" 
                value={crmApiKey} 
                onChange={(e) => setCrmApiKey(e.target.value)}
                placeholder="Enter your Zoho CRM API key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crm-webhook">Webhook URL (Optional)</Label>
              <Input 
                id="crm-webhook" 
                value={crmWebhookUrl} 
                onChange={(e) => setCrmWebhookUrl(e.target.value)}
                placeholder="Enter webhook URL for notifications"
              />
            </div>
            <Button 
              onClick={handleConnectCRM} 
              disabled={!crmApiKey || connecting}
              className="w-full"
            >
              {connecting ? "Connecting..." : "Connect Zoho CRM"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between flex-col sm:flex-row space-y-2 sm:space-y-0">
        <p className="text-sm text-muted-foreground">
          You'll need to create API keys in your Zoho account first
        </p>
        <Button variant="outline" onClick={() => window.open('https://www.zoho.com/developer/api/', '_blank')}>
          Zoho API Documentation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZohoIntegration;
