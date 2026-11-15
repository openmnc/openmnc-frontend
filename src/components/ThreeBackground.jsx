import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function StarField({ section = 'hero' }) {
  const ref = useRef()
  const color = section === 'about' ? '#ff9500' : '#00f5ff'

  const positions = useMemo(() => {
    const count = 80
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.02
      ref.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  )
}

function IcosahedronWire({ section = 'hero' }) {
  const meshRef = useRef()
  const color = section === 'about' ? '#ff9500' : '#00f5ff'

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.08
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.12
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  )
}

function DriftingRing({ section = 'hero' }) {
  const ringRef = useRef()
  const color = section === 'about' ? '#ff9500' : '#00f5ff'

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3 + state.clock.elapsedTime * 0.05
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.08
      ringRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3
    }
  })

  return (
    <mesh ref={ringRef} position={[2, -1, -3]}>
      <torusGeometry args={[1, 0.02, 8, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} />
    </mesh>
  )
}

export default function ThreeBackground({ section = 'hero', className = '' }) {
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, powerPreference: 'low-power' }}
      >
        <StarField section={section} />
        <IcosahedronWire section={section} />
        <DriftingRing section={section} />
      </Canvas>
    </div>
  )
}
