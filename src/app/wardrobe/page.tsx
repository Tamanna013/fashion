"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Shirt, Tangent as Pants, Shovel as Shoe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { WardrobeItem } from "@/lib/types";
import { useAuth } from "@/components/auth-provider";

const categories = ["All", "Tops", "Bottoms", "Shoes", "Accessories"];
const occasions = ["Casual", "Formal", "Sport", "Party"];

export default function WardrobePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOccasion, setSelectedOccasion] = useState("Casual");
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWardrobeItems();
    }
  }, [user]);

  const loadWardrobeItems = async () => {
    try {
      const { data, error } = await supabase
        .from("wardrobe_items")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("Error loading wardrobe items:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "tops":
        return Shirt;
      case "bottoms":
        return Pants;
      case "shoes":
        return Shoe;
      default:
        return Shirt;
    }
  };

  const filteredItems = items.filter(
    item => selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-8">My Wardrobe</h1>
        
        <div className="flex gap-4 mb-8 justify-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Occasion" />
            </SelectTrigger>
            <SelectContent>
              {occasions.map(occasion => (
                <SelectItem key={occasion} value={occasion}>
                  {occasion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            className="bg-pink-500 hover:bg-pink-600"
            onClick={() => router.push(`/recommendations?occasion=${selectedOccasion}`)}
          >
            Get Outfit Suggestion
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading your wardrobe...</div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const Icon = getIconForCategory(item.category);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-square mb-4 relative rounded-lg overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <Icon className="h-6 w-6 text-pink-500 mb-2 mx-auto" />
                    <h3 className="text-lg font-semibold text-center">{item.name}</h3>
                    <p className="text-sm text-gray-500 text-center">{item.category}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}