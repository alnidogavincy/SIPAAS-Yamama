import { useState } from 'react';
import { Image, X, ZoomIn, Calendar, Filter, Eye } from 'lucide-react';
import { mockGalleryImages } from '../data';

export default function GalleryView() {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [lightboxImage, setLightboxImage] = useState<typeof mockGalleryImages[0] | null>(null);

  const categories = ['Semua', 'Kegiatan Santri', 'Fasilitas', 'Acara Besar'];

  const filteredImages = mockGalleryImages.filter(img => {
    if (activeCategory === 'Semua') return true;
    return img.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans px-4 sm:px-6 lg:px-8" id="gallery-section">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
              <span className="bg-amber-500 rounded-xl p-2 text-emerald-950 inline-flex items-center shadow-inner">
                <Image size={24} />
              </span>
              <span>Galeri Kegiatan & Fasilitas</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Dokumentasi aktivitas akademis, kajian kitab, fasilitas pondok, dan momen istimewa di Pondok Pesantren Yamama.
            </p>
          </div>

          {/* Filters List */}
          <div className="flex flex-wrap gap-2" id="gallery-filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-250 border ${
                  activeCategory === cat
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-masonry-container">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => setLightboxImage(img)}
              id={`gallery-card-${img.id}`}
            >
              {/* Photo Box with Hover zoom effects */}
              <div className="relative overflow-hidden h-64 bg-slate-100">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/95 p-3 rounded-full text-emerald-950 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ZoomIn size={20} />
                  </div>
                </div>

                {/* Category tag bubble overlay */}
                <span className="absolute top-4 left-4 bg-emerald-900/90 text-[9px] font-bold text-amber-300 shadow-sm px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {img.category}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm group-hover:text-emerald-800 transition line-clamp-1">
                    {img.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-50 pt-2.5 mt-2.5">
                  <span className="flex items-center space-x-1">
                    <Calendar size={10} />
                    <span>Dokumentasi: {img.date}</span>
                  </span>
                  <span className="flex items-center text-emerald-800 font-semibold space-x-0.5">
                    <Eye size={11} />
                    <span>Lihat</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Fullscreen Lightbox Image Viewer */}
        {lightboxImage && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" id="gallery-lightbox">
            
            {/* Close Button overlay */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white transition z-10"
              id="close-lightbox"
            >
              <X size={20} />
            </button>

            <div className="max-w-4xl w-full flex flex-col text-white rounded-2xl overflow-hidden max-h-[90vh] shadow-2xl relative animate-in zoom-in-95 duration-250">
              {/* High res Main photo */}
              <div className="bg-slate-950/60 flex items-center justify-center overflow-hidden h-[60vh]">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Detail Pane */}
              <div className="bg-slate-900/95 p-6 border-t border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-amber-500 text-emerald-950">
                    {lightboxImage.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    DIAMBIL PADA: {lightboxImage.date}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-amber-300 leading-snug">{lightboxImage.title}</h2>
                <p className="text-xs text-slate-350 mt-1 leading-relaxed max-w-2xl">
                  Foto dokumentasi resmi berlisensi Pondok Pesantren Yamama. Hubungi staff humas atau sekretariat pondok untuk perizinan publikasi sekunder atau cetak.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
