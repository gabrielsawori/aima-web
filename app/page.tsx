import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

// Fungsi untuk mengambil data kategori dari Supabase
async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-16 text-center pt-10">
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6 tracking-tight">
          AIMA 2026
        </h1>
        <p className="text-2xl text-gray-400 font-light tracking-wide mb-8">
          The Global AI Music Awards
        </p>
        
        {/* Decorative Line */}
        <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full mb-10"></div>

        {/* --- TOMBOL BARU: SUBMIT SONG --- */}
        <div className="flex justify-center gap-4">
            <Link 
                href="/submit" 
                className="inline-flex items-center px-8 py-4 rounded-full bg-white text-black font-bold text-sm tracking-widest hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                + SUBMIT YOUR ENTRY
            </Link>
        </div>
      </div>

      {/* Grid Kategori */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="flex flex-col justify-between border border-gray-800 bg-gray-900/40 backdrop-blur-sm p-8 rounded-2xl hover:border-purple-500/50 hover:bg-gray-900/80 transition-all duration-300 group shadow-lg hover:shadow-purple-900/20"
          >
            <div>
              {/* Category Group Badge */}
              <span className="inline-block px-3 py-1 mb-5 text-[10px] font-bold tracking-widest text-purple-300 uppercase bg-purple-900/20 border border-purple-500/30 rounded-md">
                {category.group_name}
              </span>
              
              {/* Title */}
              <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">
                {category.title}
              </h2>
              
              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                {category.description}
              </p>
            </div>
            
            {/* Action Button (Link ke Halaman Detail) */}
            <Link 
              href={`/category/${category.id}`}
              className="mt-8 pt-6 border-t border-gray-800 flex items-center text-sm font-semibold text-gray-500 group-hover:text-white transition-colors cursor-pointer"
            >
              View Nominees <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-10 text-center text-gray-600 text-sm">
        <p>&copy; 2026 AIMA. All rights reserved.</p>
        <p className="mt-2 text-xs">Celebrating the intersection of Human Creativity & Artificial Intelligence.</p>
      </footer>
    </main>
  );
}