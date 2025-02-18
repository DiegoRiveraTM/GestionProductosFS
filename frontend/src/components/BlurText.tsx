import { useRef, useEffect, useState } from "react";
import { useSprings, animated, SpringValue } from "@react-spring/web";
import type { HTMLAttributes } from "react";

interface AnimationStyle {
  filter?: string;
  opacity?: number;
  transform?: string;
}

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: AnimationStyle;
  animationTo?: AnimationStyle[];
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
}

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  // Animaciones predeterminadas según la dirección
  const defaultFrom: AnimationStyle =
    direction === "top"
      ? { filter: "blur(10px)", opacity: 0, transform: "translate3d(0,-50px,0)" }
      : { filter: "blur(10px)", opacity: 0, transform: "translate3d(0,50px,0)" };

  const defaultTo: AnimationStyle[] = [
    {
      filter: "blur(5px)",
      opacity: 0.5,
      transform:
        direction === "top" ? "translate3d(0,5px,0)" : "translate3d(0,-5px,0)",
    },
    { filter: "blur(0px)", opacity: 1, transform: "translate3d(0,0,0)" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(
    elements.length,
    elements.map((_, i) => ({
      from: animationFrom || defaultFrom,
      to: inView
        ? async (
            next: (arg: Record<string, SpringValue<string | number>>) => Promise<void>
          ) => {
            for (const step of animationTo || defaultTo) {
              // Se fuerza el type assertion para convertir el objeto
              await next(step as unknown as Record<string, SpringValue<string | number>>);
            }
            animatedCount.current += 1;
            if (animatedCount.current === elements.length && onAnimationComplete) {
              onAnimationComplete();
            }
          }
        : animationFrom || defaultFrom,
      delay: i * delay,
      config: { easing },
    }))
  );

  // Se define una versión tipada de animated.span para aceptar children.
  const AnimatedSpan = animated.span as unknown as React.FC<
    HTMLAttributes<HTMLSpanElement> & { style?: React.CSSProperties }
  >;

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {springs.map((props, index) => (
        <AnimatedSpan
          key={index}
          style={props as React.CSSProperties}
          className="inline-block transition-transform will-change-[transform,filter,opacity]"
        >
          {elements[index] === " " ? "\u00A0" : elements[index]}
          {animateBy === "words" && index < elements.length - 1 ? "\u00A0" : null}
        </AnimatedSpan>
      ))}
    </p>
  );
};

export default BlurText;
