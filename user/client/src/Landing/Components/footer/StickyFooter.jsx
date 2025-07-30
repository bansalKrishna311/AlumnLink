import React from "react";
import Content from "./Content";

export default function StickyFooter() {
  return (
    <div
      className="relative h-[55vh]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed bottom-0 w-full">
        <Content />
      </div>
    </div>
  );
}
  