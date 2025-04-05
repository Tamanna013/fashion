import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { TrendingUp as Trendies, Sparkles, Camera } from "lucide-react";
import Link from "next/link";
import './globals.css';
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-20 slide-up">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          Your AI-Powered Wardrobe Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get personalized outfit recommendations for any occasion
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/scan">
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600">
              <Camera className="mr-2 h-5 w-5" />
              Scan Your Wardrobe
            </Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" variant="outline">
              <Sparkles className="mr-2 h-5 w-5" />
              Explore Styles
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        <Card className="p-6 scale-in hover:shadow-lg transition-shadow">
          <Camera className="h-12 w-12 text-pink-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Wardrobe Scanner</h3>
          <p className="text-gray-600">
            Easily scan and catalog your clothing items using AI technology
          </p>
        </Card>
        <Card className="p-6 scale-in hover:shadow-lg transition-shadow delay-100">
          <Sparkles className="h-12 w-12 text-pink-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Recommendations</h3>
          <p className="text-gray-600">
            Get personalized outfit suggestions based on occasion and style
          </p>
        </Card>
        <Card className="p-6 scale-in hover:shadow-lg transition-shadow delay-200">
          <Trendies className="h-12 w-12 text-pink-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Community Styles</h3>
          <p className="text-gray-600">
            Discover and share outfit inspirations with the community
          </p>
        </Card>
      </section>

      {/* Community Showcase */}
      <section className="mb-20 fade-in">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Community Styles
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform">
              <Image
                src={`https://images.unsplash.com/photo-167${i}956227-c11eb28b0543?auto=format&fit=crop&w=500`}
                alt={`Style ${i}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}