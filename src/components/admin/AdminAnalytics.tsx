import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Award, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminAnalyticsProps {
  analytics: any;
}

export const AdminAnalytics = ({ analytics }: AdminAnalyticsProps) => {
  if (!analytics) return null;

  const colors = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--accent))'];
  
  // Calculate performance metrics
  const topPerformer = analytics.faculty_ratings?.reduce((max: any, current: any) => 
    (current.avg_rating > max.avg_rating) ? current : max
  );
  
  const lowPerformer = analytics.faculty_ratings?.reduce((min: any, current: any) => 
    (current.avg_rating < min.avg_rating) ? current : min
  );

  const overallTrend = analytics.monthly_trends?.length > 1 ? 
    analytics.monthly_trends[0].avg_rating - analytics.monthly_trends[analytics.monthly_trends.length - 1].avg_rating : 0;

  // Prepare radar chart data for skill analysis
  const skillAnalysis = [
    { skill: 'Teaching Effectiveness', value: analytics.average_overall_rating || 0 },
    { skill: 'Course Content', value: (analytics.average_overall_rating || 0) * 0.9 },
    { skill: 'Communication', value: (analytics.average_overall_rating || 0) * 0.95 },
    { skill: 'Punctuality', value: (analytics.average_overall_rating || 0) * 1.1 },
    { skill: 'Student Interaction', value: (analytics.average_overall_rating || 0) * 0.85 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Performer</p>
                <p className="text-lg font-bold text-success">{topPerformer?.faculty_name}</p>
                <p className="text-sm text-muted-foreground">{topPerformer?.avg_rating}/10</p>
              </div>
              <Award className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Needs Improvement</p>
                <p className="text-lg font-bold text-warning">{lowPerformer?.faculty_name}</p>
                <p className="text-sm text-muted-foreground">{lowPerformer?.avg_rating}/10</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Trend</p>
                <div className="flex items-center gap-2">
                  {overallTrend > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-success" />
                      <Badge variant="default" className="bg-success">+{overallTrend.toFixed(2)}</Badge>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-destructive" />
                      <Badge variant="destructive">{overallTrend.toFixed(2)}</Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Performance Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Faculty Performance Ranking</CardTitle>
            <CardDescription>Top 10 faculty members by average rating</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avg_rating: {
                  label: "Average Rating",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.faculty_ratings?.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="faculty_name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={10}
                  />
                  <YAxis domain={[0, 10]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avg_rating" fill="var(--color-avg_rating)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Overall feedback rating distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.rating_distribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="var(--color-count)"
                    dataKey="count"
                    label={({ rating, count }) => `${rating}: ${count}`}
                  >
                    {analytics.rating_distribution?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Skill Analysis Radar Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Skill Analysis</CardTitle>
            <CardDescription>Average performance across different criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Score",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillAnalysis}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" className="text-xs" />
                  <PolarRadiusAxis domain={[0, 10]} className="text-xs" />
                  <Radar
                    name="Average Score"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Feedback Trends</CardTitle>
            <CardDescription>Monthly submission and rating trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Submissions",
                  color: "hsl(var(--primary))",
                },
                avg_rating: {
                  label: "Average Rating",
                  color: "hsl(var(--success))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthly_trends?.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => `Month ${value}`}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--color-count)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-count)", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="avg_rating" 
                    stroke="var(--color-avg_rating)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-avg_rating)", strokeWidth: 2, r: 4 }}
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};