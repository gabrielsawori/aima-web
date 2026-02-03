// app/submit/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk form
  const [formData, setFormData] = useState({
    artist_name: '',
    song_title: '',
    category_id: '',
    description: '',
    demo_url: '', // Link lagu (SoundCloud/Spotify)
  });

  // 1. Ambil daftar kategori saat halaman dibuka
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('group_name');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  // 2. Handle saat tombol Submit diklik
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.category_id) {
      alert("Please select a category!");
      setLoading(false);
      return;
    }

    // Kirim ke Supabase
    const { error } = await supabase
      .from('nominees')
      .insert([{
        artist_name: formData.artist_name,
        song_title: formData.song_title,
        category_id: parseInt(formData.category_id),
        description: formData.description,
        demo_url: formData.demo_url,
        vote_count: 0 // Mulai dari 0
      }]);

    if (error) {
      console.error(error);
      alert("Error submitting. Please try again.");
    } else {
      alert("Submission Successful! 🎵");
      router.push(`/category/${formData.category_id}`); // Pindah ke halaman kategori tsb
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white p-8 flex justify-center items-center">
      <div className="max-w-xl w-full bg-gray-900/50 border border-gray-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        
        {/* Header Form */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Submit Your Entry
          </h1>
          <p className="text-gray-400 text-sm mt-2">Join the AIMA 2026 Nominees</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input Artist */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Artist Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="e.g. Rennick Stone"
              value={formData.artist_name}
              onChange={(e) => setFormData({...formData, artist_name: e.target.value})}
            />
          </div>

          {/* Input Song */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Song Title</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
              placeholder="e.g. Dusty Roads"
              value={formData.song_title}
              onChange={(e) => setFormData({...formData, song_title: e.target.value})}
            />
          </div>

          {/* Dropdown Kategori */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
            <select 
              required
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none appearance-none"
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
            >
              <option value="">-- Select a Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.group_name} - {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Input Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description / AI Tools Used</label>
            <textarea 
              rows={3}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
              placeholder="e.g. Created using Suno v3, lyrics by ChatGPT..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Link href="/" className="flex-1 py-3 text-center border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 font-semibold">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Entry 🚀'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}