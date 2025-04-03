"use client";

import Link from "next/link";
import { Button } from "./components/ui/button";
import { Scissors } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav 
      className="border-b bg-white/80 backdrop-blur-sm fixed w-full z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Scissors className="h-6 w-6 text-pink-500" />
          <span className="font-bold text-xl">StyleScan</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/wardrobe">
            <Button variant="ghost">My Wardrobe</Button>
          </Link>
          <Link href="/recommendations">
            <Button variant="ghost">Get Recommendations</Button>
          </Link>
          <Link href="/community">
            <Button variant="ghost">Community</Button>
          </Link>
          <Link href="/account">
            <Button className="bg-pink-500 hover:bg-pink-600">Sign In</Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}