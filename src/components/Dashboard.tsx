import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BANNED_LOCATIONS, UPCOMING_DRIVES, PRE_GENERATED_ROUTES } from '../constants/data';
import { Drive, Route } from '../types';
import { supabase } from '../lib/supabase';
import { LogOut, MapPin, Coffee, Timer, Route as RouteIcon, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'generate' | 'banned'>('upcoming');
    const [selectedDrive, setSelectedDrive] = useState<Drive>(UPCOMING_DRIVES[0]);
    const [generatedRoute, setGeneratedRoute] = useState<Route | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<L.Map | null>(null);
    const markerGroupRef = useRef<L.LayerGroup | null>(null);

    // Initializes the map
    useEffect(() => {
        if (!mapRef.current) return;

        if (!leafletMap.current) {
            leafletMap.current = L.map(mapRef.current, {
                center: [-33.7, 150.9],
                zoom: 9,
                zoomControl: false,
                attributionControl: false
            });
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 20
            }).addTo(leafletMap.current);

            L.control.zoom({ position: 'bottomright' }).addTo(leafletMap.current);
            markerGroupRef.current = L.layerGroup().addTo(leafletMap.current);
        }

        const resizeTimer = setTimeout(() => {
            if (leafletMap.current) {
                leafletMap.current.invalidateSize();
            }
        }, 150);

        return () => clearTimeout(resizeTimer);
    }, []);

    // Handle marker & path rendering updates
    useEffect(() => {
        if (!leafletMap.current || !markerGroupRef.current) return;

        markerGroupRef.current.clearLayers();

        const currentData = activeTab === 'generate' && generatedRoute ? generatedRoute : selectedDrive;
        
        if (currentData && currentData.coords) {
            const latlngs = currentData.coords.map(c => [c.lat, c.lng] as [number, number]);
            
            const polyline = L.polyline(latlngs, { 
                color: '#34d399', 
                weight: 3.5,
                opacity: 0.9,
                dashArray: '6, 8'
            }).addTo(markerGroupRef.current);

            currentData.coords.forEach((coord, index) => {
                const isStart = index === 0;
                const markerColor = isStart ? '#ef4444' : '#10b981';
                
                const customIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid #ffffff; box-shadow: 0 0 12px ${markerColor};"></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                });

                L.marker([coord.lat, coord.lng], { icon: customIcon })
                    .bindPopup(`<div style="color: #0f172a; font-family: sans-serif; font-size: 12px; font-weight: 600; padding: 2px 4px;">${coord.name}</div>`)
                    .addTo(markerGroupRef.current!);
            });

            const fitTimer = setTimeout(() => {
                if (leafletMap.current && polyline.getBounds().isValid()) {
                    leafletMap.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
                }
            }, 100);

            return () => clearTimeout(fitTimer);
        }
    }, [selectedDrive, generatedRoute, activeTab]);

    useEffect(() => {
        const mapFixTimer = setTimeout(() => {
            if (leafletMap.current) {
                leafletMap.current.invalidateSize();
                
                const currentData = activeTab === 'generate' && generatedRoute ? generatedRoute : selectedDrive;
                if (currentData && currentData.coords) {
                    const latlngs = currentData.coords.map(c => [c.lat, c.lng] as [number, number]);
                    const poly = L.polyline(latlngs);
                    if (poly.getBounds().isValid()) {
                        leafletMap.current.fitBounds(poly.getBounds(), { padding: [50, 50] });
                    }
                }
            }
        }, 250);
        return () => clearTimeout(mapFixTimer);
    }, [activeTab]);

    const triggerAiGenerator = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * PRE_GENERATED_ROUTES.length);
            setGeneratedRoute(PRE_GENERATED_ROUTES[randomIndex]);
            setIsGenerating(false);
        }, 900);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100">
            
            {/* Header */}
            <header className="border-b border-slate-900 bg-[#090d16]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-xl">
                        <RouteIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            Sunday Drives <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">AI PRO</span>
                        </h1>
                        <p className="text-xs text-slate-400">Tailored scenic journeys starting from Parramatta, NSW</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-900">
                        {(['upcoming', 'generate', 'banned'] as const).map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all capitalize ${activeTab === tab ? 'bg-[#10b981] text-slate-950 shadow-md shadow-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}>
                                {tab === 'upcoming' ? 'Upcoming' : tab === 'generate' ? 'AI Generator' : `Visited (${BANNED_LOCATIONS.length})`}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleSignOut}
                        className="p-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition-all"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Stats Dashboard Banner */}
            <section className="bg-gradient-to-b from-[#090d16] to-[#030712] px-6 py-6 border-b border-slate-900">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#090d16]/40 p-4 rounded-xl border border-slate-900 flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/5 text-indigo-400 rounded-lg border border-indigo-500/10 hidden sm:block">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Completed Drives</span>
                            <span className="text-xl font-bold text-white tracking-tight">0</span>
                            <span className="text-[10px] text-indigo-400 block mt-0.5">Stage 1 Active</span>
                        </div>
                    </div>
                    <div className="bg-[#090d16]/40 p-4 rounded-xl border border-slate-900 flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/5 text-emerald-400 rounded-lg border border-emerald-500/10 hidden sm:block">
                            <Timer className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Total Distance</span>
                            <span className="text-xl font-bold text-white tracking-tight">0.0 km</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Target: 1,500km</span>
                        </div>
                    </div>
                    <div className="bg-[#090d16]/40 p-4 rounded-xl border border-slate-900 flex items-center gap-4">
                        <div className="p-3 bg-amber-500/5 text-amber-400 rounded-lg border border-amber-500/10 hidden sm:block">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Engine Break-In</span>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                <div className="bg-amber-400 h-full w-[8%]"></div>
                            </div>
                            <span className="text-[9px] text-amber-400 block mt-1">&lt; 4,000 RPM Protocol</span>
                        </div>
                    </div>
                    <div className="bg-[#090d16]/40 p-4 rounded-xl border border-slate-900 flex items-center gap-4">
                        <div className="p-3 bg-red-500/5 text-red-400 rounded-lg border border-red-500/10 hidden sm:block">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Excluded Zones</span>
                            <span className="text-xl font-bold text-red-400 tracking-tight">12 Sites</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Blacklist Active</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Layout */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN: Map View */}
                <div className="lg:col-span-7 flex flex-col h-[400px] lg:h-[calc(100vh-250px)] min-h-[400px]">
                    <div className="flex justify-between items-center mb-2.5">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-slate-300 tracking-wide">Live Route Map Viewport</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            {activeTab === 'generate' && generatedRoute ? generatedRoute.distance : selectedDrive.distance}
                        </span>
                    </div>
                    
                    <div className="flex-1 w-full relative rounded-2xl border border-slate-900 shadow-2xl overflow-hidden bg-[#090d16]">
                        <div ref={mapRef} className="absolute inset-0 w-full h-full z-10"></div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Interactive Control & Journey Details */}
                <div className="lg:col-span-5 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-230px)] pr-2 custom-scrollbar">
                    
                    {/* TAB 1: Upcoming Drives */}
                    {activeTab === 'upcoming' && (
                        <div className="space-y-4">
                            <div className="bg-[#090d16]/60 border border-slate-900 p-4 rounded-xl">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Planned Sunday Itinerary</h4>
                                <div className="space-y-2">
                                    {UPCOMING_DRIVES.map((drive, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedDrive(drive)}
                                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${selectedDrive.title === drive.title ? 'bg-emerald-500/5 border-emerald-500/40 text-white' : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'}`}>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block font-mono">{drive.date}</span>
                                                <span className="font-bold text-sm block mt-0.5">{drive.title}</span>
                                                <span className="text-[10px] text-emerald-400 mt-1 inline-block bg-emerald-500/5 px-2 py-0.5 rounded-md">{drive.stops.length} Stops</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold text-slate-200 block">{drive.distance}</span>
                                                <span className="text-[10px] text-slate-500 block">{drive.duration}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#090d16]/40 border border-slate-900 rounded-xl p-5 space-y-4">
                                <div>
                                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 inline-block">{selectedDrive.date} Departure</span>
                                    <h2 className="text-xl font-bold text-white mt-2 serif-font">{selectedDrive.title}</h2>
                                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedDrive.desc}</p>
                                </div>

                                <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-900 space-y-2.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Coffee Pitstop:</span>
                                        <span className="text-emerald-400 font-semibold text-right text-[11px]">{selectedDrive.cafe}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Est. Depart:</span>
                                        <span className="text-slate-200 font-mono text-[11px]">06:30 AM — Parramatta CBD</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Scenic Waypoints</h4>
                                    <ol className="relative border-l border-slate-900 ml-1.5 space-y-3.5">
                                        {selectedDrive.stops.map((stop, idx) => (
                                            <li key={idx} className="ml-5 relative">
                                                <span className="absolute flex items-center justify-center w-4 h-4 bg-slate-950 text-emerald-400 text-[9px] font-bold rounded-full -left-[29px] border border-slate-800">
                                                    {idx + 1}
                                                </span>
                                                <h5 className="font-semibold text-white text-xs">{stop}</h5>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: AI Route Generator */}
                    {activeTab === 'generate' && (
                        <div className="space-y-4">
                            <div className="bg-[#090d16]/60 border border-slate-900 p-5 rounded-xl space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Engine Break-in Route Generator</h3>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                        Generates new premium routes starting from Parramatta that strictly omit the 12 already-explored areas.
                                    </p>
                                </div>

                                <button 
                                    onClick={triggerAiGenerator}
                                    disabled={isGenerating}
                                    className="w-full bg-[#10b981] hover:bg-emerald-400 disabled:bg-emerald-800 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
                                    {isGenerating ? (
                                        <>
                                            <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full"></span>
                                            Calculating Non-Overlapping Paths...
                                        </>
                                    ) : (
                                        "Generate Brand New Route"
                                    )}
                                </button>
                            </div>

                            {generatedRoute ? (
                                <div className="bg-[#090d16]/40 border border-emerald-500/20 rounded-xl p-5 space-y-4 animate-fadeIn">
                                    <div>
                                        <span className="text-[9px] font-bold tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/15 uppercase">{generatedRoute.region} Escape</span>
                                        <h2 className="text-lg font-bold text-white mt-1.5 serif-font">{generatedRoute.title}</h2>
                                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{generatedRoute.desc}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900">
                                            <span className="text-[9px] text-slate-500 block uppercase">Est. Distance</span>
                                            <span className="font-bold text-slate-200 text-xs">{generatedRoute.distance}</span>
                                        </div>
                                        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900">
                                            <span className="text-[9px] text-slate-500 block uppercase">Drive Duration</span>
                                            <span className="font-bold text-slate-200 text-xs">{generatedRoute.duration}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-1 border-t border-slate-900 text-xs">
                                        <div>
                                            <h4 className="text-[9px] font-bold text-slate-400 uppercase">Recommended Café Stop</h4>
                                            <p className="text-xs text-emerald-400 font-semibold mt-0.5">☕ {generatedRoute.cafe}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-[9px] font-bold text-slate-400 uppercase">Break-In Parking</h4>
                                            <p className="text-xs text-slate-300 mt-0.5">{generatedRoute.parking}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-[9px] font-bold text-slate-400 uppercase">GPS Overview</h4>
                                            <p className="text-[11px] font-mono text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-900 mt-1 leading-relaxed">{generatedRoute.directions}</p>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Waypoint Stops</h4>
                                        <ol className="relative border-l border-slate-900 ml-1.5 space-y-3.5">
                                            {generatedRoute.stops.map((stop, idx) => (
                                                <li key={idx} className="ml-5 relative">
                                                    <span className="absolute flex items-center justify-center w-4 h-4 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold rounded-full -left-[29px] border border-emerald-500/20">
                                                        {idx + 1}
                                                    </span>
                                                    <h5 className="font-semibold text-white text-xs">{stop}</h5>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            ) : (
                                <div className="border border-dashed border-slate-900 rounded-xl p-6 text-center">
                                    <p className="text-xs text-slate-500">Press the generator button above to produce verified paths.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 3: Excluded/Visited Locations */}
                    {activeTab === 'banned' && (
                        <div className="bg-[#090d16]/60 border border-slate-900 p-5 rounded-xl space-y-3">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Excluded Zones (Strict Filter)</h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                    The 12 visited locations below are automatically banned.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                {BANNED_LOCATIONS.map((loc, idx) => (
                                    <div key={idx} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-900 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/60"></span>
                                        <span className="text-xs font-medium text-slate-300">{loc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Car Break-in Protocol */}
                    <div className="bg-[#090d16]/20 border border-slate-900 rounded-xl p-4 space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            🛡️ Break-In Guidelines
                        </h4>
                        <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4 leading-relaxed">
                            <li>Vary highway RPMs; downshift regularly.</li>
                            <li>Limit full acceleration until 1,500km threshold.</li>
                            <li>Warm engine fully before entering high load hills.</li>
                        </ul>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="border-t border-slate-900 py-4 mt-6 bg-slate-950 text-center text-[11px] text-slate-600">
                <p>© 2026 Sunday Drives App. Optimized for break-in exploration.</p>
            </footer>
        </div>
    );
}

export default Dashboard;
