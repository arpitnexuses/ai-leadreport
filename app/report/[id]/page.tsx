"use client";

import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import {
  Building2,
  Mail,
  Phone,
  Linkedin,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  Video,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
// import { MeetingDetailsForm } from "@/components/ui/input";

interface LeadData {
  name: string;
  position: string;
  companyName: string;
  photo: string | null;
  contactDetails: {
    email: string;
    phone: string;
    linkedin: string;
  };
  companyDetails: {
    industry: string;
    employees: string;
    headquarters: string;
    website: string;
  };
  leadScoring: {
    rating: string;
    qualificationCriteria: Record<string, string>;
  };
}

interface ApolloResponse {
  person: {
    name?: string;
    title?: string;
    photo_url?: string;
    phone_number?: string;
    linkedin_url?: string;
    email?: string;
    organization?: {
      name?: string;
      website_url?: string;
      industry?: string;
      employee_count?: string;
      location?: {
        city?: string;
        state?: string;
        country?: string;
      };
      description?: string;
    };
  };
}

interface LeadReport {
  _id: string;
  email: string;
  apolloData: ApolloResponse;
  report: string;
  leadData: LeadData;
  createdAt: Date;
  status: string;
  error?: string;
  meetingDate?: string;
  meetingTime?: string;
  meetingPlatform?: string;
  problemPitch?: string;
}

const ReportLoader = dynamic(
  () => import("./ReportLoader").then((mod) => mod.ReportLoader),
  { ssr: false }
);

export default function ReportPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<LeadReport | null>(null);

  const handleReportReady = (loadedReport: LeadReport) => {
    setReport(loadedReport);
  };

  if (!report) {
    return (
      <ReportLoader reportId={params.id} onReportReady={handleReportReady} />
    );
  }

  const leadData = report.leadData;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-white shadow-lg">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-8 rounded-t-xl">
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
              <div className="flex items-center justify-center">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl bg-white/5 backdrop-blur-sm">
                  <Image
                    src={leadData.photo || `/placeholder.png`}
                    alt={leadData.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                    priority
                    sizes="(max-width: 128px) 100vw, 128px"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {leadData.name}
                </h1>
                <p className="text-lg md:text-xl text-blue-100 mt-2">
                  {leadData.position}
                </p>
                <p className="text-base md:text-lg text-blue-200 mt-1">
                  {leadData.companyName}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 md:mt-6">
                  {leadData.contactDetails.email && (
                    <a
                      href={`mailto:${leadData.contactDetails.email}`}
                      className="flex items-center justify-center md:justify-start gap-2 text-sm text-blue-100 hover:text-white"
                    >
                      <Mail className="h-4 w-4" />
                      {leadData.contactDetails.email}
                    </a>
                  )}
                  {leadData.contactDetails.phone && (
                    <a
                      href={`tel:${leadData.contactDetails.phone}`}
                      className="flex items-center justify-center md:justify-start gap-2 text-sm text-blue-100 hover:text-white"
                    >
                      <Phone className="h-4 w-4" />
                      {leadData.contactDetails.phone}
                    </a>
                  )}
                  {leadData.contactDetails.linkedin && (
                    <a
                      href={leadData.contactDetails.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center md:justify-start gap-2 text-sm text-blue-100 hover:text-white"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn Profile
                    </a>
                  )}
                  {leadData.companyDetails.website && (
                    <a
                      href={leadData.companyDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center md:justify-start gap-2 text-sm text-blue-100 hover:text-white"
                    >
                      <Globe className="h-4 w-4" />
                      Company Website
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 w-full md:min-w-[200px] md:w-auto mt-4 md:mt-0">
                <h3 className="text-lg font-semibold mb-2 text-center md:text-left">
                  Lead Score
                </h3>
                <div className="text-2xl font-bold mb-3 text-center md:text-left">
                  {leadData.leadScoring.rating}
                </div>
                <div className="space-y-1">
                  {(
                    Object.entries(
                      leadData.leadScoring.qualificationCriteria
                    ) as [string, string][]
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-blue-100">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span
                        className={`font-medium ${
                          value === "YES" ? "text-green-300" : "text-red-300"
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Section */}
          <div className="p-8 border-b">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="font-medium">
                    {leadData.companyDetails.industry}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Company Size</p>
                  <p className="font-medium">
                    {leadData.companyDetails.employees} employees
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Headquarters</p>
                  <p className="font-medium">
                    {leadData.companyDetails.headquarters}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    About Lead
                  </h3>
                  <div className="prose prose-blue prose-sm">
                    <ReactMarkdown>{`
### Professional Background
${leadData.name} currently serves as ${leadData.position} at ${leadData.companyName}. With their role in ${leadData.companyDetails.industry}, they bring valuable expertise to the organization.

### Decision Making Authority
- Position Level: ${leadData.position}
- Decision Maker: ${leadData.leadScoring.qualificationCriteria.decisionMaker}
- Budget Authority: ${leadData.leadScoring.qualificationCriteria.haveBudget}

### Current Focus
- Industry: ${leadData.companyDetails.industry}
- Company Scale: ${leadData.companyDetails.employees} employees
- Location: ${leadData.companyDetails.headquarters}
                    `}</ReactMarkdown>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 min-h-[465px]">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Analysis
                  </h3>
                  <div className="prose prose-blue prose-sm">
                    <ReactMarkdown>{`
### Company Overview
${leadData.companyName} operates in the ${leadData.companyDetails.industry} sector, employing ${leadData.companyDetails.employees} people. Based in ${leadData.companyDetails.headquarters}, they have established a significant presence in their market.

### Market Position
- Industry: ${leadData.companyDetails.industry}
- Scale: ${leadData.companyDetails.employees} employees
- Location: ${leadData.companyDetails.headquarters}
                    `}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Right Column */}

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Meeting Details
                  </h3>
                  <div className="prose prose-blue prose-sm">
                    {report.meetingDate && report.meetingTime ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div>
                            <span className="font-medium">
                              {new Date(report.meetingDate)
                                .toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                                .replace(/(\d+)(?=(st|nd|rd|th))/, (match) => {
                                  const num = parseInt(match);
                                  const suffix = ["th", "st", "nd", "rd"][
                                    num % 10 > 3 ||
                                    (num % 100) - (num % 10) === 10
                                      ? 0
                                      : num % 10
                                  ];
                                  return `${num}${suffix}`;
                                })}
                            </span>
                            <span className="mx-2">at</span>
                            <span className="font-medium">
                              {new Date(
                                `2000-01-01T${report.meetingTime}`
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </div>

                        {report.meetingPlatform && (
                          <div className="flex items-center gap-2 text-blue-800">
                            <Video className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">
                              {report.meetingPlatform}
                            </span>
                          </div>
                        )}

                        {report.problemPitch && (
                          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-800 font-semibold mb-2">
                              Problem / Pitch:
                            </p>
                            <p className="text-sm text-blue-700 leading-relaxed whitespace-pre-wrap">
                              {report.problemPitch}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No meeting scheduled yet
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Engagement Strategy
                  </h3>
                  <div className="prose prose-blue prose-sm">
                    <ReactMarkdown>{`
### Recommended Approach
1. **Initial Contact**: Reach out via ${leadData.contactDetails.email}
2. **LinkedIn Connection**: Connect on [LinkedIn](${leadData.contactDetails.linkedin})
3. **Follow-up Call**: Schedule using ${leadData.contactDetails.phone}

### Key Talking Points
- Industry-specific solutions
- Scalable solutions for ${leadData.companyDetails.employees}+ employee organizations
- Regional expertise in ${leadData.companyDetails.headquarters}
                    `}</ReactMarkdown>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Opportunity Assessment
                  </h3>
                  <div className="prose prose-blue prose-sm">
                    <ReactMarkdown>{`
### Lead Qualification
- **Overall Score**: ${leadData.leadScoring.rating}
- **Decision Authority**: ${leadData.leadScoring.qualificationCriteria.decisionMaker}
- **Budget Available**: ${leadData.leadScoring.qualificationCriteria.haveBudget}
- **Solution Fit**: ${leadData.leadScoring.qualificationCriteria.viewedSolutionDeck}
- **Identified Need**: ${leadData.leadScoring.qualificationCriteria.need}

                    `}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
