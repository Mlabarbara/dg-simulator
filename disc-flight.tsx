import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const DiscFlightSimulator = () => {
  const [throwType, setThrowType] = useState('backhand');
  const [releaseAngle, setReleaseAngle] = useState(0);
  const [discSpeed, setDiscSpeed] = useState(14);
  const [discGlide, setDiscGlide] = useState(7);
  const [discTurn, setDiscTurn] = useState(-2);
  const [discFade, setDiscFade] = useState(1);

  const calculateFlightPath = () => {
    const points = [];
    const numPoints = 1000; // Increased for smoother curves
    const maxDistance = discSpeed * 35;
    const isBackhand = throwType === 'backhand';
    
    // Calculate control points for the entire flight path
    const startPoint = { x: 400, y: 550 };
    const endPoint = { x: 400 + (isBackhand ? -150 : 150), y: 50 }; // End point with fade
    
    // Calculate mid-points for S-curve if disc is understable
    const turnIntensity = -discTurn * (isBackhand ? -1 : 1);
    const fadeIntensity = discFade * (isBackhand ? -1 : 1);
    
    // Calculate curve control points
    const cp1 = {
      x: startPoint.x,
      y: startPoint.y * 0.7
    };
    
    const cp2 = {
      x: startPoint.x + (turnIntensity * 30),
      y: startPoint.y * 0.4
    };
    
    const cp3 = {
      x: endPoint.x - (fadeIntensity * 50),
      y: endPoint.y * 2
    };
    
    const cp4 = {
      x: endPoint.x,
      y: endPoint.y
    };
    
    // Generate points along the curve using cubic bezier interpolation
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      
      // Cubic bezier formula
      const x = cubicBezier(startPoint.x, cp1.x, cp2.x, cp3.x, cp4.x, t);
      const y = cubicBezier(startPoint.y, cp1.y, cp2.y, cp3.y, cp4.y, t);
      
      points.push({ x, y });
    }
    
    return points;
  };
  
  // Cubic bezier interpolation function
  const cubicBezier = (p0, p1, p2, p3, p4, t) => {
    const oneMinusT = 1 - t;
    const tsq = t * t;
    const oneMinusTsq = oneMinusT * oneMinusT;
    
    return oneMinusTsq * oneMinusTsq * p0 + 
           4 * oneMinusTsq * oneMinusT * t * p1 +
           6 * oneMinusTsq * tsq * p2 +
           4 * oneMinusT * tsq * t * p3 +
           tsq * tsq * p4;
  };

  const flightPath = calculateFlightPath();
  
  // Create SVG path from points
  const createPath = (points) => {
    return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  };

  const pathD = createPath(flightPath);

  // Calculate distance markers
  const distanceMarkers = [0, 100, 200, 300, 400, 490].map(feet => ({
    y: 550 - (feet / (discSpeed * 35)) * 500,
    feet
  }));

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Disc Golf Flight Path Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <svg 
            viewBox="0 0 800 600" 
            className="w-full h-96 border rounded bg-gray-50"
          >
            {/* Center line */}
            <line x1="400" y1="50" x2="400" y2="550" stroke="#ddd" strokeDasharray="5,5" />
            
            {/* Distance markers */}
            {distanceMarkers.map(({y, feet}) => (
              <g key={feet}>
                <line 
                  x1="300" 
                  y1={y} 
                  x2="500" 
                  y2={y} 
                  stroke="#ddd" 
                  strokeDasharray="5,5" 
                />
                <text 
                  x="520" 
                  y={y + 4} 
                  fill="#666" 
                  fontSize="12"
                >
                  {feet}ft
                </text>
              </g>
            ))}
            
            {/* Flight path */}
            <path
              d={pathD}
              fill="none"
              stroke={throwType === 'backhand' ? '#3b82f6' : '#ef4444'}
              strokeWidth="3"
            />
            
            {/* Tee pad */}
            <rect x="375" y="530" width="50" height="20" fill="#666" />
          </svg>

          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded ${throwType === 'backhand' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setThrowType('backhand')}
            >
              Backhand
            </button>
            <button
              className={`px-4 py-2 rounded ${throwType === 'forehand' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setThrowType('forehand')}
            >
              Forehand
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Release Angle ({releaseAngle}°) - Hyzer/Anhyzer
              </label>
              <Slider
                value={[releaseAngle]}
                min={-12}
                max={12}
                step={1}
                onValueChange={([value]) => setReleaseAngle(value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Disc Speed ({discSpeed}) - Affects Distance & Stability
              </label>
              <Slider
                value={[discSpeed]}
                min={1}
                max={14}
                step={1}
                onValueChange={([value]) => setDiscSpeed(value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Disc Glide ({discGlide}) - Lift & Line Holding
              </label>
              <Slider
                value={[discGlide]}
                min={1}
                max={7}
                step={1}
                onValueChange={([value]) => setDiscGlide(value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Disc Turn ({discTurn}) - High Speed Stability
              </label>
              <Slider
                value={[discTurn]}
                min={-5}
                max={1}
                step={1}
                onValueChange={([value]) => setDiscTurn(value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Disc Fade ({discFade}) - Low Speed Stability
              </label>
              <Slider
                value={[discFade]}
                min={0}
                max={5}
                step={1}
                onValueChange={([value]) => setDiscFade(value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscFlightSimulator;