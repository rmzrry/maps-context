import React, { useState, useEffect } from 'react';
import { ControlPanel } from '@/components/ControlPanel';
import { MapView } from '@/components/MapView';
import { ThreeViewer } from '@/components/ThreeViewer';
import { useToast } from '@/hooks/use-toast';

// Default location: Statue of Liberty (matching the original site)
const DEFAULT_LOCATION = { lat: 40.6691, lng: -74.0446 };
const DEFAULT_ZOOM = 16;
const DEFAULT_SSE = 2.0;

export const GoogleEarthViewer: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [screenSpaceError, setScreenSpaceError] = useState(DEFAULT_SSE);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFetchTiles = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Maps API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call - in a real implementation, this would fetch from Google's 3D Tiles API
      setTimeout(() => {
        // Mock successful tile fetching
        setModels(['placeholder-model-1', 'placeholder-model-2']);
        setIsLoading(false);
        toast({
          title: "Tiles Fetched",
          description: `Successfully fetched 3D tiles for lat: ${location.lat.toFixed(4)}, lng: ${location.lng.toFixed(4)}`,
        });
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch 3D tiles. Please check your API key and try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadGltf = () => {
    if (models.length === 0) {
      toast({
        title: "No Models",
        description: "Please fetch tiles first before downloading.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Download Started",
      description: "Combined glTF download will begin shortly.",
    });
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  return (
    <div className="h-screen w-screen flex bg-background text-foreground overflow-hidden">
      {/* Left Control Panel */}
      <div className="flex flex-col">
        <ControlPanel
          onApiKeyChange={setApiKey}
          onLocationChange={handleLocationChange}
          onZoomChange={handleZoomChange}
          onScreenSpaceErrorChange={setScreenSpaceError}
          onFetchTiles={handleFetchTiles}
          onDownloadGltf={handleDownloadGltf}
          isLoading={isLoading}
          currentLocation={location}
          currentZoom={zoom}
          currentSSE={screenSpaceError}
        />
        
        {/* Mini map in control panel */}
        <div className="w-80 p-4 border-r border-control-border">
          <MapView
            center={[location.lat, location.lng]}
            zoom={Math.min(zoom, 18)}
            onLocationChange={handleLocationChange}
            onZoomChange={handleZoomChange}
          />
        </div>
      </div>

      {/* Main 3D Viewer */}
      <ThreeViewer
        models={models}
        isLoading={isLoading}
      />
    </div>
  );
};