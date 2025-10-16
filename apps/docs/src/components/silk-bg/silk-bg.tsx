'use client';

import { type FC, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Color, type Mesh, type IUniform } from 'three';
import { cn, hexToNormalizedRGB } from '@/lib/utils';
import { SilkPlane } from './silk-plane';

interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
}

export const Silk: FC<SilkProps> = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
  className,
}) => {
  const meshRef = useRef<Mesh | null>(null);

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation],
  );

  return (
    <Canvas dpr={[1, 2]} frameloop="always" className={cn(className)}>
      <SilkPlane ref={meshRef} uniforms={uniforms as unknown as Record<string, IUniform>} />
    </Canvas>
  );
};
