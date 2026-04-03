/* eslint-disable @typescript-eslint/no-unused-vars */
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useNotesAPI from "@/hooks/useNotesAPI";
import type { Note, RewriteMode } from "@/types/Note";
import {
  ArrowLeft,
  ArrowRight,
  Languages,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeleteDialoge } from "./../../components/common/DeleteDialoge";
import AutoSaveIndicator from "@/components/note/AutoSaveIndicator";
import useAutoSave from "@/hooks/useAutoSave";
import useAIFeaturesAPI from "@/hooks/useAIFeaturesAPI";
import { detectTextDirection } from "@/lib/utils";
import { useLocaleNavigate } from "@/hooks/useLocaleNavigate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MaswadaLoader from "@/components/ui/MaswadaLoader";
import { useIntl } from "react-intl";
import { useLanguage } from "@/hooks/useLanguage";

export default function NoteDetailsPage() {
  const { getNoteById, updateNote, deleteNote } = useNotesAPI();
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEditing, setuserEditing] = useState(false);
  const { navigate,localeNavigate } = useLocaleNavigate();
  const { translate, summarize, rewrite } = useAIFeaturesAPI();
  const intl = useIntl();
  const { isRTL } = useLanguage();

  const textDirection = useMemo(
    () => detectTextDirection(note?.content || ""),
    [note?.content],
  );

  const handelUpdate = async () => {
    if (!note) return;

      const updatedata = await updateNote(note.id, {
        title: note.title,
        content: note.content,
      });
      if (updatedata) {
        setNote(updatedata);
        toast.success("Saved successfully ✅", {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
        setuserEditing(false);
      } else {
        toast.error("Update failed ❌");
      }
    
  };
  const { autoSaveStatus, setAutoSaveStatus } = useAutoSave({
    note,
    userEditing,
    handelUpdate,
  });

  const handelClickback = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const data = await getNoteById(id);
      if (data) {
        setNote(data);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getNoteById, id]);

  const handelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote((prev) => (prev ? { ...prev, title: e.target.value } : null));
    setuserEditing(true);
    setAutoSaveStatus("unsaved");
  };

  const handelArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote((prev) => (prev ? { ...prev, content: e.target.value } : null));
    setuserEditing(true);
    setAutoSaveStatus("unsaved");
  };

  const handelDelete = async () => {
    if (!note) return;
    
      const deleted = await deleteNote(note.id);
      if (deleted) {
        localeNavigate("/");
        toast.success(intl.formatMessage({ id: "toast.noteDeleted" }), {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
      } else {
        toast.error("Deleted failed ❌");
      }
    
  };

  const handletranslate = async () => {
    if (!note) return;

    const result = await translate({ noteId: note.id });
    if (result) {
      setNote((prev) => (prev ? { ...prev, content: result } : null));
      setuserEditing(true);
      setAutoSaveStatus("unsaved");
      toast.success(intl.formatMessage({ id: "toast.noteTranslated" }), {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
    }
    toast.error(intl.formatMessage({ id: "toast.translateFailed" }));
  };
  const handleSummarize = async () => {
    if (!note) return;

    const result = await summarize({ noteId: note.id });
    if (result) {
      setNote((prev) => (prev ? { ...prev, content: result } : null));
      setuserEditing(true);
      setAutoSaveStatus("unsaved");
      toast.success(intl.formatMessage({ id: "toast.noteSummarized" }), {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
    }
    toast.error(intl.formatMessage({ id: "toast.summarizeFailed" }));
  };

  const handleRewrite = async (mode: RewriteMode) => {
    if (!note) return;

    const result = await rewrite({ noteId: note.id, mode });
    if (result) {
      setNote((prev) => (prev ? { ...prev, content: result } : null));
      setuserEditing(true);
      setAutoSaveStatus("unsaved");
      toast.success(intl.formatMessage({ id: "toast.noteRewritten" }), {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
    }
    toast.error(intl.formatMessage({ id: "toast.rewriteFailed" }));
  };

  if (!note && isLoading) {
    return <MaswadaLoader />;
  }

  return (
    <>
      <GlassCard className="p-4 sm:px-10 gap-4 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handelClickback}
              className="cursor-pointer"
            >
              {isRTL ? <ArrowRight /> : <ArrowLeft />}
              {intl.formatMessage({ id: "noteDetail.back" })}
            </Button>
            <AutoSaveIndicator autoSaveStatus={autoSaveStatus} />
          </div>
          <div className="flex gap-2">
            <DeleteDialoge
              title={intl.formatMessage({ id: "noteDetail.deleteTitle" })}
              description={intl.formatMessage({
                id: "noteDetail.deleteDescription",
              })}
              handleDelete={handelDelete}
            ></DeleteDialoge>
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <Button
            onClick={handleSummarize}
            variant="outline"
            className="cursor-pointer"
          >
            <Sparkles />
            {intl.formatMessage({ id: 'noteDetail.summarize' })}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                <RefreshCcw />
                {intl.formatMessage({ id: 'noteDetail.changeTone' })}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleRewrite("Comdy")}
                  className="cursor-pointer"
                >
                  {intl.formatMessage({ id: 'noteDetail.comedy' })}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRewrite("Formal")}
                  className="cursor-pointer"
                >
                  {intl.formatMessage({ id: 'noteDetail.formal' })}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRewrite("Casual")}
                  className="cursor-pointer"
                >
                  {intl.formatMessage({ id: 'noteDetail.casual' })}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handletranslate}
            variant="outline"
            className="cursor-pointer"
          >
            <Languages />
            {intl.formatMessage({ id: 'noteDetail.translate' })}
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            dir={textDirection}
            onChange={handelInput}
            placeholder={intl.formatMessage({ id: 'noteDetail.titlePlaceholder' })}
            className="bg-transparent dark:bg-transparent border-none focus-visible:ring-0"
            value={note?.title || ""}
          />
          <Textarea
            dir={textDirection}
            rows={20}
            onChange={handelArea}
            className="bg-transparent dark:bg-transparent border-none focus-visible:ring-0 min-h-[400px]"
            placeholder={intl.formatMessage({ id: 'noteDetail.contentPlaceholder' })}
            value={note?.content || ""}
          />
        </div>
      </GlassCard>
    </>
  );
}
