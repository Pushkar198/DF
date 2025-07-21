import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pill, Syringe, PillBottle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Medicine } from "@shared/schema";

interface MedicineRecommendationsProps {
  selectedRegion: string;
}

export function MedicineRecommendations({ selectedRegion }: MedicineRecommendationsProps) {
  // Remove database medicine fetching - all recommendations come from AI predictions
  const medicines = [];
  const isLoading = false;

  const getMedicineIcon = (medicineName: string) => {
    const name = medicineName.toLowerCase();
    if (name.includes('inject') || name.includes('palivizumab')) {
      return <Syringe className="w-5 h-5 text-blue-500" />;
    } else if (name.includes('capsule') || name.includes('tamiflu')) {
      return <PillBottle className="w-5 h-5 text-orange-500" />;
    } else {
      return <Pill className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStockColor = (stockLevel: string) => {
    switch (stockLevel.toLowerCase()) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStockLabel = (stockLevel: string) => {
    switch (stockLevel.toLowerCase()) {
      case 'high':
        return 'Well Stocked';
      case 'medium':
        return 'In Stock';
      case 'low':
        return 'Low Stock';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Recommended Medicines</CardTitle>
          <p className="text-sm text-gray-500">AI-suggested treatments based on predictions</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Recommended Medicines</CardTitle>
        <p className="text-sm text-gray-500">AI-suggested treatments based on predictions</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medicines?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No medicine recommendations available</p>
            </div>
          ) : (
            medicines?.map((medicine: Medicine) => (
              <div key={medicine.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-opacity-10 rounded-full flex items-center justify-center">
                    {getMedicineIcon(medicine.name)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                    <p className="text-sm text-gray-500">{medicine.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getStockColor(medicine.stockLevel)}`}>
                    {getStockLabel(medicine.stockLevel)}
                  </p>
                  <p className="text-xs text-gray-500">{medicine.dosage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
