'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { initiateReport } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Search, Mail, ChevronRight, Users, LineChart } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)

  async function handleGenerateReport(formData: FormData) {
    setIsLoading(true)
    startTransition(async () => {
      try {
        const result = await initiateReport(formData)
        if (result.success) {
          router.push(`/report/${result.reportId}`)
        }
      } catch (error) {
        console.error('Failed to generate report:', error)
        setIsLoading(false)
      }
    })
  }

  return (
    <>
      {(isLoading || isPending) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
            <div className="space-y-2 text-center mt-4">
              <h3 className="text-xl font-semibold text-gray-800">Generating Lead Report</h3>
              <p className="text-sm text-gray-500">
                Please wait while we analyze the data and generate your report...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900">
        {/* Navigation */}
        <nav className="border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800 fixed w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                  LeadRepo
                </span>
              </div>
              <div>
                <Button variant="outline" className="mr-2">Sign In</Button>
                <Button>Get Started</Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                    Generate Professional <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Lead Reports</span> in Seconds
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Transform email addresses into comprehensive lead reports with verified data, insights, and engagement strategies.
                  </p>
                </div>

                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl">
                  <CardContent className="p-6">
                    <form action={handleGenerateReport} className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input 
                          type="email" 
                          name="email" 
                          placeholder="Enter business email address" 
                          required 
                          disabled={isLoading || isPending}
                          className="pl-12 h-14 text-lg rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-900"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                        disabled={isLoading || isPending}
                      >
                        {(isLoading || isPending) ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Generating Report...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <span>Generate Report</span>
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white">10M+</p>
                      <p className="text-gray-600 dark:text-gray-400">Verified Contacts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <LineChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white">99%</p>
                      <p className="text-gray-600 dark:text-gray-400">Data Accuracy</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl"></div>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-3xl bg-gradient-to-tr from-blue-600 to-blue-800 p-1">
                    <div className="h-full w-full rounded-[calc(1.5rem-2px)] bg-white dark:bg-gray-900 p-8">
                      <div className="space-y-6">
                        <div className="h-12 w-24 rounded-lg bg-blue-100 dark:bg-blue-900/50"></div>
                        <div className="space-y-4">
                          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-20 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
                          <div className="h-20 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-100 dark:border-blue-800">
                <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Instant Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">Get detailed lead information and analysis powered by AI in seconds</p>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-100 dark:border-purple-800">
                <div className="h-12 w-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Verified Data</h3>
                <p className="text-gray-600 dark:text-gray-300">Access accurate contact information and professional profiles</p>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 border border-indigo-100 dark:border-indigo-800">
                <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-6">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Smart Insights</h3>
                <p className="text-gray-600 dark:text-gray-300">Get actionable insights and engagement strategies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

