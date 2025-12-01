import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  MessageSquare, 
  Book, 
  Video, 
  FileText, 
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpSupport = () => {
  const navigate = useNavigate();

  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      action: 'Start Chat',
      onClick: () => window.open('https://discord.com/channels/1119885301872070706/1280461670979993613', '_blank'),
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your queries via email',
      action: 'Send Email',
      onClick: () => window.location.href = 'mailto:support@clinibuilds.com',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us during business hours',
      action: 'Call Now',
      onClick: () => window.location.href = 'tel:+254700000000',
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Browse our comprehensive guides',
      action: 'View Docs',
      onClick: () => window.open('https://docs.lovable.dev/', '_blank'),
    },
  ];

  const quickGuides = [
    {
      icon: Video,
      title: 'Getting Started',
      description: 'Learn the basics of using CliniBuilds platform',
    },
    {
      icon: FileText,
      title: 'Equipment Management',
      description: 'How to manage and track your equipment',
    },
    {
      icon: FileText,
      title: 'Order Processing',
      description: 'Guide to placing and managing orders',
    },
    {
      icon: FileText,
      title: 'Billing & Payments',
      description: 'Understanding invoices and payment methods',
    },
  ];

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Navigate to the Products or Equipment section, select your items, and click "Add to Cart". Then proceed to checkout to complete your order.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards, debit cards, bank transfers, and mobile money payments (M-Pesa).',
    },
    {
      question: 'How can I track my equipment?',
      answer: 'Go to Equipment Tracking section to monitor the real-time status and location of your equipment.',
    },
    {
      question: 'Can I request financing for equipment?',
      answer: 'Yes! Visit the Financing section to explore financing options and calculate payment plans.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Help & Support</h1>
          </div>
          <p className="text-white/90 text-lg">
            We're here to help you get the most out of CliniBuilds
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Support Options */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#333333] mb-6">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={option.onClick}
              >
                <CardHeader>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                    <option.icon className="h-6 w-6 text-[#E02020]" />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-[#E02020] hover:bg-[#c01c1c] text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      option.onClick();
                    }}
                  >
                    {option.action}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#333333] mb-6">Quick Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickGuides.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <guide.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base">{guide.title}</CardTitle>
                  <CardDescription className="text-sm">{guide.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-bold text-[#333333] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-[#333333]">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Additional Help */}
        <Card className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 border-[#E02020]">
          <CardHeader>
            <CardTitle className="text-[#E02020]">Still Need Help?</CardTitle>
            <CardDescription>
              Our support team is available Monday to Friday, 8:00 AM - 6:00 PM EAT
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button 
              variant="outline"
              className="border-[#E02020] text-[#E02020] hover:bg-red-50"
              onClick={() => navigate('/profile')}
            >
              View Your Tickets
            </Button>
            <Button 
              className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
              onClick={() => window.open('https://discord.com/channels/1119885301872070706/1280461670979993613', '_blank')}
            >
              Join Community
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupport;