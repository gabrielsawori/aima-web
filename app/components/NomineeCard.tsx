// app/components/NomineeCard.tsx
"use client"; // <--- PENTING: Ini menandakan komponen ini berjalan di browser (bisa diklik)

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface NomineeProps {
  id: number;
  artist_name: string;
  song_title: string;
  description: string;
  vote_count: number;
}

export default function NomineeCard({ nominee }: { nominee: NomineeProps }) {
  // State untuk menyimpan jumlah vote sementara di layar
  const [votes, setVotes] = useState(nominee.vote_count);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async () => {
    if (isVoting || hasVoted) return; // Mencegah spam klik
    
    setIsVoting(true);

    // 1. Update Tampilan Lebih Dulu (Optimistic UI) supaya terasa cepat
    const newCount = votes + 1;
    setVotes(newCount);
    setHasVoted(true); // Matikan tombol setelah vote

    // 2. Kirim Data ke Supabase (Update Database)
    const { error } = await supabase
      .from('nominees')
      .update({ vote_count: newCount })
      .eq('id', nominee.id);

    // 3. Opsional: Simpan log siapa yang vote (ke tabel 'votes')
    await supabase.from('votes').insert({ nominee_id: nominee.id });

    if (error) {
      console.error("Gagal vote:", error);
      alert("Maaf, vote gagal tersimpan. Cek koneksi internet.");
      setVotes(votes); // Kembalikan angka jika error
      setHasVoted(false);
    }

    setIsVoting(false);
  };

  return (
    <div className={`bg-gray-900 border p-6 rounded-xl flex items-center gap-6 transition-all duration-300 ${hasVoted ? 'border-green-500 bg-green-900/10' : 'border-gray-800 hover:bg-gray-800'}`}>
      
      {/* Avatar Bulat */}
      <div className="w-20 h-20 bg-gradient-to-br from-purple-700 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg shrink-0">
        {nominee.artist_name[0]}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-2xl font-bold text-white truncate">{nominee.artist_name}</h3>
        <p className="text-purple-300 text-lg mb-2 truncate">"{nominee.song_title}"</p>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{nominee.description}</p>
        
        {/* Tombol Vote Interaktif */}
        <button 
          onClick={handleVote}
          disabled={hasVoted || isVoting}
          className={`px-8 py-2 rounded-full font-bold text-sm transition-all transform active:scale-95 ${
            hasVoted 
              ? 'bg-green-600 text-white cursor-default' 
              : 'bg-white text-black hover:bg-purple-500 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]'
          }`}
        >
          {isVoting ? 'Saving...' : hasVoted ? 'VOTED ✓' : `VOTE (${votes})`}
        </button>
      </div>
    </div>
  );
}