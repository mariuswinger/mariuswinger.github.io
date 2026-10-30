import { useState } from 'react';

export type Project = {
  title: string;
  category: string;
  description?: string;
  image: string;
  href?: string;
};

type Props = {
  projects: Project[];
};

export default function ProjectFilter({ projects }: Props) {
  const categories = ['All', ...new Set(projects.map((p) => p.category))];
  const [active, setActive] = useState('All');
  const visible = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <ul className="mb-8 flex flex-wrap gap-2" aria-label="Filter projects by category">
        {categories.map((c) => (
          <li key={c}>
            <button
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={c === active}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                c === active ? 'bg-accent text-bg font-medium' : 'text-muted hover:text-text'
              }`}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>

      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((p) => (
          <li key={p.title}>
            <a
              href={p.href ?? '#'}
              target={p.href?.startsWith('http') ? '_blank' : undefined}
              rel={p.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group block"
            >
              <div className="overflow-hidden rounded-2xl border border-border">
                <img
                  src={p.image}
                  alt=""
                  width={400}
                  height={260}
                  loading="lazy"
                  className="aspect-[400/260] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-3 font-medium group-hover:text-accent">{p.title}</h3>
              <p className="text-sm text-muted">{p.category}</p>
              {p.description && (
                <p className="mt-2 text-sm text-muted leading-relaxed">{p.description}</p>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
