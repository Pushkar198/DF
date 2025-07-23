import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, Locate } from 'lucide-react';

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export function LocationPicker({ value, onChange, placeholder = "Search for a location..." }: LocationPickerProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Using Nominatim OpenStreetMap API for location search (free alternative to Google Places)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      // Filter and format results to show cities/towns/villages
      const filteredData = data.filter((item: any) => 
        item.type === 'city' || 
        item.type === 'town' || 
        item.type === 'village' || 
        item.type === 'administrative' ||
        item.class === 'place'
      );
      
      setSuggestions(filteredData.slice(0, 6));
      setIsOpen(true);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300);
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    // Format location as "City, State, Country" or "City, Country"
    const parts = [];
    if (location.address.city) parts.push(location.address.city);
    if (location.address.state) parts.push(location.address.state);
    if (location.address.country) parts.push(location.address.country);
    
    const formattedLocation = parts.join(', ') || location.display_name.split(',').slice(0, 2).join(', ');
    
    setSearchTerm(formattedLocation);
    onChange(formattedLocation);
    setIsOpen(false);
    setSuggestions([]);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const parts = [];
            if (data.address.city) parts.push(data.address.city);
            else if (data.address.town) parts.push(data.address.town);
            else if (data.address.village) parts.push(data.address.village);
            
            if (data.address.state) parts.push(data.address.state);
            if (data.address.country) parts.push(data.address.country);
            
            const currentLocation = parts.join(', ');
            setSearchTerm(currentLocation);
            onChange(currentLocation);
          }
        } catch (error) {
          console.error('Error getting location details:', error);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
        setIsLoading(false);
        alert('Unable to retrieve your location. Please search manually.');
      }
    );
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pl-10"
            onFocus={() => searchTerm.length >= 3 && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          disabled={isLoading}
          title="Use current location"
        >
          <Locate className="h-4 w-4" />
        </Button>
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {suggestions.map((suggestion, index) => {
              const parts = [];
              if (suggestion.address.city) parts.push(suggestion.address.city);
              else if (suggestion.display_name.split(',')[0]) parts.push(suggestion.display_name.split(',')[0]);
              
              if (suggestion.address.state) parts.push(suggestion.address.state);
              if (suggestion.address.country) parts.push(suggestion.address.country);
              
              const displayText = parts.join(', ') || suggestion.display_name;
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                  onClick={() => handleLocationSelect(suggestion)}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{displayText}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {suggestion.display_name}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <Card>
            <CardContent className="p-3 text-center text-sm text-muted-foreground">
              Searching locations...
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}