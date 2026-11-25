import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, LayoutGrid, Search, Sparkles } from 'lucide-react';
import {
  CANVA_TEMPLATES,
  type CanvaTemplateCategory,
  type CanvaTemplateSpec,
} from '../data/canvaTemplates';
import { FRAME_LAYOUTS } from '../data/frames';
import type { FrameLayoutId } from '../types/booth';

interface FrameStepProps {
  selectedLayout: FrameLayoutId;
  selectedCanvaTemplateId: string | null;
  onSelectLayout: (layout: FrameLayoutId) => void;
  onSelectCanvaTemplate: (template: CanvaTemplateSpec) => void;
  onContinue: () => void;
}

const LAYOUT_ORDER: FrameLayoutId[] = ['strip-4', 'grid-6', 'polaroid-2'];

export const FrameStep: React.FC<FrameStepProps> = ({
  selectedLayout,
  selectedCanvaTemplateId,
  onSelectLayout,
  onSelectCanvaTemplate,
  onContinue,
}) => {
  const [activeModeTab, setActiveModeTab] = useState<'classic' | 'canva'>(
    selectedCanvaTemplateId ? 'canva' : 'classic',
  );
  const [categoryFilter, setCategoryFilter] = useState<'all' | CanvaTemplateCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CANVA_TEMPLATES.filter((t) => {
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (q && !t.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [categoryFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: CANVA_TEMPLATES.length,
      strip: CANVA_TEMPLATES.filter((t) => t.category === 'strip').length,
      story: CANVA_TEMPLATES.filter((t) => t.category === 'story').length,
      post: CANVA_TEMPLATES.filter((t) => t.category === 'post').length,
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full bg-[#FDE8EE] px-3 py-1 text-xs font-bold text-[#D96B84]">
          Step 1 of 5
        </span>
        <h1 className="font-display mt-3 text-2xl font-bold text-[#2C2627] sm:text-3xl">
          Pick your photo strip frame
        </h1>
        <p className="mt-1.5 text-sm text-[#7A6F72]">
          Choose a classic Purikura layout or pick from 24 Canva photo booth templates.
        </p>

        {/* Classic vs Canva Templates Tab Switcher */}
        <div className="mt-5 inline-flex rounded-2xl border border-[#EAE3DC] bg-white p-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveModeTab('classic')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeModeTab === 'classic'
                ? 'bg-[#D96B84] text-white shadow-xs'
                : 'text-[#7A6F72] hover:text-[#2C2627]'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Classic Layouts (3)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModeTab('canva')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeModeTab === 'canva'
                ? 'bg-[#5B9BD5] text-white shadow-xs'
                : 'text-[#7A6F72] hover:text-[#2C2627]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Canva Templates ({CANVA_TEMPLATES.length})</span>
          </button>
        </div>
      </div>

      {activeModeTab === 'classic' ? (
        <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
          {LAYOUT_ORDER.map((id) => {
            const spec = FRAME_LAYOUTS[id];
            const isSelected = !selectedCanvaTemplateId && selectedLayout === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectLayout(id)}
                className={`group relative flex flex-col items-center rounded-3xl border bg-white p-6 text-center transition ${
                  isSelected
                    ? 'border-[#D96B84] shadow-md ring-2 ring-[#D96B84]/25'
                    : 'border-[#EAE3DC] shadow-xs hover:-translate-y-0.5 hover:border-[#D96B84]/50 hover:shadow-sm'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#D96B84] text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}

                {/* Miniature Layout Diagram */}
                <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-[#FAF9F6] p-4">
                  {id === 'strip-4' && (
                    <div className="flex h-40 w-16 flex-col gap-1.5 rounded-xl border border-[#E3D9D0] bg-white p-2 shadow-xs">
                      {[0, 1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className="flex-1 rounded-sm bg-[#FDE8EE] ring-1 ring-[#F9C6D5]/60"
                        />
                      ))}
                      <div className="h-2.5 rounded-sm bg-[#F3ECE6]" />
                    </div>
                  )}

                  {id === 'grid-6' && (
                    <div className="flex h-40 w-28 flex-col gap-1.5 rounded-xl border border-[#E3D9D0] bg-white p-2 shadow-xs">
                      <div className="grid flex-1 grid-cols-2 gap-1.5">
                        {[0, 1, 2, 3, 4, 5].map((n) => (
                          <div
                            key={n}
                            className="rounded-sm bg-[#E8F2FC] ring-1 ring-[#B9D7F5]/70"
                          />
                        ))}
                      </div>
                      <div className="h-2.5 rounded-sm bg-[#F3ECE6]" />
                    </div>
                  )}

                  {id === 'polaroid-2' && (
                    <div className="flex h-40 w-24 flex-col gap-2 rounded-xl border border-[#E3D9D0] bg-white p-2.5 shadow-xs">
                      <div className="flex-1 rounded-sm bg-[#FFF3D6] ring-1 ring-[#FCE59B]/80" />
                      <div className="flex-1 rounded-sm bg-[#FDE8EE] ring-1 ring-[#F9C6D5]/70" />
                      <div className="h-5 rounded-sm bg-[#FAF9F6]" />
                    </div>
                  )}
                </div>

                <span className="mt-4 inline-flex rounded-full bg-[#FAF9F6] px-2.5 py-0.5 text-[11px] font-bold text-[#7A6F72] ring-1 ring-[#EAE3DC]">
                  {spec.badge}
                </span>
                <h2 className="font-display mt-2 text-lg font-bold text-[#2C2627]">
                  {spec.name}
                </h2>
                <p className="mt-1 text-xs text-[#7A6F72]">{spec.subtitle}</p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-7">
          {/* Category Filters & Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EAE3DC] bg-white p-3.5 shadow-2xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: `All (${counts.all})` },
                  { id: 'strip', label: `Photo Strips (${counts.strip})` },
                  { id: 'story', label: `Stories (${counts.story})` },
                  { id: 'post', label: `Posts (${counts.post})` },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    categoryFilter === cat.id
                      ? 'bg-[#5B9BD5] text-white'
                      : 'bg-[#FAF9F6] text-[#7A6F72] hover:text-[#2C2627]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#7A6F72]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter templates (e.g. vintage, strip)..."
                className="w-full rounded-xl border border-[#EAE3DC] bg-[#FAF9F6] py-1.5 pr-3 pl-8 text-xs font-semibold text-[#2C2627] outline-none focus:border-[#5B9BD5] focus:bg-white"
              />
            </div>
          </div>

          {/* 24 Canva Templates Gallery */}
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {filteredTemplates.map((tpl) => {
              const isSelected = selectedCanvaTemplateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => onSelectCanvaTemplate(tpl)}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white p-2.5 text-left transition ${
                    isSelected
                      ? 'border-[#5B9BD5] shadow-md ring-2 ring-[#5B9BD5]/30'
                      : 'border-[#EAE3DC] shadow-2xs hover:-translate-y-0.5 hover:border-[#5B9BD5]/60 hover:shadow-sm'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3.5 right-3.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#5B9BD5] text-white shadow-xs">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}

                  <div className="flex h-52 w-full items-center justify-center overflow-hidden rounded-xl bg-[#FAF9F6] p-2">
                    <img
                      src={tpl.imageUrl}
                      alt={tpl.title}
                      loading="lazy"
                      className="max-h-full max-w-full rounded-lg object-contain shadow-2xs transition group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="mt-2.5 px-1">
                    <span className="inline-block rounded-full bg-[#E8F2FC] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#3C76B0] uppercase">
                      {tpl.category}
                    </span>
                    <p className="mt-1 line-clamp-2 text-xs leading-snug font-bold text-[#2C2627]">
                      {tpl.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#D96B84] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#C95C75] active:scale-[0.99]"
        >
          <span>Continue to Shoot</span>
          <ArrowRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
};
