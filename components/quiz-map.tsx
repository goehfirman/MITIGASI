'use client';
import { useMemo, useState } from 'react';
import { geoMercator, geoPath, geoGraticule } from 'd3-geo';
import region from '@/lib/indonesia-region.json';

const islands = [
  { name: 'SUMATRA', point: [101.5, -0.2] },
  { name: 'JAWA', point: [110.2, -7.3] },
  { name: 'KALIMANTAN', point: [113.8, -0.2] },
  { name: 'SULAWESI', point: [120.8, -2.2] },
  { name: 'PAPUA', point: [137.0, -4.2] },
  { name: 'NUSA TENGGARA', point: [120.0, -8.6] },
  { name: 'MALUKU', point: [128.5, -3.2] }
];

const volcanoes = [
  { name: "Sinabung", point: [98.392, 3.17] },
  { name: "Kerinci", point: [101.264, -1.697] },
  { name: "Anak Krakatau", point: [105.423, -6.101] },
  { name: "Tangkuban Parahu", point: [107.6, -6.77] },
  { name: "Merapi", point: [110.446, -7.54] },
  { name: "Semeru", point: [112.922, -8.108] },
  { name: "Ijen", point: [114.242, -8.058] },
  { name: "Agung", point: [115.508, -8.343] },
  { name: "Rinjani", point: [116.47, -8.42] },
  { name: "Tambora", point: [118, -8.25] },
  { name: "Kelimutu", point: [121.82, -8.77] },
  { name: "Lokon", point: [124.7992, 1.3644] },
  { name: "Soputan", point: [124.737, 1.112] },
  { name: "Dukono", point: [127.8783, 1.6992] },
  { name: "Ibu", point: [127.6324, 1.4941] },
  { name: "Gamalama", point: [127.3322, 0.81] }
];

export default function QuizMap({ type, onLocationSelected }: { type: 'island' | 'volcano'; onLocationSelected: (name: string) => void }) {
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const map = useMemo(() => {
    // Focus strictly on Indonesia (IDN) to make Indonesia fill the entire 1200x490 viewBox
    const indonesia = region.features.find((f: any) => f.properties.id === 'IDN')!;
    const projection = geoMercator().fitExtent([[35, 25], [1165, 465]], indonesia as any);
    const path = geoPath(projection);
    const graticule = path(geoGraticule().extent([[90, -18], [149, 12]]).step([5, 5])());

    const arcs = [
      path({ type: 'LineString', coordinates: volcanoes.slice(0, 11).map(v => v.point) }),
      path({ type: 'LineString', coordinates: [volcanoes[12].point, volcanoes[11].point] }),
      path({ type: 'LineString', coordinates: [volcanoes[15].point, volcanoes[14].point, volcanoes[13].point] })
    ];

    return { projection, path, graticule, arcs };
  }, []);

  const handleClick = (name: string) => {
    setSelectedName(name);
    setTimeout(() => {
      onLocationSelected(name);
    }, 350);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0a2228',
      borderRadius: '16px',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.6)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg
        viewBox="0 0 1200 490"
        className="indonesia-map"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <clipPath id="quiz-map-clip"><rect width="1200" height="490" /></clipPath>
        </defs>
        <g clipPath="url(#quiz-map-clip)">
          {/* Graticule lines */}
          <path d={map.graticule || ''} className="map-graticule" />

          {/* Landmass: Indonesia (#8fc9ac) and Neighbors (#2b5058) */}
          {region.features.map((f: any) => (
            <path
              key={f.properties.id}
              d={map.path(f) || ''}
              className={f.properties.id === 'IDN' ? 'map-land' : 'map-neighbor'}
            />
          ))}

          {/* Ocean Labels */}
          <text x="135" y="420" className="ocean-label">SAMUDRA HINDIA</text>
          <text x="980" y="75" className="ocean-label">SAMUDRA PASIFIK</text>

          {/* Ring of Fire arcs if volcano question */}
          {type === 'volcano' && (
            <g className="fire-paths">
              {map.arcs.map((d, i) => (
                <g key={i}>
                  <path className="fire-glow" d={d || ''} />
                  <path className="fire-route" d={d || ''} />
                </g>
              ))}
            </g>
          )}

          {/* Island Clickable Points (No text labels so students have to identify the island themselves) */}
          {type === 'island' && islands.map(i => {
            const p = map.projection(i.point as [number, number])!;
            const isSelected = selectedName === i.name;
            return (
              <g
                key={i.name}
                transform={"translate(" + p[0] + "," + p[1] + ")"}
                onClick={() => handleClick(i.name)}
                style={{ cursor: 'pointer' }}
              >
                {/* Large clickable hit-box */}
                <circle r="30" fill="transparent" />

                {/* Pulse ring */}
                <circle
                  r={isSelected ? 22 : 14}
                  className={isSelected ? "" : "volcano-pulse"}
                  fill={isSelected ? "rgba(52, 211, 153, 0.45)" : "rgba(56, 189, 248, 0.35)"}
                  stroke={isSelected ? "#34d399" : "#38bdf8"}
                  strokeWidth={isSelected ? 2.5 : 1}
                />

                {/* Outer circle */}
                <circle
                  r={isSelected ? 10 : 8}
                  fill={isSelected ? "#059669" : "#0284c7"}
                  stroke={isSelected ? "#34d399" : "#ffffff"}
                  strokeWidth={2}
                />

                {/* Center dot */}
                <circle
                  r={isSelected ? 4 : 3}
                  fill={isSelected ? "#ffffff" : "#bae6fd"}
                />

                {/* Selection ring feedback */}
                {isSelected && (
                  <circle
                    r="16"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                )}
              </g>
            );
          })}

          {/* Volcano Clickable Points */}
          {type === 'volcano' && volcanoes.map(v => {
            const p = map.projection(v.point as [number, number])!;
            const isSelected = selectedName === v.name;
            return (
              <g
                key={v.name}
                transform={"translate(" + p[0] + "," + p[1] + ")"}
                onClick={() => handleClick(v.name)}
                style={{ cursor: 'pointer' }}
              >
                {/* Large clickable hit-box */}
                <circle r="26" fill="transparent" />

                {/* Pulse ring */}
                <circle
                  r={isSelected ? 20 : 13}
                  className={isSelected ? "" : "volcano-pulse"}
                  fill={isSelected ? "rgba(52, 211, 153, 0.5)" : "rgba(251, 108, 83, 0.45)"}
                  stroke={isSelected ? "#34d399" : "none"}
                  strokeWidth={isSelected ? 2.5 : 0}
                />

                {/* Center dot */}
                <circle
                  r={isSelected ? 8 : 6}
                  fill={isSelected ? "#34d399" : "#fd624b"}
                  stroke={isSelected ? "#ffffff" : "#ffe2b1"}
                  strokeWidth={isSelected ? 2 : 1.5}
                />

                {/* Highlighted selection indicator without leaking volcano name */}
                {isSelected && (
                  <circle
                    r="14"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(8, 29, 46, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          padding: '6px 18px',
          borderRadius: '20px',
          color: '#e2ecee',
          fontSize: '13px',
          fontWeight: 600
        }}>
          {type === 'island' ? '👆 Klik titik pulau yang sesuai pada peta' : '🌋 Klik titik merah gunung api yang sesuai pada peta'}
        </div>
      </div>
    </div>
  );
}

