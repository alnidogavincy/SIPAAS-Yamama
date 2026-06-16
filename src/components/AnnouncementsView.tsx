import { useState } from 'react';
import { Search, Calendar, User, Eye, ArrowRight, X, Clock, HelpCircle, Tag, Check } from 'lucide-react';
import { mockAnnouncements } from '../data';
import { Announcement } from '../types';

export default function AnnouncementsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedArticle, setSelectedArticle] = useState<Announcement | null>(null);

  const categories = ['Semua', 'Wali Santri', 'Akademik', 'Umum'];

  // Map user readable category into backend type
  const mapCategory = (cat: string): string => {
    switch (cat.toLowerCase()) {
      case 'wali santri': return 'wali';
      case 'akademik': return 'akademik';
      case 'umum': return 'umum';
      default: return 'all';
    }
  };

  const filteredAnnouncements = mockAnnouncements.filter((ann) => {
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ann.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'Semua') return matchesSearch;
    return matchesSearch && ann.category === mapCategory(activeCategory);
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans px-4 sm:px-6 lg:px-8" id="announcements-section">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block with Search */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-slate-200 pb-6 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
              <span className="bg-emerald-800 text-white p-2 rounded-xl text-xs font-serif uppercase tracking-widest leading-none">News</span>
              <span>Pengumuman Pesantren</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Informasi terkini mengenai agenda, kebijakan, surat edaran wali santri, dan laporan kelulusan santri Pondok Pesantren Yamama.
            </p>
          </div>

          {/* Search bar input with custom layout */}
          <div className="relative w-full md:w-80 shrink-0">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              id="announcement-search"
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Categories Navbar and Quick Stat line */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="announcements-filters-bar">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/10'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 w-fit">
            <span>Ditemukan:</span>
            <span className="font-bold text-slate-700">{filteredAnnouncements.length} Pengumuman</span>
          </div>
        </div>

        {/* Bento/Grid Layout of Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="announcements-grid">
          {filteredAnnouncements.map((ann, index) => {
            // First item can be styled as a featured card in wide screens
            const isFeatured = index === 0 && searchQuery === '' && activeCategory === 'Semua';
            return (
              <div
                key={ann.id}
                id={`ann-card-${ann.id}`}
                className={`bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2 md:flex-row' : ''
                }`}
                onClick={() => setSelectedArticle(ann)}
              >
                {/* Post Image Banner */}
                <div className={`relative overflow-hidden bg-slate-100 shrink-0 ${isFeatured ? 'md:w-1/2 h-full min-h-[250px]' : 'h-48'}`}>
                  <img
                    src={ann.imageUrl}
                    alt={ann.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category Tag overlay on image */}
                  <span className="absolute top-4 left-4 inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm bg-white text-emerald-900">
                    {ann.category === 'wali' ? 'Wali Santri' : ann.category === 'akademik' ? 'Akademik' : 'Umum'}
                  </span>
                </div>

                {/* Article Copy Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Info */}
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mb-3 font-medium">
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{ann.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{ann.readTime}</span>
                      </span>
                    </div>

                    <h3 className={`font-bold text-slate-800 leading-snug group-hover:text-emerald-800 transition ${isFeatured ? 'text-xl' : 'text-base'}`}>
                      {ann.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 mt-2.5 line-clamp-3 leading-relaxed">
                      {ann.summary}
                    </p>
                  </div>

                  {/* Footer Author & Trigger */}
                  <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 flex items-center space-x-1 truncate max-w-[150px]">
                      <User size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{ann.author.split(',')[0]}</span>
                    </span>
                    <span className="text-emerald-700 hover:text-emerald-950 flex items-center space-x-1 shrink-0 font-bold">
                      <span>Baca Detail</span>
                      <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAnnouncements.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
              <HelpCircle size={40} className="text-slate-300 mb-2" />
              <h3 className="text-sm font-semibold text-slate-700">Tidak ada pengumuman ditemukan</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">Gunakan istilah pencarian lain atau pilih kategori saringan yang berbeda.</p>
            </div>
          )}
        </div>

        {/* Modal: Article Detail Lightbox */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200" id="announcement-modal">
            <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">
              
              {/* Close Button overlay */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 bg-slate-900/60 hover:bg-slate-950/80 p-2 rounded-full text-white hover:text-amber-300 transition z-10"
                id="close-announcement-modal"
              >
                <X size={16} />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto pr-0.5">
                <div className="h-56 sm:h-64 relative bg-slate-100">
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                  <span className="absolute bottom-4 left-6 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg bg-amber-500 text-emerald-950">
                    {selectedArticle.category === 'wali' ? 'Wali Santri' : selectedArticle.category === 'akademik' ? 'Akademik' : 'Umum'}
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Metadata line */}
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-4 font-medium border-b border-slate-100 pb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{selectedArticle.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock size={12} className="text-slate-400" />
                      <span>{selectedArticle.readTime}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User size={12} className="text-slate-400" />
                      <span>Oleh: {selectedArticle.author}</span>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">{selectedArticle.title}</h2>
                  
                  <div className="text-slate-600 mt-5 leading-relaxed text-sm space-y-4">
                    <p className="font-medium text-slate-700 bg-slate-50 border-l-4 border-emerald-700 p-3 rounded-r">
                      {selectedArticle.summary}
                    </p>
                    <p className="whitespace-pre-line pt-2">
                      {selectedArticle.content}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal footer back confirmation */}
              <div className="border-t border-slate-100 p-4 px-6 flex justify-end bg-slate-50 shrink-0">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 border border-emerald-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Selesai Membaca
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
