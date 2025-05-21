import {Sheet, SheetContent, SheetHeader, SheetTitle}  from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area";


import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { categoriesGetManyOutput } from "@/modules/categories/types";



interface Props{
    open : boolean;
    onOpenChange: (open: boolean) => void;
    // data : CustomCategory[]; // TODO : Remove this later
}
const CategoriesSidebar = ({open , onOpenChange} : Props) => {

    const trpc = useTRPC();
    const {data} = useQuery(trpc.categories.getMany.queryOptions());

    const router = useRouter();

    const [parentCategories, setParentCategories] = useState<categoriesGetManyOutput | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<categoriesGetManyOutput[1] | null>(null); // [1] means type of single item

    //  If we have parent categories show those otherwise show root category
    const currentCategories = parentCategories ?? data ?? [];

    const handleOpenChange = (open: boolean) => {
        setSelectedCategory(null);
        setParentCategories(null);
        onOpenChange(open);
    }

    const handleCategoryClick = (category : categoriesGetManyOutput[1]) => {
        if(category.subcategories && category.subcategories.length > 0){
            setParentCategories(category.subcategories as categoriesGetManyOutput);
            setSelectedCategory(category);
        } else {
            // This is a leaf category , no sub categories
            if(parentCategories &&   selectedCategory){
                // THis is a subcategory - navigare to /category/subcategory
                router.push(`/${selectedCategory.slug}/${category.slug}`);
            }
            else{
                // This is a main category - navigate to /category
                if(category.slug === "all"){
                    router.push("/");
                }
                else{
                    router.push(`/${category.slug}`);
                }
            }

            handleOpenChange(false);

        }
    }

    const backgroundColor = selectedCategory?.color || "white"

    const handleBackClick = () => {
        if(parentCategories){
            setParentCategories(null);
            setSelectedCategory(null);
        }
    }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
            side="left" className="p-0 transition-none" style={{backgroundColor: backgroundColor}}
        >
            <SheetHeader className="p-4 border-b">
                <SheetTitle>
                    Categories
                </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                {
                    parentCategories && (
                        <button onClick={(handleBackClick)}  className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer">
                            <ChevronLeftIcon className="size-4 mr-2" />
                            Back
                        </button>
                    )
                }
                {
                    currentCategories.map( (category) => {
                        return (
                            <button
                                key={category.slug}
                                onClick={() => handleCategoryClick(category)}
                                className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
                            >
                                {category.name}
                                {
                                    category.subcategories && category.subcategories.length > 0 && (
                                        <ChevronRightIcon className="size-4" />
                                    )
                                }
                            </button>
                        )
                    })
                }
            </ScrollArea>
        </SheetContent>
    </Sheet>
  )
}

export default CategoriesSidebar
