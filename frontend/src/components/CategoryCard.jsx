import React from 'react';
import {
  Laptop,
  BookOpen,
  Armchair,
  Shirt,
  Trophy,
  Bike,
  Coffee,
  Package,
} from 'lucide-react';

export const CATEGORIES = [
  {
    name: 'Electronics',
    icon: Laptop,
    description: 'Laptops, calculators, tablets & cables',
    badge: 'Popular',
  },
  {
    name: 'Books & Study Material',
    icon: BookOpen,
    description: 'Coursebooks, syllabus guides & notes',
    badge: 'Essential',
  },
  {
    name: 'Cycles',
    icon: Bike,
    description: 'Campus commute bicycles & gear',
    badge: 'High Demand',
  },
  {
    name: 'Hostel Essentials',
    icon: Coffee,
    description: 'Kettles, fans, buckets & storage',
    badge: 'Hostelites',
  },
  {
    name: 'Furniture',
    icon: Armchair,
    description: 'Study chairs, tables & racks',
  },
  {
    name: 'Sports Equipment',
    icon: Trophy,
    description: 'Rackets, balls, gym items',
  },
  {
    name: 'Fashion',
    icon: Shirt,
    description: 'Hoodies, formal blazers & lab coats',
  },
  {
    name: 'Other Items',
    icon: Package,
    description: 'Guitars, art supplies & accessories',
  },
];

const CategoryCard = ({ category, isSelected, onClick, count }) => {
  const IconComponent = category.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between w-full h-full ${
        isSelected
          ? 'bg-gradient-to-br from-[#4F46E5] to-[#4338CA] text-white border-[#4F46E5] shadow-md -translate-y-1'
          : 'bg-white hover:bg-indigo-50/40 text-[#111827] border-[#E5E7EB] hover:border-[#818CF8] shadow-card hover:shadow-card-hover hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start justify-between w-full mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-white/20 text-white'
              : 'bg-indigo-50 text-[#4F46E5] group-hover:bg-[#4F46E5] group-hover:text-white'
          }`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        {category.badge && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isSelected
                ? 'bg-white/20 text-white'
                : 'bg-indigo-50 text-[#4F46E5]'
            }`}
          >
            {category.badge}
          </span>
        )}
      </div>

      <div>
        <h3
          className={`text-sm font-bold tracking-tight mb-1 ${
            isSelected ? 'text-white' : 'text-[#111827]'
          }`}
        >
          {category.name}
        </h3>
        <p
          className={`text-[11px] leading-snug line-clamp-2 ${
            isSelected ? 'text-indigo-100' : 'text-[#6B7280]'
          }`}
        >
          {category.description}
        </p>
      </div>

      {count !== undefined && (
        <div className="mt-3 pt-2 border-t border-white/20 text-[10px] font-semibold flex items-center justify-between">
          <span className={isSelected ? 'text-indigo-200' : 'text-[#6B7280]'}>
            {count} {count === 1 ? 'item' : 'items'}
          </span>
          <span className={isSelected ? 'text-white' : 'text-[#4F46E5]'}>
            Explore →
          </span>
        </div>
      )}
    </button>
  );
};

export default CategoryCard;

