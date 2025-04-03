"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
/*
import { supabase } from "@/lib/supabase";
*/
import { useAuth } from "../components/ui/auth-provider";
import { WardrobeItem, Outfit } from "../lib/types";

function Model({ outfit }: { outfit: WardrobeItem[] }) {
  return (
    <group>
      {outfit.map((item, index) => (
        <mesh key={item.id} position={[0, index * 2 - 2, 0]}>
          <boxGeometry args={[1, 1, 0.5]} />
          <meshStandardMaterial color={index % 2 === 0 ? "pink" : "white"} />
        </mesh>
      ))}
    </group>
  );
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [occasion, setOccasion] = useState(searchParams.get("occasion") || "casual");
  const [loading, setLoading] = useState(false);
  const [recommendedOutfit, setRecommendedOutfit] = useState<WardrobeItem[]>([]);

  const handleGetRecommendation = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get user's wardrobe items
      const { data: wardrobeItems } = await supabase
        .from("wardrobe_items")
        .select("*")
        .eq("user_id", user.id);

      if (!wardrobeItems?.length) {
        throw new Error("No items in wardrobe");
      }

      // Simple recommendation logic (to be enhanced with AI)
      const outfit = {
        tops: wardrobeItems.find(item => item.category.toLowerCase() === "tops"),
        bottoms: wardrobeItems.find(item => item.category.toLowerCase() === "bottoms"),
        shoes: wardrobeItems.find(item => item.category.toLowerCase() === "shoes"),
        accessories: wardrobeItems.find(item => item.category.toLowerCase() === "accessories"),
      };

      const recommendedItems = Object.values(outfit).filter(Boolean) as WardrobeItem[];
      setRecommendedOutfit(recommendedItems);

      // Save outfit to database
      await supabase.from("outfits").insert({
        user_id: user.id,
        name: `${occasion} Outfit`,
        occasion: occasion,
      });

    } catch (err) {
      console.error("Error generating recommendation:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetRecommendation();
  }, [occasion]);

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-8">Outfit Recommendations</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Choose Your Occasion</h2>
            <div className="space-y-4">
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                className="w-full bg-pink-500 hover:bg-pink-600"
                onClick={handleGetRecommendation}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <Sparkles className="animate-spin mr-2" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="mr-2" />
                    Get Recommendation
                  </span>
                )}
              </Button>
            </div>

            {recommendedOutfit.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Recommended Outfit</h3>
                <div className="space-y-4">
                  {recommendedOutfit.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">3D Preview</h2>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <Model outfit={recommendedOutfit} />
                <OrbitControls />
              </Canvas>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}