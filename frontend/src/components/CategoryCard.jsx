import React from 'react';
import {
  Shirt,
  Laptop,
  BookOpen,
  Printer,
  ShoppingCart,
  Pencil,
  Home,
  Coffee,
  Droplets,
  Wind,
  Trophy,
} from 'lucide-react';

export const CATEGORIES = [
  {
    name: 'Clothing',
    icon: Shirt,
    description: 'Blazers, hoodies, ethnic formals & winter wear',
    badge: 'Popular',
  },
  {
    name: 'Electronics',
    icon: Laptop,
    description: 'Calculators, kettles, extension cords & cameras',
    badge: 'High Demand',
  },
  {
    name: 'Notes',
    icon: BookOpen,
    description: 'Handwritten notebooks, question banks & cheat-sheets',
    badge: 'Essential',
  },
  {
    name: 'Printouts',
    icon: Printer,
    description: 'Lab manuals, syllabus packets & blueprints',
  },
  {
    name: 'Groceries',
    icon: ShoppingCart,
    description: 'Instant noodles, snacks & hostel pantry items',
  },
  {
    name: 'Stationery',
    icon: Pencil,
    description: 'Pens, drafters, geometry kits & art supplies',
  },
  {
    name: 'Hostel Decor',
    icon: Home,
    description: 'Fairy lights, posters, shoe racks & storage organizers',
  },
  {
    name: 'Utensils',
    icon: Coffee,
    description: 'Mugs, plates, bowls, electric kettles & cutlery',
  },
  {
    name: 'Skincare',
    icon: Droplets,
    description: 'Moisturizers, sunscreen, cleansers & body care',
  },
  {
    name: 'Haircare',
    icon: Wind,
    description: 'Hair dryers, oils, shampoo & styling tools',
  },
  {
    name: 'Sports Items',
    icon: Trophy,
    description: 'Badminton rackets, footballs, gym gear & yoga mats',
    badge: 'Active',
  },
];

const CategoryCard = ({ category, isSelected, onClick, count }) => {
  const IconComponent = category.icon || Shirt;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between w-full h-full ${
        isSelected
          ? 'bg-[#1c1c1d] text-[#FFFDF8] border-[#1c1c1d] shadow-sharp -translate-y-0.5'
          : 'bg-white hover:bg-[#FFF9EE] text-[#1c1c1d] border-[#1c1c1d]/30 hover:border-[#1c1c1d] shadow-sm hover:shadow-sharp hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start justify-between w-full mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${
            isSelected
              ? 'bg-white/10 text-[#FFFDF8] border-white/20'
              : 'bg-[#FFF9EE] text-[#1c1c1d] border-[#1c1c1d]/20 group-hover:bg-[#1c1c1d] group-hover:text-white'
          }`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        {category.badge && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isSelected
                ? 'bg-white/20 text-[#FFFDF8] border-white/30'
                : 'bg-[#FDF3E0] text-[#1c1c1d] border-[#1c1c1d]/20'
            }`}
          >
            {category.badge}
          </span>
        )}
      </div>

      <div>
        <h3
          className={`text-sm font-bold tracking-tight mb-1 ${
            isSelected ? 'text-[#FFFDF8]' : 'text-[#1c1c1d]'
          }`}
        >
          {category.name}
        </h3>
        <p
          className={`text-[11px] leading-snug line-clamp-2 ${
            isSelected ? 'text-stone-300' : 'text-[#464649]'
          }`}
        >
          {category.description}
        </p>
      </div>

      {count !== undefined && (
        <div className="mt-3 pt-2 border-t border-stone-200/50 text-[10px] font-semibold flex items-center justify-between">
          <span className={isSelected ? 'text-stone-300' : 'text-[#464649]'}>
            {count} {count === 1 ? 'item' : 'items'}
          </span>
          <span className={isSelected ? 'text-[#FFFDF8]' : 'text-[#1c1c1d] font-bold'}>
            Explore →
          </span>
        </div>
      )}
    </button>
  );
};

export default CategoryCard;
