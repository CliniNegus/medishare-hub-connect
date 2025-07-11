
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Scale, Shield } from "lucide-react";

const TermsOfService: React.FC = () => {
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
              <Scale className="h-5 w-5 text-[#E02020]" />
              <span className="font-semibold text-[#333333]">Legal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-16 bg-gradient-to-br from-[#E02020]/5 via-white to-[#E02020]/5">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FileText className="h-12 w-12 text-[#E02020]" />
            <h1 className="text-4xl font-bold text-[#333333]">Terms of Service</h1>
          </div>
          <p className="text-lg text-[#333333]/70 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform
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
              
              {/* Section 1 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                  Introduction and Acceptance
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>
                    Welcome to [Company Name] ("we," "our," "us"). These Terms of Service ("Terms") govern your use of our medical equipment management platform and related services (collectively, the "Service").
                  </p>
                  <p>
                    By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Service.
                  </p>
                  <p>
                    These Terms apply to all visitors, users, and others who access or use the Service, including hospitals, manufacturers, investors, and other healthcare professionals.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                  User Responsibilities and Account Requirements
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p><strong>Account Creation:</strong> You must provide accurate, complete, and current information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
                  <p><strong>User Conduct:</strong> You agree to use the Service in compliance with all applicable laws and regulations. You must not:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Impersonate any person or entity</li>
                    <li>Violate any local, state, national, or international law</li>
                    <li>Transmit any harmful, threatening, or inappropriate content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                  </ul>
                  <p><strong>Professional Use:</strong> Our platform is designed for professional healthcare use. Users must have appropriate qualifications and authority to engage in medical equipment transactions.</p>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                  Permitted and Prohibited Uses
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p><strong>Permitted Uses:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Browse and purchase medical equipment through our platform</li>
                    <li>Manage equipment inventory and tracking</li>
                    <li>Communicate with other verified users</li>
                    <li>Access analytics and reporting features</li>
                  </ul>
                  <p><strong>Prohibited Uses:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Using the Service for any unlawful purpose</li>
                    <li>Selling counterfeit or unapproved medical equipment</li>
                    <li>Reverse engineering or copying our software</li>
                    <li>Interfering with the proper functioning of the Service</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
                  Intellectual Property Rights
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>
                    The Service and its original content, features, and functionality are owned by [Company Name] and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without our prior written consent.
                  </p>
                  <p>
                    You retain ownership of any content you submit to the Service, but you grant us a worldwide, non-exclusive license to use, modify, and display such content in connection with the Service.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</span>
                  Termination of Service
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>
                    We may terminate or suspend your account and access to the Service immediately, without prior notice, if you breach these Terms or engage in conduct that we determine to be harmful to the Service or other users.
                  </p>
                  <p>
                    You may terminate your account at any time by contacting us at [Email Address]. Upon termination, your right to use the Service will cease immediately.
                  </p>
                  <p>
                    All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">6</span>
                  Limitation of Liability
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>
                    To the maximum extent permitted by applicable law, [Company Name] shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.
                  </p>
                  <p>
                    Our total liability to you for all claims arising out of or relating to the Service shall not exceed the amount you paid us in the twelve months preceding the claim.
                  </p>
                  <p>
                    We provide the Service "as is" and without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">7</span>
                  Governing Law and Jurisdiction
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
                  </p>
                  <p>
                    Any disputes arising out of or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of [Jurisdiction].
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <span className="bg-[#E02020] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">8</span>
                  Changes to Terms
                </h2>
                <div className="text-[#333333]/80 leading-relaxed space-y-4">
                  <p>
                    We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last Updated" date.
                  </p>
                  <p>
                    Your continued use of the Service after any changes constitutes acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using the Service.
                  </p>
                </div>
              </section>

              {/* Contact Section */}
              <section className="mt-12 p-6 bg-gradient-to-r from-[#E02020]/5 to-[#E02020]/10 rounded-xl">
                <h3 className="text-xl font-bold text-[#333333] mb-3">Contact Information</h3>
                <p className="text-[#333333]/80">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-3 space-y-1 text-[#333333]/80">
                  <p>Email: [Email Address]</p>
                  <p>Address: [Company Address]</p>
                  <p>Phone: [Phone Number]</p>
                </div>
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
              <Link to="/privacy-policy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy Policy
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

export default TermsOfService;
