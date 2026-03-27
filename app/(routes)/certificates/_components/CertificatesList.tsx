"use client";

import { useEffect, useRef, useState } from "react";
import { Grid, type CellComponentProps } from "react-window";
import CertificateCard from "./CertificateCard";
import { CertificateCardSkeleton } from "./CertificateCardSkeleton";
import { useDebounce } from "@/utils/useDebounce";
import { cn } from "@/lib/utils";

const ROW_HEIGHT = 400;
const GAP = 20;
const SCROLLBAR_WIDTH = 10;

const CertificatesList = ({
  currentUser,
  certificates,
}: {
  currentUser: UserType;
  certificates: CertificateType[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  // Resize Observer for responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width - SCROLLBAR_WIDTH;
      setContainerWidth(width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Responsive Breakpoints: 1 col on mobile, 2 on desktop
  let columnCount = 1;
  if (containerWidth >= 768) columnCount = 2;

  const rowCount = Math.ceil(certificates.length / columnCount);
  const columnWidth = containerWidth / columnCount;

  return (
    <div
      ref={containerRef}
      className="w-full lg:w-[85%] h-[840px] min-h-0 relative group"
    >
      {certificates.length > 0 ? (
        <>
          <Grid
            cellComponent={CellComponent}
            cellProps={{ data: { certificates, columnCount, currentUser } }}
            columnCount={columnCount}
            columnWidth={columnWidth}
            rowCount={rowCount}
            rowHeight={ROW_HEIGHT + GAP}
            className="no-scrollbar"
            style={{
              width: "100%",
              height: "auto", // 👈 Change from fixed height to auto if you want it to expand
              overflowX: "hidden",
              overflowY: "auto", // 👈 This removes the scrollbar
              paddingRight: "0px",
              paddingLeft: "0px",
            }}
          />

          <div
            className={cn(
              "pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full",
              "bg-gradient-to-t from-background via-background/80 to-transparent",
              "dark:from-background dark:via-background/70 dark:to-transparent",
            )}
          />
        </>
      ) : (
        <div className="flex flex-col gap-4 w-full relative">
          {[1, 2, 3, 4].map((item) => (
            <CertificateCardSkeleton key={item} />
          ))}
        </div>
      )}
    </div>
  );
};

// Cell Component
const CellComponent = ({
  columnIndex,
  rowIndex,
  style,
  data,
}: CellComponentProps<{
  data: {
    certificates: CertificateType[];
    columnCount: number;
    currentUser: UserType;
  };
}>) => {
  const { certificates, columnCount, currentUser } = data;

  const index = rowIndex * columnCount + columnIndex;
  const cert = certificates[index];

  if (!cert) return null;

  const left = typeof style.left === "number" ? style.left : 0;
  const top = typeof style.top === "number" ? style.top : 0;
  const width = typeof style.width === "number" ? style.width : 0;
  const height = typeof style.height === "number" ? style.height : 0;

  const adjustedStyle = {
    ...style,
    left: left + GAP / 2,
    top: top + GAP / 2,
    width: width - GAP,
    height: height - GAP,
  };

  return (
    <div style={adjustedStyle}>
      <CertificateCard cert={cert} currentUser={currentUser} />
    </div>
  );
};

export default CertificatesList;
