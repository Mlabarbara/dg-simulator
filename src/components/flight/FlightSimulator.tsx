'use client'
import React, { useState, useEffect } from 'react';
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

    const width = 600;
    const height = 400;
    const margin = 40;
    const flightScale = height / 400;
    const centerX = width / 2;

    const getSkillMultiplier = () => {
        switch(skillLevel) {
            case 'beginner': return 0.98;
            case 'advanced': return 1.04;
            default: return 1;
        }
    };

    const getThrowModifier = () => {
        switch(throwType) {
            case 'rhfh': return -0.98;
            case 'lhbh': return -1;
            case 'lhfh': return 0.98;
            default: return 1; // rhbh
        }
    };

    const generateFlightPath = () => {
        const points = [];
        const steps = 150;
        const skillMod = getSkillMultiplier();
        const throwMod = getThrowModifier();
        const maxHeight = Math.min(height - 2 * margin,
            (speed * 15 + glide * 20) * flightScale * skillMod);

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            let x = centerX;
            let y = height - margin;

            y -= t * maxHeight * skillMod;

            if (t < 0.4) {
                const turnFactor = Math.sin(t * Math.PI / 0.8);
                x += turn * 40 * turnFactor * (speed / 10) * throwMod;
            } else if (t < 0.8) {
                const stabilityT = (t - 0.4) / 0.4;
                const previousTurn = turn * 40 * Math.sin(0.5 * Math.PI);
                x += (previousTurn + (stabilityT * turn * 20)) * throwMod;
            } else {
                const fadeT = (t - 0.8) / 0.2;
                const previousOffset = turn * 60;
                const fadeAmount = fade * -80 * (1- Math.cos(fadeT * Math.PI / 2));
                x += (previousOffset + fadeAmount) * throwMod;
            }

            x += departureAngle * 10 * Math.sin(t * Math.PI);
            x = Math.max(margin, Math.min(width - margin, x));
            y = Math.max(margin, Math.min(height - margin, y));

            points.push([x, y]);
        }
        return points;
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Disc Flight Path Simulator</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 mb-4">
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

                <div className="flex gap-2 mb-4">
                    {['rhbh', 'rhfh', 'lhbh', 'lhfh'].map(type => (
                        <button
                            key={type}
                            className={`px-4 py-2 rounded ${throwType === type ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setThrowType(type)}
                        >
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Departure Angle ({departureAngle}°)
                            </label>
                            <Slider
                                value={[departureAngle]}
                                onValueChange={([value]) => setDepartureAngle(value)}
                                min={-6}
                                max={6}
                                step={0.5}
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
                                min={2}
                                max={15}
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
                                max={6}
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
                                max={3}
                                step={0.5}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="relative w-full h-96 border rounded bg-white">
                        <svg
                            width={width}
                            height={height}
                            viewBox={`0 0 ${width} ${height}`}
                            className="bg-white"
                        >
                            {/* Grid lines */}
                            {Array.from({length: 8}).map((_, i) => (
                                <React.Fragment key={`grid-${i}`}>
                                    <line
                                        x1={margin}
                                        y1={margin + i * (height - 2 * margin) / 7}
                                        x2={width - margin}
                                        y2={margin + i * (height - 2 * margin) / 7}
                                        stroke="#eee"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={10}
                                        y={margin + i * (height - 2 * margin) / 7}
                                        fontSize="12"
                                        fill="#666"
                                    >
                                        {400 - i * 50}ft
                                    </text>
                                </React.Fragment>
                            ))}

                            {/* Flight path */}
                            <path
                                d={`M ${generateFlightPath().map(([x, y]) => `${x},${y}`).join(' L ')}`}
                                fill="none"
                                stroke="blue"
                                strokeWidth="2"
                            />

                            {/* Starting point */}
                            <circle
                                cx={centerX}
                                cy={height - margin}
                                r="4"
                                fill="blue"
                            />
                        </svg>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FlightSimulator;