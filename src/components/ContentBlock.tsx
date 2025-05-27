import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContentBlockProps {
  contentType: "routes" | "promotions" | "trust";
  title: string;
  description?: string;
  items: Array<RouteItem | PromotionItem | TrustItem>;
}

interface RouteItem {
  id: string;
  title: string;
  description: string;
  image: string;
  action: string;
}

interface PromotionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  action: string;
}

interface TrustItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  action: string;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  contentType,
  title,
  description,
  items = [],
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const itemsPerPage = 3;

  useEffect(() => {
    if (items.length > 0) {
      updateVisibleItems();
    }
  }, [items, currentIndex]);

  const updateVisibleItems = () => {
    const visibleItems = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % items.length;
      visibleItems.push(items[index]);
    }
    setVisibleItems(visibleItems);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length,
    );
  };

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderItems = () => {
    switch (contentType) {
      case "routes":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(visibleItems as RouteItem[]).map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full">
                    <img
                      src={
                        route.image ||
                        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"
                      }
                      alt={route.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{route.title}</CardTitle>
                    <CardDescription>{route.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" className="ml-auto">
                      {route.action} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      case "promotions":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(visibleItems as PromotionItem[]).map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col">
                    <div className="relative h-48 w-full">
                      <img
                        src={
                          promo.image ||
                          "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=800&q=80"
                        }
                        alt={promo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardHeader>
                        <CardTitle className="text-lg">{promo.title}</CardTitle>
                        <CardDescription>{promo.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full">{promo.action}</Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      case "trust":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(visibleItems as TrustItem[]).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="mx-auto flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {items.length > 0 && (
            <div className="relative">
              <AnimatePresence mode="wait">{renderItems()}</AnimatePresence>
              {items.length > itemsPerPage && (
                <div className="flex justify-between mt-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrev}
                      className="rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, items.length) }).map(
                      (_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 1 }}
                          animate={{
                            scale: i === currentIndex % 5 ? 1.2 : 1,
                            backgroundColor:
                              i === currentIndex % 5
                                ? "var(--primary)"
                                : "#d1d5db",
                          }}
                          transition={{ duration: 0.3 }}
                          className={`h-2 w-2 rounded-full`}
                        />
                      ),
                    )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNext}
                      className="rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ContentBlock;
