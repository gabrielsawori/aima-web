import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
// PERBAIKAN DI SINI: Menggunakan "../" untuk naik dua folder mencari components
import NomineeCard from '../../components/NomineeCard'; 

async function getCategory(id: string) {
  const { data } = await supabase.from('categories').select('*').eq('id', id).single();
  return data;
}

async function getNominees(categoryId: string) {
  const { data } = await supabase
    .from('nominees')
    .select('*')
    .eq('category_id', categoryId)
    .order('vote_count', { ascending: false }); 
  return data || [];
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const category = await getCategory(id);
  const nominees = await getNominees(id);

  if (!category) return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Category Not Found (404)</h1>
      <Link href="/" className="text-gray-400 hover:text-white underline">Back to Home</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* Tombol Kembali */}
      <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-flex items-center text-sm font-medium transition-colors">
        <span className="mr-2">←</span> Back to Categories
      </Link>

      {/* Header Kategori */}
      <div className="mb-12 border-b border-gray-800 pb-8">
        <span className="text-purple-400 font-bold tracking-widest uppercase text-xs bg-purple-900/20 px-3 py-1 rounded-md border border-purple-500/30">
          {category.group_name}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          {category.title}
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl font-light leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Grid Nominasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nominees.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
            <p className="text-gray-400 text-lg font-medium mb-2">No nominees yet.</p>
            <p className="text-gray-600 text-sm mb-6">Be the first to submit a song!</p>
            <Link href="/submit" className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200">
              Submit Now
            </Link>
          </div>
        ) : (
          nominees.map((nominee) => (
            <NomineeCard key={nominee.id} nominee={nominee} />
          ))
        )}
      </div>
    </main>
  );
}