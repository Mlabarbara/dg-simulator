'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select';


const FlightSimulator = () => {
    const [departureAngle, setDepartureAngle] = useState(0);
    const [speed, setSpeed] = useState(9);
    const [glide, setGlide] = useState(5);
    const [turn, setTurn] = useState(0);
    const [fade, setFade] = useState(2);
    const [throwType, setThrowType] = useState('rhbh');
    const [skillLevel, setSkillLevel] = useState('intermediate');

    const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

    // Update dimensions on mount and window resize
    React.useEffect(() => {
        const updateDimensions = () => {
            const container = document.querySelector('.flight-container');
            if (container) {
                const width = container.clientWidth;
                const height = Math.min(400, window.innerHeight * 0.5);
                setDimensions({ width, height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const width = dimensions.width;
    const height = dimensions.height;
    const margin = 40;
    const flightScale = height / 400;
    const centerX = width / 2;

    const getSkillMultiplier = () => {
        switch(skillLevel) {
            case 'beginner': return .99;
            case 'advanced': return 1.06;
            default: return 1.02;
        }
    };

    const getThrowModifier = () => {
        const direction = {
            'rhbh': 1,
            'rhfh': -1,
            'lhbh': -1,
            'lhfh': 1
        }[throwType] || 1;

        const distance = {
            'rhbh': 1.1,
            'rhfh': 0.95,
            'lhbh': 1.1,
            'lhfh': 0.95
        }[throwType] || 1;

        return { direction, distance };
    };

    const generateFlightPath = () => {
        const points = [];
        const steps = 150;
        const skillMod = getSkillMultiplier();
        const { direction, distance } = getThrowModifier();
        const maxHeight = Math.min(height - 2 * margin,
            (speed * 15 + glide * 20) * flightScale * skillMod * distance);

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            let x = centerX;
            let y = height - margin;

            y -= t * maxHeight * skillMod;

            const turnPhase = Math.sin(t * Math.PI) * Math.exp(-t * 2);
            const fadePhase = (2 - Math.cos(t * Math.PI)) * Math.exp((t - 2) * 2);

            const turnEffect = turn * 10 * turnPhase * (speed / 10);
            const fadeEffect = fade * -20 * fadePhase;
            x += (turnEffect + fadeEffect) * direction;

            const naturalDrift = Math.sin(t * Math.PI) * 2;
            x += naturalDrift * direction;

            x += departureAngle * 10 * Math.sin(t * Math.PI);

            x = Math.max(margin, Math.min(width - margin, x));
            y = Math.max(margin, Math.min(height - margin, y));

            points.push([x, y]);
        }
        return points;
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-blue-200">Disc Flight Path Simulator</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-1 mb-6">
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Skill Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
            </div>

                <div className="grid grid-cols-2 sm:flex gap-2 mb-2">
                    {['rhbh', 'rhfh', 'lhbh', 'lhfh'].map(type => (
                        <button
                            key={type}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                throwType === type 
                                ? 'bg-blue-200 text-primary-foreground' 
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                            onClick={() => setThrowType(type)}
                        >
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-4">
                                Departure Angle ({departureAngle}°)
                            </label>
                            <Slider
                                value={[departureAngle]}
                                onValueChange={([value]) => setDepartureAngle(value)}
                                min={-9}
                                max={9}
                                step={0.25}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Speed ({speed})
                            </label>
                            <Slider
                                value={[speed]}
                                onValueChange={([value]) => setSpeed(value)}
                                min={1}
                                max={14}
                                step={0.5}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Glide ({glide})
                            </label>
                            <Slider
                                value={[glide]}
                                onValueChange={([value]) => setGlide(value)}
                                min={0}
                                max={8}
                                step={0.5}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Turn ({turn})
                            </label>
                            <Slider
                                value={[turn]}
                                onValueChange={([value]) => setTurn(value)}
                                min={-5}
                                max={1}
                                step={0.5}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Fade ({fade})
                            </label>
                            <Slider
                                value={[fade]}
                                onValueChange={([value]) => setFade(value)}
                                min={-1}
                                max={5}
                                step={0.5}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="flight-container relative w-full border rounded bg-card">
                        <svg
                            width={width}
                            height={height}
                            viewBox={`0 0 ${width} ${height}`}
                            className="w-full h-full touch-none"
                            style={{ touchAction: 'none' }}
                        >
                            {/* Grid lines */}
                            {Array.from({length: 9}).map((_, i) => (
                                <React.Fragment key={`grid-${i}`}>
                                    <line
                                        x1={margin}
                                        y1={margin + i * (height - 2 * margin) / 8}
                                        x2={width - margin}
                                        y2={margin + i * (height - 2 * margin) / 8}
                                        className="text-muted-foreground/20"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={10}
                                        y={margin + i * (height - 2 * margin) / 8}
                                        fontSize="12"
                                        className="text-muted-foreground"
                                        fill="currentColor"
                                    >
                                        {400 - i * 50}ft
                                    </text>
                                </React.Fragment>
                            ))}

                            {/* Flight path */}
                            <path
                                d={`M ${generateFlightPath().map(([x, y]) => `${x},${y}`).join(' L ')}`}
                                fill="none"
                                className="stroke-blue-400"
                                strokeWidth="2"
                            />

                            {/* Starting point */}
                            <circle
                                cx={centerX}
                                cy={height - margin}
                                r="4"
                                className="fill-blue-400"
                            />
                        </svg>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FlightSimulator;