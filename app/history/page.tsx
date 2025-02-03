import { MongoClient } from "mongodb"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const MONGODB_URI = process.env.MONGODB_URI!
const client = new MongoClient(MONGODB_URI)
const db = client.db("lead-reports")
const reports = db.collection("reports")

export default async function HistoryPage() {
  const reportsList = await reports.find({}).sort({ createdAt: -1 }).toArray()

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report History</CardTitle>
              <CardDescription>View all generated lead reports</CardDescription>
            </div>
            <Link href="/">
              <Button>Generate New Report</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportsList.map((report) => (
              <Link key={report._id.toString()} href={`/report/${report._id}`} className="block">
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{report.email}</p>
                      <p className="text-sm text-muted-foreground">{new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button variant="ghost">View Report</Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

