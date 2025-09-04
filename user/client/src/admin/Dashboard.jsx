import { useState, useEffect, useCallback } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Clock, ArrowUpRight, RefreshCw, Calendar, Info, ExternalLink } from "lucide-react"
import { axiosInstance } from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Link } from "react-router-dom"

// Routes for different request types
const REQUEST_ROUTES = {
  pending: "/userrequests",
  accepted: "/manage-alumni",
  rejected: "/rejected-requests"
}

const AdminPage = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [timeframe, setTimeframe] = useState("all")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [activeView, setActiveView] = useState("charts")  // Changed default from "cards" to "charts"

  const COLORS = ["#f59e0b", "#10b981", "#ef4444"]
  const STATUS_COLORS = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  }

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true)
      const response = await axiosInstance.get(`/links/dashboard-stats${timeframe !== 'all' ? `?timeframe=${timeframe}` : ''}`)
      setData(response.data.stats)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [timeframe])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const DashboardHeader = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Link Request Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and analyze all connection requests in the system
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={fetchData} 
          disabled={refreshing}
          className="gap-2"
        >
          {refreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>
    </div>
  )

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="border-l-4 border-gray-200">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="h-10 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <Card className="w-full border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Error Loading Dashboard
            </CardTitle>
            <CardDescription>An error occurred while loading data</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-40 text-red-500 gap-4">
            <p>{error}</p>
            <Button variant="outline" onClick={fetchData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalRequests = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <div className="bg-muted/40 p-4 rounded-lg flex items-center gap-3 text-sm">
        <Info className="h-5 w-5 text-blue-500" />
        <div>
          <span className="font-medium">Last updated:</span> {format(lastUpdated, 'MMMM dd, yyyy HH:mm:ss')} 
          <Badge variant="outline" className="ml-2 text-xs">
            {timeframe === 'all' ? 'All time' : 
             timeframe === 'today' ? 'Today' : 
             timeframe === 'week' ? 'This week' : 
             timeframe === 'month' ? 'This month' :
             timeframe === 'year' ? 'This year' : 'All time'}
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="charts" value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.map((item) => (
              <Card 
                key={item.name} 
                className={`border-l-4 ${STATUS_COLORS[item.status.toLowerCase()]} hover:shadow-md transition-shadow duration-300`}
              >
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
                        {totalRequests === 0 ? '0' : ((item.value / totalRequests) * 100).toFixed(1)}% of total
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
                <CardFooter className="pt-0 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {timeframe === 'all' ? 'All time' : 
                     timeframe === 'today' ? 'Today' : 
                     timeframe === 'week' ? 'This week' : 
                     timeframe === 'month' ? 'This month' :
                     timeframe === 'year' ? 'This year' : 'All time'}
                  </div>
                  <Button variant="ghost" size="sm" asChild className="gap-1">
                    <Link to={REQUEST_ROUTES[item.status.toLowerCase()]}>
                      <span>Manage</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-6">
          <div className="flex justify-end space-x-2 mb-2">
            {data.map((item) => (
              <Button 
                key={`chart-link-${item.status}`}
                variant="outline" 
                size="sm"
                asChild
                className={`gap-1 border-${item.status === "pending" ? "amber" : item.status === "accepted" ? "emerald" : "red"}-200`}
              >
                <Link to={REQUEST_ROUTES[item.status.toLowerCase()]}>
                  <StatusIcon status={item.status} />
                  <span>View {item.name}</span>
                </Link>
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Pie Chart Distribution</CardTitle>
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
                        formatter={(value) => <span className="text-gray-700 dark:text-gray-300">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Bar Chart Comparison</CardTitle>
                <CardDescription>Compare request counts by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Count">
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-6">
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
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.value}</span>
                      <Badge variant="outline">
                        {totalRequests === 0 ? '0' : ((item.value / totalRequests) * 100).toFixed(1)}%
                      </Badge>
                      <Button variant="ghost" size="sm" asChild className="ml-2">
                        <Link to={REQUEST_ROUTES[item.status.toLowerCase()]}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 text-sm text-muted-foreground">
              Data shown for {timeframe === 'all' ? 'all time' : 
                timeframe === 'today' ? 'today' : 
                timeframe === 'week' ? 'this week' : 
                timeframe === 'month' ? 'this month' :
                timeframe === 'year' ? 'this year' : 'all time'}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage different types of requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.map((item) => (
                  <Button 
                    key={`action-${item.status}`}
                    variant="outline" 
                    className="h-auto py-6 flex flex-col items-center gap-3 border-2"
                    asChild
                  >
                    <Link to={REQUEST_ROUTES[item.status.toLowerCase()]}>
                      <StatusIcon status={item.status} className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-medium">Manage {item.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">{item.value} requests</div>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Insights</CardTitle>
              <CardDescription>Key metrics and insights from your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Connections</h3>
                  <p className="text-2xl font-bold">
                    {data.find(item => item.status === "accepted")?.value || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalRequests > 0 ? 
                      `${((data.find(item => item.status === "accepted")?.value || 0) / totalRequests * 100).toFixed(1)}% connection rate` : 
                      'No requests yet'}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Pending Rate</h3>
                  <p className="text-2xl font-bold">
                    {totalRequests > 0 ? 
                      `${((data.find(item => item.status === "pending")?.value || 0) / totalRequests * 100).toFixed(1)}%` : 
                      '0%'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.find(item => item.status === "pending")?.value || 0} requests awaiting action
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Rejection Rate</h3>
                  <p className="text-2xl font-bold">
                    {totalRequests > 0 ? 
                      `${((data.find(item => item.status === "rejected")?.value || 0) / totalRequests * 100).toFixed(1)}%` : 
                      '0%'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.find(item => item.status === "rejected")?.value || 0} requests were rejected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

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
    const totalRequests = payload[0].payload.value + (payload[1]?.payload.value || 0) + (payload[2]?.payload.value || 0)
    
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <StatusIcon status={status} />
          <p className="font-medium">{name}</p>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Count: {value}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {totalRequests > 0 ? `${((value / totalRequests) * 100).toFixed(1)}% of total` : '0% of total'}
        </p>
      </div>
    )
  }
  return null
}

export default AdminPage

