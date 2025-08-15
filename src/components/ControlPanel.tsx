import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface ControlPanelProps {
  onApiKeyChange: (key: string) => void;
  onLocationChange: (lat: number, lng: number) => void;
  onZoomChange: (zoom: number) => void;
  onScreenSpaceErrorChange: (error: number) => void;
  onFetchTiles: () => void;
  onDownloadGltf: () => void;
  isLoading: boolean;
  currentLocation: { lat: number; lng: number };
  currentZoom: number;
  currentSSE: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onApiKeyChange,
  onLocationChange,
  onZoomChange,
  onScreenSpaceErrorChange,
  onFetchTiles,
  onDownloadGltf,
  isLoading,
  currentLocation,
  currentZoom,
  currentSSE,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [lat, setLat] = useState(currentLocation.lat.toString());
  const [lng, setLng] = useState(currentLocation.lng.toString());

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    onApiKeyChange(value);
  };

  const handleLocationUpdate = () => {
    const newLat = parseFloat(lat);
    const newLng = parseFloat(lng);
    if (!isNaN(newLat) && !isNaN(newLng)) {
      onLocationChange(newLat, newLng);
    }
  };

  return (
    <Card className="control-panel w-80 h-full p-4 space-y-4 rounded-none border-r border-control-border">
      <div className="space-y-2">
        <Label htmlFor="apikey" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Google API Key
        </Label>
        <Input
          id="apikey"
          type="password"
          placeholder="Enter your Google Maps API key"
          value={apiKey}
          onChange={(e) => handleApiKeyChange(e.target.value)}
          className="bg-control-bg border-control-border focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Lat,Lng
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            onBlur={handleLocationUpdate}
            className="bg-control-bg border-control-border focus:border-primary"
          />
          <Input
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            onBlur={handleLocationUpdate}
            className="bg-control-bg border-control-border focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Screen space error
        </Label>
        <div className="px-2">
          <Slider
            value={[currentSSE]}
            onValueChange={(value) => onScreenSpaceErrorChange(value[0])}
            max={10}
            min={1}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1</span>
            <span className="text-primary font-mono">{currentSSE}</span>
            <span>10</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Zoom: {currentZoom}
        </Label>
        <div className="px-2">
          <Slider
            value={[currentZoom]}
            onValueChange={(value) => onZoomChange(value[0])}
            max={20}
            min={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>10</span>
            <span>20</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <Button
          onClick={onFetchTiles}
          disabled={!apiKey || isLoading}
          className="w-full tech-button bg-gradient-control hover:bg-control-hover disabled:opacity-50"
        >
          {isLoading ? 'Fetching...' : 'Fetch tiles'}
        </Button>
        
        <Button
          onClick={onDownloadGltf}
          variant="outline"
          className="w-full tech-button bg-gradient-control hover:bg-control-hover border-control-border"
        >
          Download combined glTF
        </Button>
      </div>

      <div className="pt-4 space-y-2 text-xs text-muted-foreground border-t border-control-border">
        <a 
          href="https://github.com/OmarShehata/google-earth-as-gltf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:text-primary transition-colors"
        >
          About
        </a>
        <div className="space-y-1">
          <p>This app demonstrates fetching & rendering Google Earth 3D Tiles in ThreeJS</p>
          <ol className="space-y-1 ml-4 list-decimal">
            <li>Get a <a href="https://developers.google.com/maps/documentation/tile/get-api-key" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google "Map Tiles"</a> API key</li>
            <li>Paste it in the settings top left</li>
            <li>Click fetch tiles</li>
          </ol>
          <a 
            href="https://github.com/OmarShehata/google-earth-as-gltf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-primary hover:underline"
          >
            Learn more
          </a>
        </div>
      </div>
    </Card>
  );
};