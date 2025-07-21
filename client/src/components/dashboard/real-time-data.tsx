import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Newspaper, 
  MessageSquare, 
  Cloud, 
  Hospital, 
  Users,
  AlertTriangle,
  Activity,
  TrendingUp
} from "lucide-react";

interface RealTimeDataProps {
  selectedRegion: string;
}

export function RealTimeData({ selectedRegion }: RealTimeDataProps) {
  const { data: newsData, isLoading: newsLoading } = useQuery({
    queryKey: ["/api/news/realtime", selectedRegion],
    queryFn: () => fetch(`/api/news/realtime?region=${selectedRegion}`).then(res => res.json()),
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const { data: socialData, isLoading: socialLoading } = useQuery({
    queryKey: ["/api/social/realtime", selectedRegion],
    queryFn: () => fetch(`/api/social/realtime?region=${selectedRegion}`).then(res => res.json()),
    refetchInterval: 300000,
  });

  const { data: weatherData, isLoading: weatherLoading } = useQuery({
    queryKey: ["/api/weather/realtime", selectedRegion],
    queryFn: () => fetch(`/api/weather/realtime?region=${selectedRegion}`).then(res => res.json()),
    refetchInterval: 300000,
  });

  const { data: hospitalData, isLoading: hospitalLoading } = useQuery({
    queryKey: ["/api/hospitals/realtime", selectedRegion],
    queryFn: () => fetch(`/api/hospitals/realtime?region=${selectedRegion}`).then(res => res.json()),
    refetchInterval: 600000, // Refresh every 10 minutes
  });

  const { data: demographicData, isLoading: demographicLoading } = useQuery({
    queryKey: ["/api/demographics/realtime", selectedRegion],
    queryFn: () => fetch(`/api/demographics/realtime?region=${selectedRegion}`).then(res => res.json()),
    refetchInterval: 3600000, // Refresh every hour
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAirQualityColor = (quality: string) => {
    switch (quality) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Unhealthy for Sensitive Groups': return 'bg-orange-100 text-orange-800';
      case 'Unhealthy': return 'bg-red-100 text-red-800';
      case 'Very Unhealthy': return 'bg-purple-100 text-purple-800';
      case 'Hazardous': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return 'bg-red-100 text-red-800';
    if (occupancy >= 75) return 'bg-orange-100 text-orange-800';
    if (occupancy >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Real-Time Data Sources</h3>
        <Badge variant="outline" className="text-xs">
          Live Updates
        </Badge>
      </div>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="news" className="flex items-center gap-1">
            <Newspaper className="h-4 w-4" />
            News
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="weather" className="flex items-center gap-1">
            <Cloud className="h-4 w-4" />
            Weather
          </TabsTrigger>
          <TabsTrigger value="hospitals" className="flex items-center gap-1">
            <Hospital className="h-4 w-4" />
            Hospitals
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Demographics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                News Feed - {selectedRegion}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {newsLoading ? (
                <div className="text-center py-4">Loading news data...</div>
              ) : newsData ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Headlines</h4>
                    <div className="space-y-1">
                      {newsData.headlines?.map((headline: string, index: number) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          {headline}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      Health-Related News
                    </h4>
                    <div className="space-y-1">
                      {newsData.healthRelated?.map((news: string, index: number) => (
                        <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                          {news}
                        </div>
                      ))}
                    </div>
                  </div>

                  {newsData.diseaseOutbreaks?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Disease Outbreak Reports
                      </h4>
                      <div className="space-y-1">
                        {newsData.diseaseOutbreaks.map((outbreak: string, index: number) => (
                          <div key={index} className="text-sm p-2 bg-red-50 rounded">
                            {outbreak}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No news data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Social Media Trends - {selectedRegion}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {socialLoading ? (
                <div className="text-center py-4">Loading social media data...</div>
              ) : socialData ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium">Public Sentiment:</span>
                    <Badge className={getSentimentColor(socialData.publicSentiment)}>
                      {socialData.publicSentiment}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Health Trends
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {socialData.healthTrends?.map((trend: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {trend}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Disease Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                      {socialData.diseaseKeywords?.map((keyword: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs bg-orange-50">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Viral Health Topics</h4>
                    <div className="space-y-1">
                      {socialData.viralHealthTopics?.map((topic: string, index: number) => (
                        <div key={index} className="text-sm p-2 bg-purple-50 rounded">
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No social media data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Weather Conditions - {selectedRegion}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weatherLoading ? (
                <div className="text-center py-4">Loading weather data...</div>
              ) : weatherData ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Temperature:</span>
                      <span className="text-sm font-medium">{weatherData.temperature}°F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Humidity:</span>
                      <span className="text-sm font-medium">{weatherData.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Wind Speed:</span>
                      <span className="text-sm font-medium">{weatherData.windSpeed} mph</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Precipitation:</span>
                      <span className="text-sm font-medium">{weatherData.precipitation}"</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Conditions:</span>
                      <span className="text-sm font-medium">{weatherData.conditions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">UV Index:</span>
                      <span className="text-sm font-medium">{weatherData.uvIndex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Visibility:</span>
                      <span className="text-sm font-medium">{weatherData.visibility} mi</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Air Quality:</span>
                      <Badge className={getAirQualityColor(weatherData.airQuality)} variant="outline">
                        {weatherData.airQuality}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No weather data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hospitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hospital className="h-5 w-5" />
                Hospital Status - {selectedRegion}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hospitalLoading ? (
                <div className="text-center py-4">Loading hospital data...</div>
              ) : hospitalData && Array.isArray(hospitalData) ? (
                <div className="space-y-4">
                  {hospitalData.map((hospital: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{hospital.hospitalName}</h4>
                        <Badge className={getOccupancyColor(hospital.occupancy)}>
                          {hospital.occupancy}% occupied
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Capacity:</span>
                          <span className="ml-2 font-medium">{hospital.capacity} beds</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Available:</span>
                          <span className="ml-2 font-medium">{hospital.availableBeds} beds</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Emergency Wait:</span>
                          <span className="ml-2 font-medium">{hospital.emergencyWait}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">{hospital.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">Specialties:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {hospital.specialties?.map((specialty: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No hospital data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Demographics - {selectedRegion}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {demographicLoading ? (
                <div className="text-center py-4">Loading demographic data...</div>
              ) : demographicData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Population:</span>
                      <div className="text-lg font-medium">{demographicData.population?.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Economic Status:</span>
                      <div className="text-lg font-medium">{demographicData.economicStatus}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Healthcare Access:</span>
                      <div className="text-lg font-medium">{demographicData.healthcareAccess}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Urbanization:</span>
                      <div className="text-lg font-medium">{demographicData.urbanization}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Age Distribution</h4>
                    <div className="space-y-2">
                      {demographicData.ageDistribution && Object.entries(demographicData.ageDistribution).map(([age, percentage]) => (
                        <div key={age} className="flex justify-between items-center">
                          <span className="text-sm">{age} years:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No demographic data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}