import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { paths } from './paths';
import { blueTeamColor, defaultColors, defaultLandValues, greenTeamColor, mapColorLight1, mapColorLight2, redTeamColor, teamColors } from './consts';
import soldierSvg from './soldier.svg';
import baseSvg from './base.svg';
import wallpaper from './final.jpeg';

// Mapping of region names to their largest county
const largestCountyMap: { [key: string]: string } = {
  'Arad_Timis_Caras-Severin': 'Timis',
  'Bihor_Cluj_Salaj': 'Cluj',
  'Satu Mare_Maramures_Bistrita-Nasaud': 'Maramures',
  'Botosani_Suceava': 'Suceava',
  'Iasi_Neamt': 'Iasi',
  'Vaslui_Bacau': 'Bacau',
  'Galati_Vrancea': 'Galati',
  'Buzau_Braila': 'Buzau',
  'Constanta_Tulcea': 'Constanta',
  'Calarasi_Ialomita': 'Ialomita',
  'Teleorman_Giurgiu_Ilfov_Bucharest': 'Bucharest',
  'Mehedinti_Dolj_Olt_Gorj': 'Dolj',
  'Hunedoara_Brasov_Sibiu_Alba': 'Brasov',
  'Covasna_Mures_Harghita': 'Mures',
  'Dâmbovita_Arges_Vâlcea_Prahova': 'Arges'
};

// Mapping of county names to their 2-letter abbreviations
const countyAbbreviationMap: { [key: string]: string } = {
  'Timis': 'TM',
  'Cluj': 'CJ',
  'Maramures': 'MM',
  'Suceava': 'SV',
  'Iasi': 'IS',
  'Bacau': 'BC',
  'Galati': 'GL',
  'Buzau': 'BZ',
  'Constanta': 'CT',
  'Ialomita': 'IL',
  'Bucharest': 'B',
  'Dolj': 'DJ',
  'Brasov': 'BV',
  'Mures': 'MS',
  'Arges': 'AG'
};

type Color = {
  color: string;
  base: boolean;
}

