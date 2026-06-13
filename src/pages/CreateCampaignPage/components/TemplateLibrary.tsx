import React from "react";
import {
  BadgePercent,
  CalendarDays,
  Clapperboard,
  ImagePlus,
  LayoutTemplate,
  Megaphone,
  MessageSquareQuote,
  Newspaper,
  PanelTop,
  Rows3,
  Sparkles,
} from "lucide-react";

export type MarketingTemplate = "update" | "newsletter" | "offer" | "event";
export type MarketingBlock =
  | "hero"
  | "featureGrid"
  | "imageText"
  | "testimonial"
  | "cta"
  | "youtube";

type TemplateLibraryProps = {
  onInsertTemplate: (template: MarketingTemplate) => void;
  onInsertBlock: (block: MarketingBlock) => void;
};

const fullTemplates: Array<{
  id: MarketingTemplate;
  title: string;
  description: string;
  icon: React.ElementType;
}> = [
  {
    id: "update",
    title: "Product Update",
    description: "Release notes, improvements, apology, and action.",
    icon: Megaphone,
  },
  {
    id: "newsletter",
    title: "Newsletter",
    description: "Highlights, resources, and weekly campaign content.",
    icon: Newspaper,
  },
  {
    id: "offer",
    title: "Growth Offer",
    description: "Value pitch with proof and a clear conversion path.",
    icon: BadgePercent,
  },
  {
    id: "event",
    title: "Event Invite",
    description: "Announcement, agenda, and attendance prompt.",
    icon: CalendarDays,
  },
];

const contentBlocks: Array<{
  id: MarketingBlock;
  title: string;
  description: string;
  icon: React.ElementType;
}> = [
  {
    id: "hero",
    title: "Opening Banner",
    description: "A strong headline and short lead paragraph.",
    icon: PanelTop,
  },
  {
    id: "featureGrid",
    title: "Benefit Table",
    description: "Two-column feature and value comparison.",
    icon: Rows3,
  },
  {
    id: "imageText",
    title: "Image Story",
    description: "A product image prompt with supporting copy.",
    icon: ImagePlus,
  },
  {
    id: "testimonial",
    title: "Proof Quote",
    description: "Short user quote, result, or credibility signal.",
    icon: MessageSquareQuote,
  },
  {
    id: "cta",
    title: "Action Panel",
    description: "Direct next step with a web or app link.",
    icon: Sparkles,
  },
  {
    id: "youtube",
    title: "Video Preview",
    description: "YouTube thumbnail and watch link for email.",
    icon: Clapperboard,
  },
];

const LibraryButton: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}> = ({ title, description, icon: Icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group w-full text-left rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <span className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-slate-900">{title}</span>
        <span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
    </span>
  </button>
);

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onInsertTemplate,
  onInsertBlock,
}) => {
  return (
    <aside className="border-t border-slate-200 bg-slate-50/90 p-4 xl:border-l xl:border-t-0">
      <div className="xl:sticky xl:top-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <LayoutTemplate size={19} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-950">Template Library</h2>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              Start with a complete email or insert one focused section.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                Complete Emails
              </p>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                Replace
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {fullTemplates.map((template) => (
                <LibraryButton
                  key={template.id}
                  title={template.title}
                  description={template.description}
                  icon={template.icon}
                  onClick={() => onInsertTemplate(template.id)}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                Building Blocks
              </p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                Insert
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {contentBlocks.map((block) => (
                <LibraryButton
                  key={block.id}
                  title={block.title}
                  description={block.description}
                  icon={block.icon}
                  onClick={() => onInsertBlock(block.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
};
