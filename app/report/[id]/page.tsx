import { notFound } from "next/navigation"
import { MongoClient, ObjectId } from "mongodb"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import { Building2, Mail, Phone, Linkedin, Globe, MapPin, Users, Briefcase } from 'lucide-react'
import { ReportLoader } from "./ReportLoader"

interface ApolloOrganization {
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
}

interface ApolloPerson {
  name?: string;
  title?: string;
  photo_url?: string;
  phone_number?: string;
  linkedin_url?: string;
  email?: string;
  facebook_url?: string;
  organization?: ApolloOrganization;
}

interface ApolloResponse {
  person: ApolloPerson;
}

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
    qualificationCriteria: {
      [key: string]: string;
    };
  };
}

interface Report {
  _id: ObjectId;
  email: string;
  apolloData: ApolloResponse;
  report: string;
  leadData: LeadData;
  createdAt: Date;
  status: string;
  error?: string;
}

export default async function ReportPage({ params }: { params: { id: string } }) {
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable")
  }

  const client = new MongoClient(MONGODB_URI)
  const db = client.db("lead-reports")
  
  try {
    const report = await db.collection<Report>("reports").findOne({ _id: new ObjectId(params.id) })
    if (!report) notFound()

    if (report.status === 'processing') {
      return <ReportLoader reportId={params.id} />
    }

    const leadData = report.leadData

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-end mb-4 gap-2">
            <Link href="/">
              <Button variant="outline">New Report</Button>
            </Link>
            <Link href="/history">
              <Button variant="secondary">View History</Button>
            </Link>
          </div>
          
          <Card className="bg-white shadow-lg">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-t-xl">
              <div className="flex items-start gap-8">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl bg-white/5 backdrop-blur-sm">
                  <Image
                    src={leadData.photo || `/placeholder.png`}
                    alt={leadData.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                    priority
                    sizes="(max-width: 128px) 100vw, 128px"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{leadData.name}</h1>
                  <p className="text-xl text-blue-100 mt-2">{leadData.position}</p>
                  <p className="text-lg text-blue-200 mt-1">{leadData.companyName}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {leadData.contactDetails.email && (
                      <a href={`mailto:${leadData.contactDetails.email}`} 
                         className="flex items-center gap-2 text-sm text-blue-100 hover:text-white">
                        <Mail className="h-4 w-4" />
                        {leadData.contactDetails.email}
                      </a>
                    )}
                    {leadData.contactDetails.phone && (
                      <a href={`tel:${leadData.contactDetails.phone}`} 
                         className="flex items-center gap-2 text-sm text-blue-100 hover:text-white">
                        <Phone className="h-4 w-4" />
                        {leadData.contactDetails.phone}
                      </a>
                    )}
                    {leadData.contactDetails.linkedin && (
                      <a href={leadData.contactDetails.linkedin} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="flex items-center gap-2 text-sm text-blue-100 hover:text-white">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn Profile
                      </a>
                    )}
                    {leadData.companyDetails.website && (
                      <a href={leadData.companyDetails.website} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="flex items-center gap-2 text-sm text-blue-100 hover:text-white">
                        <Globe className="h-4 w-4" />
                        Company Website
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 min-w-[200px]">
                  <h3 className="text-lg font-semibold mb-2">Lead Score</h3>
                  <div className="text-2xl font-bold mb-3">{leadData.leadScoring.rating}</div>
                  <div className="space-y-1">
                    {Object.entries(leadData.leadScoring.qualificationCriteria).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="text-blue-100">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className={`font-medium ${value === 'YES' ? 'text-green-300' : 'text-red-300'}`}>
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
                    <p className="font-medium">{leadData.companyDetails.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Company Size</p>
                    <p className="font-medium">{leadData.companyDetails.employees} employees</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Headquarters</p>
                    <p className="font-medium">{leadData.companyDetails.headquarters}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{new Date(report.createdAt).toLocaleDateString()}</p>
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

                  <div className="bg-gray-50 rounded-lg p-6">
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

### Next Steps
1. Schedule initial discovery call
2. Share relevant case studies
3. Prepare customized solution presentation
4. Follow up within 48 hours
                      `}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  } catch {
    notFound()
  }
}

