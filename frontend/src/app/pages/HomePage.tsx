import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import type { Note } from "@/types/Note";
import useNotesAPI from "@/hooks/useNotesAPI";
import MaswadaLoader from "@/components/ui/MaswadaLoader";
import { useLocaleNavigate } from "@/hooks/useLocaleNavigate";
import { useIntl } from "react-intl";

export function HomePage() {
  const { getAllNotes, createNote } = useNotesAPI();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("")
  const { localeNavigate } = useLocaleNavigate();
  const intl = useIntl()
  useEffect(() => {
    const fetchdata = async () => {
      try {
      const data = await getAllNotes();
      setNotes(data || []); // ✅ الحل هنا
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setNotes([]);
    } finally {
      setLoading(false);
    }
    };
    fetchdata();
  }, [getAllNotes]);

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
  if (!searchQuery.trim()) return notes;

  const query = searchQuery.toLowerCase();

  return notes.filter((note) =>
    (note.title || "").toLowerCase().includes(query)
  );
}, [notes, searchQuery]);

  const handleCreateNote = async () => {
    const note = await createNote({
      title: "Text Note Title... ",
      content: "Text Content...",
    });
    console.log(note);
    if (note) {
      localeNavigate(`/notes/${note.id}`);
    }
  };

  const handleClickNote = (id: string) => {
    localeNavigate(`/notes/${id}`);
  };
  return (
    <div className="space-y-12">
      <GlassCard className="relative px-4 py-6 sm:px-10 gap-4 flex flex-col">
        {/* Loader Overlay */}
        {loading && <MaswadaLoader />}

        {/* المحتوى */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{intl.formatMessage({ id: 'home.myNotes' })}</h1>
          <Button
            type="button"
            className="cursor-pointer"
            onClick={handleCreateNote}
          >
            <Plus />
            {intl.formatMessage({ id: 'home.createNote' })}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder={intl.formatMessage({ id: 'home.searchNotes' })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4">
          {!loading && notes.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px] text-zinc-500">
              No notes yet
            </div>
          ) : (
            filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <GlassCard onClick={() => handleClickNote(note.id)} key={note.id} className="p-4 cursor-pointer">
                <h2 className="text-lg font-bold">{note.title}</h2>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? intl.formatMessage({ id: 'home.noResults' }) : intl.formatMessage({ id: 'home.noNotes' })}
            </div>
          )
          )}
        </div>
      </GlassCard>
    </div>
  );
}
