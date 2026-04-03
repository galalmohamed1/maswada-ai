import type { AutoSaveStatus, Note } from "@/types/Note"
import { useState ,useEffect} from "react";

type props = {
    note:Note | null,
    userEditing : boolean,
    handelUpdate :()=>void,
}

function useAutoSave ({note , userEditing, handelUpdate}:props){
    const [autoSaveStatus, setAutoSaveStatus] =useState<AutoSaveStatus>("initial");

    // Trigger auto-save with debounce effect when user stops typing for 2 seconds
  useEffect(() => {
    if (!note || !userEditing) return;
    const timer = setTimeout(() => {
      setAutoSaveStatus("saving");
      handelUpdate();
      setAutoSaveStatus("saved");
    }, 2000);
    
    return () => clearTimeout(timer);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[note?.title, note?.content, userEditing , handelUpdate]);

  return {autoSaveStatus,setAutoSaveStatus }
}
export default useAutoSave;