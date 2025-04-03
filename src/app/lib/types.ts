export interface WardrobeItem {
    id: string;
    user_id: string;
    name: string;
    category: string;
    image_url: string;
    created_at: string;
  }
  
  export interface Outfit {
    id: string;
    user_id: string;
    name: string;
    occasion: string;
    likes: number;
    created_at: string;
    items?: WardrobeItem[];
  }
  
  export interface OutfitItem {
    id: string;
    outfit_id: string;
    wardrobe_item_id: string;
  }