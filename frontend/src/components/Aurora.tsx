import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

interface AuroraProps {
  colorStops?: [string, string, string];
  amplitude?: number;
  speed?: number;
}

const VERT = `#version 300 es
in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
out vec4 fragColor;

float snoise(vec2 v) {
    vec2 i = floor(v);
    vec2 f = fract(v);
    float a = dot(i, vec2(12.9898, 78.233));
    float b = dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233));
    return mix(fract(sin(a) * 43758.5453), fract(sin(b) * 43758.5453), f.x);
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float noise = snoise(uv * 10.0 + uTime * 0.1) * 0.5 + 0.5;
    fragColor = vec4(uColorStops[0] * noise, 1.0);
}
`;

export default function Aurora({ colorStops = ["#00d8ff", "#7cff67", "#00d8ff"], amplitude = 1.0 }: AuroraProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ctnDom.current || canvasRef.current) return;

    const renderer = new Renderer();
    const gl = renderer.gl;
    canvasRef.current = gl.canvas;

    gl.clearColor(0, 0, 0, 1);
    ctnDom.current.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStops.map((hex) => {
          const c = new Color(hex);
          return [c.r, c.g, c.b] as [number, number, number];
        }) },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
    };

    window.addEventListener("resize", resize);
    resize();

    let animationFrameId: number;
    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, [colorStops, amplitude]);

  return <div ref={ctnDom} className="absolute inset-0 w-full h-full" />;
}
