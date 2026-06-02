import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Eye, Check, X } from "lucide-react"

async function getReports() {
  return prisma.report.findMany({
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      listing: { select: { id: true, title: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}

export default async function AdminReportsPage() {
  const reports = await getReports()

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reports & Moderation</h1>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Report</th>
              <th className="text-left p-3 font-medium">Reporter</th>
              <th className="text-left p-3 font-medium">Listing</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report: any) => (
              <tr key={report.id} className="border-t hover:bg-muted/30">
                <td className="p-3">
                  <div className="font-medium">{report.reason}</div>
                  {report.details && (
                    <div className="text-xs text-muted-foreground mt-1">{report.details}</div>
                  )}
                </td>
                <td className="p-3">
                  <div className="text-sm">{report.reporter.name || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">{report.reporter.email}</div>
                </td>
                <td className="p-3">
                  {report.listing ? (
                    <Link href={`/listing/${report.listing.id}`} className="text-sm hover:underline">
                      {report.listing.title}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Deleted</span>
                  )}
                </td>
                <td className="p-3">
                  <Badge variant={
                    report.status === "PENDING" ? "secondary" :
                    report.status === "REVIEWING" ? "default" :
                    report.status === "RESOLVED" ? "default" : "outline"
                  }>
                    {report.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground">
                  {formatDate(report.createdAt)}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {report.listing && (
                      <Link href={`/listing/${report.listing.id}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="sm" className="text-green-600">
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
