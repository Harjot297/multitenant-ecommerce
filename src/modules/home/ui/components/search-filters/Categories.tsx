"use client"
import CategoryDropdown from "./CategoryDropdown";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import CategoriesSidebar from "./CategoriesSidebar";
import { categoriesGetManyOutput } from "@/modules/categories/types";
import { useParams } from "next/navigation";

interface CategoryProps{
  data : categoriesGetManyOutput, // all array type 
}

const Categories = ({data} : CategoryProps) => {

  const params = useParams();

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHovered , setIsAnyHovered] = useState(false);
  const [isSidebarOpen , setIsSidebarOpen] = useState(false);

  const categoryParam = params.category as string | null;

  const activeCategory = categoryParam ||  "all";

  const activeCategoryIndex = data.findIndex( (cat) => cat.slug === activeCategory);
  const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if(!containerRef.current || !measureRef.current || !viewAllRef.current){
        return;
      }
      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;
      
      for(const item of items){
        const width = item.getBoundingClientRect().width;

        if(totalWidth + width > availableWidth) break;
        totalWidth += width;
        visible++;
      };
      setVisibleCount(visible);
    };

    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);

    return () => resizeObserver.disconnect();

  },[data.length])

  return (
    <div className="relative w-full ">

      {/* categories sidebar */}
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      <div ref={measureRef} className="absolute opacity-0 pointer-events-none flex"
      style={{position: "fixed", top: -9999 , left: -9999}}>
        {/* Hidden div to measure all items */}
        {
        data.map( (category) => (
            <div key={category.id}>
                <CategoryDropdown
                    category={category}
                    isActive={activeCategory === category.slug}
                    isNavigationHovered={false}
                />
            </div>
        ))
      }
      </div>
      {/* Visible Items */}
      <div ref={containerRef}  className="flex flex-nowrap items-center"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {/* TODO: Hardcode "all" button */}
        {
        data.slice(0,visibleCount).map( (category) => (
            <div key={category.id}>
                <CategoryDropdown
                    category={category}
                    isActive={activeCategory === category.slug}
                    isNavigationHovered={isAnyHovered}
                />
            </div>
        ))
      }
      <div ref={viewAllRef} className="shrink-0">
        <Button variant={"elevated"}
          className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            isActiveCategoryHidden && !isAnyHovered && "bg-white border-primary"
          )}
          onClick={() => setIsSidebarOpen(true)}
        >
          View All
          <ListFilterIcon className="ml-2" />
        </Button>
      </div>
      </div>
    </div>
  )
}

export default Categories
