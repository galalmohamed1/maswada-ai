import type { AutoSaveStatus } from "@/types/Note";
import { CircleAlert, CloudBackup, CloudCheck } from "lucide-react";
import { useIntl } from "react-intl";

type props = {
    autoSaveStatus:AutoSaveStatus
}

function AutoSaveIndicator({ autoSaveStatus }: props){
    const intl = useIntl()
    switch (autoSaveStatus){
        case "saving":
            return(
                <div className="flex items-center gap-1">
                    <CloudBackup className="size-4 text-zinc-500 animate-spin"/>
                    <span className="text-sm text-zinc-500"> {intl.formatMessage({ id: 'autoSave.saving' })}</span>
                </div>
            ) 
                
        case "saved":
            return(
                <div className="flex items-center gap-1">
                    <CloudCheck className="size-4 text-green-500"/>
                    <span className="text-sm text-green-500">{intl.formatMessage({ id: 'autoSave.savedSuccessfully' })}</span>
                </div>
            )
        case "unsaved":
            return(
                <div className="flex items-center gap-1">
                    <CircleAlert className="size-4 text-red-500"/>
                    <span className="text-sm text-red-500"> {intl.formatMessage({ id: 'autoSave.unsavedChanges' })}</span>
                </div>
            )
        case "initial":
            return null
        default:
            return null
    }    

}
export default AutoSaveIndicator;