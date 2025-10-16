/* eslint-disable no-param-reassign -- Allow for three.js */
/* eslint-disable react/no-unknown-property -- Allow for three.js */
import { forwardRef, useLayoutEffect, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { type Mesh, type IUniform } from 'three';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './constants';

type MeshRefType = RefObject<Mesh | null>;

interface SilkPlaneProps {
  uniforms: Record<string, IUniform>;
}

export const SilkPlane = forwardRef<Mesh, SilkPlaneProps>(({ uniforms }, ref) => {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if ((ref as MeshRefType).current) {
      (ref as RefObject<Mesh>).current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_, delta) => {
    // @ts-expect-error -- false positive
    (ref as RefObject<Mesh>).current.material.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={VERTEX_SHADER} fragmentShader={FRAGMENT_SHADER} />
    </mesh>
  );
});

SilkPlane.displayName = 'SilkPlane';
