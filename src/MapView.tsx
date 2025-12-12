import React, { useEffect, useState } from 'react';
import './App.css';
import { paths } from './paths';
import { blueTeamColor, defaultColors, defaultLandValues, greenTeamColor, mapColorLight1, mapColorLight2, redTeamColor, teamColors } from './consts';
import soldierSvg from './soldier.svg';
import baseSvg from './base.svg';
import wallpaper from './wallpaper.jpg';

type Color = {
  color: string;
  base: boolean;
}

function MapView() {
  const [areaOver, setAreaOver] = useState<number | null>(null)
  const [colors, setColors] = useState<Color[]>(defaultColors)
  const [landValues, setLandValues] = useState<number[]>(defaultLandValues)
  const [activeColor, setActiveColor] = useState<Color>({ color: redTeamColor, base: false })
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

  const onClick = (color: Color, index: number) => {
    if (hasBase(color) && !neighbors.includes(index)) {
      return;
    }
    const newColors = [...colors];
    const newLandValues = [...landValues];
    if (newColors[index].color !== '#C1C1C1' && newColors[index].color !== color.color) {
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
    return colors[index].color;
  }

  return (
    <div className="App" style={{
      backgroundImage: `url(${wallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      width: '100%'
    }}>
      <div style={{ position: 'absolute', right: 0 }}>
        <div style={{ border: activeColor.color === redTeamColor ? '2px solid #ffffff' : 'none', cursor: 'pointer', backgroundColor: redTeamColor, width: 60, height: 60 }} onClick={() => setActiveColor({ color: redTeamColor, base: false })} />
        <div style={{ border: activeColor.color === greenTeamColor ? '2px solid #ffffff' : 'none', cursor: 'pointer', backgroundColor: greenTeamColor, width: 60, height: 60 }} onClick={() => setActiveColor({ color: greenTeamColor, base: false })} />
        <div style={{ border: activeColor.color === blueTeamColor ? '2px solid #ffffff' : 'none', cursor: 'pointer', backgroundColor: blueTeamColor, width: 60, height: 60 }} onClick={() => setActiveColor({ color: blueTeamColor, base: false })} />
      </div>
      <div style={{ position: 'absolute', left: 0, display: 'flex', fontSize: 30 }}>
        <div style={{ cursor: 'pointer', backgroundColor: redTeamColor, width: 300, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setActiveColor({ color: redTeamColor, base: false })}>
          {calculateTeamScore({ color: redTeamColor, base: false })}
        </div>
        <div style={{ cursor: 'pointer', backgroundColor: greenTeamColor, width: 300, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setActiveColor({ color: greenTeamColor, base: false })}>
          {calculateTeamScore({ color: greenTeamColor, base: false })}
        </div>
        <div style={{ cursor: 'pointer', backgroundColor: '#2D69A4', width: 300, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setActiveColor({ color: '#2D69A4', base: false })}>
          {calculateTeamScore({ color: '#2D69A4', base: false })}
        </div>
      </div>

      <svg baseProfile="tiny" height={window.innerHeight} stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".5" version="1.2" viewBox="0 0 1000 704" width={window.innerWidth} xmlns="http://www.w3.org/2000/svg">
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
          {paths.map(({ textPosition }, index) => {
            return textPosition && (colors[index].color !== '#C1C1C1') ? (
              <g key={`icon-text-${index}`}>
                {colors[index].base ? (
                  <image
                    href={baseSvg}
                    x={textPosition.x - 15}
                    y={textPosition.y - 35}
                    width="30"
                    height="30"
                    pointerEvents="none"
                  />
                ) :
                  <image
                    href={soldierSvg}
                    x={textPosition.x - 15}
                    y={textPosition.y - 35}
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
              </g>
            ) : null
          })}
        </g>
      </svg>
    </div>
  );
}

export default MapView;

