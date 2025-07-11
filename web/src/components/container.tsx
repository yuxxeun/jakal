import React from "react";

type Scoped = "compact" | "wide";

interface ContainerProps {
  children: React.ReactNode;
  scoped?: Scoped;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  scoped = "wide",
  className = "",
}) => {
  const scopedClass = scoped === "compact" ? "max-w-2xl" : "max-w-4xl";

  return (
    <div className={`mx-auto px-5 ${scopedClass} ${className}`}>{children}</div>
  );
};

export default Container;