function MapView() {
  const navigate = useNavigate();
  const [areaOver, setAreaOver] = useState<number | null>(null)
  const [colors, setColors] = useState<Color[]>(defaultColors)
  const [landValues, setLandValues] = useState<number[]>(defaultLandValues)
  const [activeColor, setActiveColor] = useState<Color>({ color: redTeamColor, base: false })
  const [selectedBox, setSelectedBox] = useState<{ sectionIndex: number; colorIndex: number } | null>(null)
  const neighbors = (() => {
    let neighbors: number[] = [];
    colors.forEach((color, index) => {
      if (color.color === activeColor.color) {
        neighbors = [...neighbors, ...paths[index].neighbours]
      }
    }
    )
    return neighbors;
  })();

  // Method to check if a team has no neighbors that are empty (#C1C1C1)
  const hasNoEmptyNeighbors = (teamColor: string): boolean => {
    const emptyColor = '#C1C1C1';

    // Find all areas owned by this team
    const teamAreas: number[] = [];
    colors.forEach((color, index) => {
      if (color.color === teamColor) {
        teamAreas.push(index);
      }
    });

    // If team has no areas, return true (no neighbors to check)
    if (teamAreas.length === 0) {
      return true;
    }

    // Get all unique neighbors of team areas
    const allNeighbors = new Set<number>();
    teamAreas.forEach(areaIndex => {
      paths[areaIndex].neighbours.forEach(neighborIndex => {
        allNeighbors.add(neighborIndex);
      });
    });

    // Check if any neighbor is empty
    const neighborsArray = Array.from(allNeighbors);
    for (let i = 0; i < neighborsArray.length; i++) {
      const neighborIndex = neighborsArray[i];
      if (colors[neighborIndex]?.color === emptyColor) {
        return false; // Found an empty neighbor
      }
    }

    return true; // No empty neighbors found
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Example: Ctrl + K
      if (e.key === "k") {
        e.preventDefault();
        console.log("Ctrl + K pressed!");
        setActiveColor((prevState) => {
          const index = teamColors.findIndex(c => c.color === prevState.color);
          console.log(index, teamColors[(index + 1) % teamColors.length])
          return teamColors[(index + 1) % teamColors.length];
        })
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const hasBase = ((color: Color) => {
    return colors.some(c => c.color === color.color && c.base);
  });

  // Generate random color orders for 6 sections
  const colorSections = useMemo(() => {
    const allColors = [redTeamColor, greenTeamColor, blueTeamColor];
    const sections = [];
    for (let i = 0; i < 6; i++) {
      // Shuffle the colors array
      const shuffled = [...allColors].sort(() => Math.random() - 0.5);
      sections.push(shuffled);
    }
    return sections;
  }, []);

  const onClick = (color: Color, index: number) => {
    if (hasBase(color) && !neighbors.includes(index) && !hasNoEmptyNeighbors(color.color)) {
      return;
    }
    const newColors = [...colors];
    const newLandValues = [...landValues];
    if (newColors[index].color !== '#C1C1C1' && newColors[index].color !== color.color && newLandValues[index] !== 1000) {
      newLandValues[index] = 400;
    } else {
      if (!colors.find(c => c.color === color.color)) {
        newColors[index].base = true;
        newLandValues[index] = 1000;
      }
    }
    newColors[index].color = color.color;
    setColors(newColors);
    setLandValues(newLandValues);
  }

  const calculateTeamScore = (color: Color | null) => {
    if (!color) {
      return 0;
    }
    return landValues.reduce((acc, value, index) => {
      return acc + (colors[index].color === color.color ? value : 0)
    }, 0);
  }

  const getFill = (index: number) => {
    if (colors[index].color !== '#C1C1C1') {
      return colors[index].color;
    }
    if (neighbors.includes(index)) {
      if (areaOver === index) {
        return mapColorLight1(activeColor.color);
      }
      return mapColorLight2(activeColor.color);
    }
    if (hasNoEmptyNeighbors(activeColor.color)) {
      return mapColorLight2(activeColor.color);
    }
    return colors[index].color;
  }

  console.log(neighbors)

  return (
    <div className="App" style={{
      backgroundImage: `url(${wallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', right: 40, zIndex: 10 }}>
        <div style={{ border: activeColor.color === redTeamColor ? '2px solid #ffffff' : 'none', cursor: 'pointer', backgroundColor: redTeamColor, width: 60, height: 60, fontSize: '30px' }} onClick={() => setActiveColor({ color: redTeamColor, base: false })} />
        <div style={{ border: activeColor.color === greenTeamColor ? '2px solid #ffffff' : 'none', cursor: 'pointer', backgroundColor: greenTeamColor, width: 60, height: 60, fontSize: '30px' }} onClick={() => setActiveColor({ color: greenTeamColor, base: false })} />
        <div style={{ border: activeColor.color === blueTeamColor ? '2px solid #ffffff' : 'none', cursor: 'pointer', backgroundColor: blueTeamColor, width: 60, height: 60, fontSize: '30px' }} onClick={() => setActiveColor({ color: blueTeamColor, base: false })} />
      </div>

      {/* Vertical line with 6 sections */}
      <div style={{
        position: 'absolute',
        right: 40,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: 'center',
        zIndex: 10
      }}>
        {colorSections.map((sectionColors, sectionIndex) => (
          <div
            key={sectionIndex}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              alignItems: 'center'
            }}
          >
            {sectionColors.map((color, colorIndex) => {
              const isSelected = selectedBox?.sectionIndex === sectionIndex && selectedBox?.colorIndex === colorIndex;
              return (
                <div
                  key={colorIndex}
                  onClick={() => setSelectedBox({ sectionIndex, colorIndex })}
                  style={{
                    width: '25px',
                    height: '25px',
                    backgroundColor: color,
                    border: isSelected ? '3px solid #ffffff' : '1px solid #ffffff',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 8px rgba(255, 255, 255, 0.8)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, display: 'flex', fontSize: 30 }}>
        <div style={{ cursor: 'pointer', backgroundColor: redTeamColor, width: 300, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold', color: '#ffffff' }} onClick={() => setActiveColor({ color: redTeamColor, base: false })}>
          {calculateTeamScore({ color: redTeamColor, base: false })}
        </div>
        <div style={{ cursor: 'pointer', backgroundColor: greenTeamColor, width: 300, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold', color: '#ffffff' }} onClick={() => setActiveColor({ color: greenTeamColor, base: false })}>
          {calculateTeamScore({ color: greenTeamColor, base: false })}
        </div>
        <div style={{ cursor: 'pointer', backgroundColor: blueTeamColor, width: 300, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold', color: '#ffffff' }} onClick={() => setActiveColor({ color: '#2D69A4', base: false })}>
          {calculateTeamScore({ color: blueTeamColor, base: false })}
        </div>
      </div>

      <svg 
        baseProfile="tiny" 
        stroke="#ffffff" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth=".5" 
        version="1.2" 
        viewBox="0 0 1000 704" 
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg">
        <g id="features" onMouseLeave={() => setAreaOver(null)} >
          {paths.map(({ d, name, id, stroke, textPosition }, index) => {
            const centerX = textPosition?.x ?? 500;
            const centerY = textPosition?.y ?? 352;
            const scale = 0.98;
            return (
              <g
                key={index}
                transform={`translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX}, ${-centerY})`}
              >
                <path
                  className="region-path"
                  cursor='pointer'
                  d={d}
                  name={name}
                  id={id}
                  stroke={stroke}
                  fill={getFill(index)}
                  onMouseOver={() => setAreaOver(index)}
                  onClick={() => onClick(activeColor, index)} />
              </g>
            );
          })}
          {paths.map(({ textPosition, name }, index) => {
            if (!textPosition) return null;
            
            return (
              <g key={`icon-text-${index}`}>
                {/* County abbreviation - always displayed */}
                <text
                  x={textPosition.x}
                  y={textPosition.y - 15}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#000000"
                  fontSize="28"
                  fontFamily='Copperplate'
                  fontWeight="bold"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  paintOrder="stroke fill"
                >
                  {countyAbbreviationMap[largestCountyMap[name] || name.split('_')[0]] || largestCountyMap[name] || name.split('_')[0]}
                </text>
                {/* Icons and score - only displayed when territory is occupied */}
                {colors[index].color !== '#C1C1C1' && (
                  <>
                    {colors[index].base ? (
                      <image
                        href={baseSvg}
                        x={textPosition.x - 15}
                        y={textPosition.y - 58}
                        width="30"
                        height="30"
                        pointerEvents="none"
                      />
                    ) :
                      <image
                        href={soldierSvg}
                        x={textPosition.x - 15}
                        y={textPosition.y - 58}
                        width="25"
                        height="25"
                        pointerEvents="none"
                      />}
                    <text
                      x={textPosition.x}
                      y={textPosition.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#000000"
                      fontSize="20"
                      fontFamily='Copperplate'
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      {landValues[index]}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <button
        onClick={() => navigate('/question')}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          padding: '16px 32px',
          fontSize: '20px',
          fontWeight: 600,
          color: '#ffffff',
          background: 'linear-gradient(135deg, #dc2626 0%, #16a34a 100%)',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.6)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #dc2626 100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.4)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #16a34a 100%)';
        }}
      >
        Choice
      </button>

      <button
        onClick={() => navigate('/numeric-question')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          padding: '16px 32px',
          fontSize: '20px',
          fontWeight: 600,
          color: '#ffffff',
          background: 'linear-gradient(135deg, #dc2626 0%, #16a34a 100%)',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.6)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #dc2626 100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.4)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #16a34a 100%)';
        }}
      >
        Numeric
      </button>
    </div>
  );
}

export default MapView;

