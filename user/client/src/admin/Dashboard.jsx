import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Clock, ArrowUpRight } from "lucide-react"
import { axiosInstance } from "@/lib/axios"

const AdminPage = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Updated colors with better contrast and professional look
  const COLORS = ["#f59e0b", "#10b981", "#ef4444"]
  const STATUS_COLORS = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the dedicated dashboard-stats endpoint
        const response = await axiosInstance.get("/links/dashboard-stats")
        
        // Use the stats array directly from the response
        setData(response.data.stats)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Link Request Dashboard</CardTitle>
            <CardDescription>Loading statistics...</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Link Request Dashboard</CardTitle>
          <CardDescription>An error occurred while loading data</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40 text-red-500">Error: {error}</CardContent>
      </Card>
    )
  }

  const totalRequests = data.reduce((sum, item) => sum + item.value, 0)

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-600" />
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, status } = payload[0].payload
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <StatusIcon status={status} />
            <p className="font-medium">{name}</p>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Count: {value}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {((value / totalRequests) * 100).toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item) => (
          <Card key={item.name} className={`border-l-4 ${STATUS_COLORS[item.status.toLowerCase()]}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <StatusIcon status={item.status} />
                {item.name} Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold">{item.value}</p>
                  <p className="text-sm text-muted-foreground">
                    {((item.value / totalRequests) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full ${item.status === "pending" ? "bg-amber-100" : item.status === "accepted" ? "bg-emerald-100" : "bg-red-100"}`}
                >
                  <ArrowUpRight
                    className={`h-5 w-5 ${item.status === "pending" ? "text-amber-600" : item.status === "accepted" ? "text-emerald-600" : "text-red-600"}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Link Request Distribution</CardTitle>
          <CardDescription>Visual breakdown of all link requests by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                      className="hover:opacity-80 transition-opacity"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => <span className="text-gray-700 dark:text-gray-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Summary</CardTitle>
          <CardDescription>Overview of all link requests in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total Requests</span>
              <span className="font-bold">{totalRequests}</span>
            </div>
            {data.map((item) => (
              <div key={`summary-${item.name}`} className="flex justify-between py-2 border-b last:border-0">
                <span className="flex items-center gap-2">
                  <StatusIcon status={item.status} />
                  {item.name}
                </span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPage

