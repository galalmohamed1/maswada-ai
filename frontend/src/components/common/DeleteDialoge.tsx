import { Trash, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useIntl } from "react-intl"

type DeleteDialogProps = {
    title:string,
    description:string,
    handleDelete:()=>void,
    buttontext?:string
}
export function DeleteDialoge({title,description,handleDelete,buttontext}:DeleteDialogProps) {
   const intl = useIntl()
  const defaultButtonText = intl.formatMessage({ id: 'noteDetail.delete' })
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer bg-gray-200 text-red-400 border-2 border-red hover:bg-gray-200 hover:border-red-400">
              <Trash />
              {buttontext || defaultButtonText}
            </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">{intl.formatMessage({ id: 'dialog.cancel' })}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} className="cursor-pointer">{intl.formatMessage({ id: 'dialog.confirmDelete' })}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
