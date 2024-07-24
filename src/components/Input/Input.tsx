"use client";
import * as React from "react";
import { cn } from "@/utils/cn";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onButtonClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onButtonClick, ...props }, ref) => {
    const radius = 100; // change this to increase the radius of the hover effect
    const [visible, setVisible] = React.useState(false);

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }
    return (
      <motion.div
        style={{
          background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          var(--blue-500),
          transparent 80%
        )
      `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[2px] rounded-lg transition duration-300 group/input"
      >
        <div className="relative flex items-center">
          <input
            type={type}
            className={cn(
              `flex h-10 w-full bg-black border-white/[0.4] border text-white shadow-input  px-3 py-2 text-sm file:border-0 file:bg-transparent 
              file:text-sm file:font-medium placeholder-text-neutral-600 
              focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-600
              disabled:cursor-not-allowed disabled:opacity-50
              dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
              group-hover/input:shadow-none transition duration-400 pr-16 rounded-md`,
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            onClick={onButtonClick}
            className="absolute right-2 bg-black text-white px-4 py-1  border-l border-l-white/[0.4] transition"
          >
            Submit
          </button>
        </div>
      </motion.div>
    );
  }
);
Input.displayName = "Input";

export { Input };
