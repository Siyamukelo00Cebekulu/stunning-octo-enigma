import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Download, FileText, Search } from 'lucide-react';
import {
  curriculumTracks,
  paperDefinitions,
  pastPapers,
  type CurriculumId,
  type PaperId
} from '../data/curriculum';

interface PastPapersScreenProps {
  onBack: () => void;
}

type CurriculumFilter = CurriculumId | 'all';
type PaperFilter = PaperId | 'all';

export function PastPapersScreen({ onBack }: PastPapersScreenProps) {
  const [curriculumFilter, setCurriculumFilter] = useState<CurriculumFilter>('all');
  const [paperFilter, setPaperFilter] = useState<PaperFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPapers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return pastPapers.filter((paper) => {
      const matchesCurriculum = curriculumFilter === 'all' || paper.curriculum === curriculumFilter;
      const matchesPaper = paperFilter === 'all' || paper.paper === paperFilter;
      const matchesSearch =
        query === '' ||
        paper.title.toLowerCase().includes(query) ||
        paper.memoTitle.toLowerCase().includes(query) ||
        paper.curriculum.toLowerCase().includes(query) ||
        String(paper.year).includes(query);

      return matchesCurriculum && matchesPaper && matchesSearch;
    });
  }, [curriculumFilter, paperFilter, searchTerm]);

  const papersByYear = filteredPapers.reduce<Record<number, typeof filteredPapers>>((groups, paper) => {
    groups[paper.year] = [...(groups[paper.year] || []), paper];
    return groups;
  }, {});

  const years = Object.keys(papersByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-chart-1/10 text-chart-1">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1>Grade 12 Past Papers</h1>
              <p className="text-muted-foreground">
                Matric mathematics papers and memos for CAPS, IEB, and Cambridge preparation.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-4">
            <label className="relative block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by year, curriculum, paper, or memo"
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1"
              />
            </label>

            <select
              value={curriculumFilter}
              onChange={(event) => setCurriculumFilter(event.target.value as CurriculumFilter)}
              className="px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1"
              aria-label="Filter by curriculum"
            >
              <option value="all">All curricula</option>
              {curriculumTracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
                </option>
              ))}
            </select>

            <div className="flex rounded-lg bg-secondary p-1">
              {(['all', 'paper1', 'paper2'] as PaperFilter[]).map((paper) => (
                <button
                  key={paper}
                  onClick={() => setPaperFilter(paper)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    paperFilter === paper
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {paper === 'all' ? 'All' : paperDefinitions[paper].shortLabel}
                </button>
              ))}
            </div>
          </div>
        </div>

        {years.length === 0 ? (
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="mb-2">No papers found</h3>
            <p className="text-sm text-muted-foreground">
              Try a different curriculum, paper, year, or search term.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {years.map((year, yearIndex) => (
              <section key={year}>
                <div className="flex items-center justify-between mb-4">
                  <h2>{year}</h2>
                  <span className="text-sm text-muted-foreground">
                    {papersByYear[year].length} resources
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {papersByYear[year].map((paper, index) => (
                    <motion.article
                      key={paper.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (yearIndex * 0.08) + (index * 0.04) }}
                      className="bg-card rounded-xl p-5 border border-border shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full bg-chart-1/10 text-chart-1 text-xs">
                              {paper.curriculum}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-secondary text-xs">
                              {paperDefinitions[paper.paper].label}
                            </span>
                          </div>
                          <h3 className="text-base mb-2">{paper.title}</h3>
                          <p className="text-sm text-muted-foreground">{paper.memoTitle}</p>
                        </div>
                        <FileText className="w-6 h-6 text-chart-2 flex-shrink-0" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                        <a
                          href={paper.paperLink}
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                          <Download className="w-4 h-4" />
                          Paper
                        </a>
                        <a
                          href={paper.memoLink}
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Memo
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
