
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, FileText } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" className="text-[#333333] hover:text-[#E02020]">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#E02020]" />
              <span className="font-semibold text-[#333333]">Privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-16 bg-gradient-to-br from-[#E02020]/5 via-white to-[#E02020]/5">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lock className="h-12 w-12 text-[#E02020]" />
            <h1 className="text-4xl font-bold text-[#333333]">Privacy Policy</h1>
          </div>
          <p className="text-lg text-[#333333]/70 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-[#333333]/50 mt-4">
            Effective Date: [Effective Date] | Last Updated: [Last Updated Date]
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                  Introduction
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>
                    At [Company Name] ("we," "our," "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our medical equipment management platform.
                  </p>
                  <p>
                    By using our Service, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, please do not use our Service.
                  </p>
                </div>
              </section>

              {/* Section 1 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                  Information We Collect
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p><strong>Personal Information:</strong> We may collect personally identifiable information, including:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Name and contact information (email, phone, address)</li>
                    <li>Professional credentials and organization details</li>
                    <li>Account login credentials</li>
                    <li>Payment and billing information</li>
                    <li>Profile information and preferences</li>
                  </ul>
                  <p><strong>Usage Data:</strong> We automatically collect information about how you use our Service:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage patterns and interaction data</li>
                    <li>Location data (if enabled)</li>
                    <li>Log files and analytics data</li>
                  </ul>
                  <p><strong>Equipment and Transaction Data:</strong> Information related to your use of our platform:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Equipment listings, purchases, and bookings</li>
                    <li>Transaction history and payment records</li>
                    <li>Communication records with other users</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                  How We Use Your Information
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>We use the collected information for various purposes:</p>
                  <p><strong>Service Provision:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Creating and managing your account</li>
                    <li>Processing transactions and payments</li>
                    <li>Facilitating equipment bookings and purchases</li>
                    <li>Providing customer support</li>
                  </ul>
                  <p><strong>Communication:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Sending service-related notifications</li>
                    <li>Responding to inquiries and support requests</li>
                    <li>Sending marketing communications (with consent)</li>
                  </ul>
                  <p><strong>Analytics and Improvement:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Analyzing usage patterns to improve our Service</li>
                    <li>Conducting research and analytics</li>
                    <li>Detecting and preventing fraud</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
                  Data Storage and Protection
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p><strong>Security Measures:</strong> We implement appropriate technical and organizational measures to protect your personal information:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication measures</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p><strong>Data Retention:</strong> We retain your personal information only as long as necessary for the purposes outlined in this policy or as required by law.</p>
                  <p><strong>International Transfers:</strong> Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</span>
                  Third-Party Services
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>We may use third-party services that collect, monitor, and analyze information:</p>
                  <p><strong>Analytics Services:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Google Analytics for website usage analysis</li>
                    <li>Performance monitoring tools</li>
                    <li>User behavior analytics platforms</li>
                  </ul>
                  <p><strong>Payment Processors:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Paystack for payment processing</li>
                    <li>Banking and financial service providers</li>
                  </ul>
                  <p><strong>Communication Services:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Email service providers</li>
                    <li>SMS and notification services</li>
                    <li>Customer support platforms</li>
                  </ul>
                  <p>These third parties have their own privacy policies addressing how they use such information.</p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">6</span>
                  Cookies and Tracking Technologies
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information:</p>
                  <p><strong>Types of Cookies:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Essential Cookies:</strong> Necessary for the Service to function properly</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Service</li>
                    <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  </ul>
                  <p><strong>Managing Cookies:</strong> You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">7</span>
                  Your Privacy Rights
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>You have certain rights regarding your personal information:</p>
                  <p><strong>Access and Portability:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Request access to your personal information</li>
                    <li>Receive a copy of your data in a portable format</li>
                  </ul>
                  <p><strong>Correction and Updates:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Update or correct inaccurate information</li>
                    <li>Complete incomplete personal information</li>
                  </ul>
                  <p><strong>Deletion:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Request deletion of your personal information</li>
                    <li>Account closure and data removal</li>
                  </ul>
                  <p><strong>Objection and Restriction:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Object to processing of your personal information</li>
                    <li>Request restriction of processing under certain circumstances</li>
                  </ul>
                  <p>To exercise these rights, please contact us using the information provided below.</p>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">8</span>
                  Changes to Privacy Policy
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                  </p>
                  <p>
                    We will let you know via email and/or a prominent notice on our Service prior to the change becoming effective and update the "Effective Date" at the top of this Privacy Policy.
                  </p>
                  <p>
                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                  </p>
                </div>
              </section>

              {/* Contact Section */}
              <section className="mt-12 p-6 bg-gradient-to-r from-[#E02020]/5 to-[#E02020]/10 rounded-xl">
                <h3 className="text-xl font-bold text-[#333333] mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#E02020]" />
                  Contact Us About Privacy
                </h3>
                <p className="text-[#333333]/80 mb-3">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-1 text-[#333333]/80">
                  <p><strong>Privacy Officer:</strong> [Privacy Officer Name]</p>
                  <p><strong>Email:</strong> [Privacy Email Address]</p>
                  <p><strong>Address:</strong> [Company Address]</p>
                  <p><strong>Phone:</strong> [Phone Number]</p>
                </div>
                <p className="text-sm text-[#333333]/60 mt-4">
                  We aim to respond to all privacy-related inquiries within 30 days.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button asChild variant="outline" className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white">
              <Link to="/terms-of-service" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Terms of Service
              </Link>
            </Button>
            <Button asChild className="bg-[#E02020] hover:bg-[#E02020]/90">
              <Link to="/">Return to CliniBuilds</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
