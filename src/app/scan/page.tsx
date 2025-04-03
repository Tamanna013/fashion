"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Camera, Upload, Check } from "lucide-react";
import { motion } from "framer-motion";
/*
import { supabase } from "@/lib/supabase";
*/
import { useAuth } from "../components/ui/auth-provider";

export default function ScanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setError("Error uploading image: " + err.message);
      }
    }
  };

  const handleScan = async () => {
    if (!selectedImage || !user) return;

    setScanning(true);
    setError(null);

    try {
      // Upload image to Supabase Storage
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("wardrobe-images")
        .upload(fileName, base64ToBlob(selectedImage), {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("wardrobe-images")
        .getPublicUrl(fileName);

      // Analyze image using Edge Function
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/scan-clothing`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      if (!response.ok) throw new Error("Failed to analyze image");

      const { name, category } = await response.json();

      // Save to database
      const { error: dbError } = await supabase
        .from("wardrobe_items")
        .insert({
          user_id: user.id,
          name,
          category,
          image_url: publicUrl,
        });

      if (dbError) throw dbError;

      setScanned(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  const base64ToBlob = (base64: string) => {
    const [, data] = base64.split(",");
    const bytes = atob(data);
    const array = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      array[i] = bytes.charCodeAt(i);
    }
    return new Blob([array], { type: "image/jpeg" });
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-8">Scan Your Clothes</h1>
        <Card className="max-w-2xl mx-auto p-8">
          <div className="space-y-6">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-pink-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Selected clothing" 
                  className="max-h-96 mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button 
              className="w-full bg-pink-500 hover:bg-pink-600"
              onClick={handleScan}
              disabled={!selectedImage || scanning}
            >
              {scanning ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">
                    <Camera className="h-5 w-5" />
                  </span>
                  Scanning...
                </div>
              ) : scanned ? (
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Scanned Successfully
                </div>
              ) : (
                <div className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Start Scanning
                </div>
              )}
            </Button>

            {scanned && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-green-50 p-4 rounded-lg"
              >
                <p className="text-green-800">
                  Item successfully added to your wardrobe! Would you like to scan another item or view your wardrobe?
                </p>
                <div className="flex gap-4 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedImage(null);
                      setScanned(false);
                    }}
                  >
                    Scan Another
                  </Button>
                  <Button 
                    className="bg-pink-500 hover:bg-pink-600"
                    onClick={() => router.push("/wardrobe")}
                  >
                    View Wardrobe
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}