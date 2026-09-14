'use client';
import { useMemo, useState } from 'react';
import { geoMercator, geoPath, geoGraticule } from 'd3-geo';
import region from '@/lib/indonesia-region.json';

const islands = [
  {name: 'SUMATRA', point: [100, 2.4]},
  {name: 'JAWA', point: [111, -6]},
  {name: 'KALIMANTAN', point: [114, 1.3]},
  {name: 'SULAWESI', point: [121.1, -3.9]},
  {name: 'PAPUA', point: [137, -3.3]},
  {name: 'NUSA TENGGARA', point: [119, -10.4]},
  {name: 'MALUKU', point: [130.4, -1.9]}
];

const volcanoes = [
  {name: "Sinabung", point: [98.392, 3.17]},
  {name: "Kerinci", point: [101.264, -1.697]},
  {name: "Anak Krakatau", point: [105.423, -6.101]},
  {name: "Tangkuban Parahu", point: [107.6, -6.77]},
  {name: "Merapi", point: [110.446, -7.54]},
  {name: "Semeru", point: [112.922, -8.108]},
  {name: "Ijen", point: [114.242, -8.058]},
  {name: "Agung", point: [115.508, -8.343]},
  {name: "Rinjani", point: [116.47, -8.42]},
  {name: "Tambora", point: [118, -8.25]},
  {name: "Kelimutu", point: [121.82, -8.77]},
  {name: "Lokon", point: [124.7992, 1.3644]},
  {name: "Soputan", point: [124.737, 1.112]},
  {name: "Dukono", point: [127.8783, 1.6992]},
  {name: "Ibu", point: [127.6324, 1.4941]},
  {name: "Gamalama", point: [127.3322, 0.81]}
];

export default function QuizMap({ type, onLocationSelected }: { type: 'island' | 'volcano'; onLocationSelected: (name: string) => void }) {
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const map = useMemo(() => {
    const projection = geoMercator().fitSize([1200, 490], region as any);
    const path = geoPath().projection(projection);
    const graticule = geoPath().projection(projection)(geoGraticule()());
    return { projection, path, graticule };
  }, []);

  const handleClick = (name: string) => {
    setSelectedName(name);
    setTimeout(() => {
      onLocationSelected(name);
    }, 400); // give a little feedback delay
  };

  return (
    <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 1200 490" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <clipPath id="quiz-map-clip"><rect width="1200" height="490"/></clipPath>
        </defs>
        <g clipPath="url(#quiz-map-clip)">
          <path d={map.graticule || ''} style={{ fill: 'none', stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
          {region.features.map(f => (
            <path key={f.properties.id} d={map.path(f as any) || ''} style={{ fill: f.properties.id === 'IDN' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
          ))}
          {type === 'island' && islands.map(i => {
            const p = map.projection(i.point as [number, number])!;
            const isSelected = selectedName === i.name;
            return (
              <g key={i.name} transform={\	ranslate(\ + p[0] + \,\ + p[1] + \)\} onClick={() => handleClick(i.name)} style={{ cursor: 'pointer' }}>
                <circle r="40" fill={isSelected ? 'rgba(52, 211, 153, 0.4)' : 'transparent'} />
                <text y="5" textAnchor="middle" fill={isSelected ? '#34d399' : '#cbd5e1'} fontSize="16" fontWeight="bold">{i.name}</text>
              </g>
            );
          })}
          {type === 'volcano' && volcanoes.map(v => {
            const p = map.projection(v.point as [number, number])!;
            const isSelected = selectedName === v.name;
            return (
              <g key={v.name} transform={\	ranslate(\ + p[0] + \,\ + p[1] + \)\} onClick={() => handleClick(v.name)} style={{ cursor: 'pointer' }}>
                <circle r="24" fill={isSelected ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.2)'} />
                <circle r="6" fill={isSelected ? '#34d399' : '#ef4444'} />
                <text y="-10" textAnchor="middle" fill={isSelected ? '#34d399' : '#fff'} fontSize="14">{v.name}</text>
              </g>
            );
          })}
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
          {type === 'island' ? 'Klik nama pulau yang diminta pada peta' : 'Klik titik gunung yang diminta pada peta'}
        </div>
      </div>
    </div>
  );
}
