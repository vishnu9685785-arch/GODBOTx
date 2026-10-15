import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Phone,
  Server,
  Youtube,
} from 'lucide-react';
import { Language } from '../types';

interface ArchitectureBannerProps {
  lang: Language;
}

export const ArchitectureBanner: React.FC<ArchitectureBannerProps> = ({ lang }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden text-xs">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-zinc-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-semibold text-zinc-200">
              {lang === 'en'
                ? '24/7 Cloud Architecture & Phone Decoupling'
                : '24/7 क्लाउड आर्किटेक्चर व फोन स्वतंत्रता'}
            </p>
            <p className="text-[11px] text-zinc-400">
              {lang === 'en'
                ? 'Why stream never stops when your phone screen turns off'
                : 'फोन बंद होने पर भी स्ट्रीम कभी नहीं रुकती'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="text-[11px] hidden sm:inline">
            {isExpanded ? (lang === 'en' ? 'Hide Details' : 'छिपाएं') : (lang === 'en' ? 'View Architecture' : 'आर्किटेक्चर देखें')}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 pt-1 border-t border-zinc-800/60 space-y-3.5 bg-zinc-950/40">
          {/* 3 Tier flow diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {/* Step 1: Mobile UI */}
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>1. Android Mobile App</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {lang === 'en'
                  ? 'Acts as a lightweight remote control. Selects videos, manages playback modes, and monitors telemetry.'
                  : 'हल्के रिमोट कंट्रोल की तरह कार्य करता है। वीडियो चयन, मोड नियंत्रण व टेलीमेट्री की निगरानी करता है।'}
              </p>
            </div>

            {/* Step 2: Cloud Worker */}
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>2. 24/7 Cloud Worker</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {lang === 'en'
                  ? 'Always-on FFmpeg container running on high-speed cloud VPS. Reads prerecorded files and loops endlessly.'
                  : 'हाई-स्पीड क्लाउड वीपीएस पर चलने वाला एफएफएमपीईजी कंटेनर। फाइलों को बिना रुके लगातार लूप करता है।'}
              </p>
            </div>

            {/* Step 3: YouTube Ingest */}
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <Youtube className="w-4 h-4 text-red-500" />
                <span>3. YouTube Live RTMP</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {lang === 'en'
                  ? 'Receives 1080p60 stream. Auto-retry protocol reconnects within 8 seconds if YouTube socket resets.'
                  : '1080p60 स्ट्रीम प्राप्त करता है। कनेक्शन टूटने पर 8 सेकंड में ऑटो-रीकनेक्ट करता है।'}
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Pipeline: <code className="text-zinc-300">ffmpeg -stream_loop -1 -re -i input.mp4 -c:v copy -f flv rtmp://...</code></span>
            </span>
            <span className="text-emerald-400 font-mono">Zero Phone Drain</span>
          </div>
        </div>
      )}
    </div>
  );
};
