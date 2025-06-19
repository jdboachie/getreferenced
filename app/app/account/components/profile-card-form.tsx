import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";
import { PenSquare, XIcon } from "lucide-react";
import { ReactNode, useState, useEffect, useRef } from "react";
import { profileCardStyles } from './styles'
import { SpinnerIcon } from "@/components/icons";

// Type for the children prop when it's a function
type ChildrenRenderProp = (isEditing: boolean) => ReactNode;

type ProfileCardFormProps = {
  title: string;
  description?: string;
  onSubmit?: (formData: FormData) => Promise<void>;
  children: ReactNode | ChildrenRenderProp;
  footerNote: string;
  buttonDisabled?: boolean;
  buttonText?: string;
  defaultEditable?: boolean;
  showEditButton?: boolean;
  onEditToggle?: (isEditing: boolean) => void;
};

export default function ProfileCardForm({
  title,
  description,
  onSubmit,
  children,
  footerNote,
  buttonDisabled = false,
  buttonText = "Save",
  defaultEditable = false, // Default to non-editable
  showEditButton = true, // Default to showing the edit button
  onEditToggle,
}: ProfileCardFormProps) {

  const [pending, setPending] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(defaultEditable);
  const formRef = useRef<HTMLFormElement>(null);

  // If defaultEditable changes from parent, update internal state
  useEffect(() => {
    setIsEditing(defaultEditable);
  }, [defaultEditable]);

  const handleEditToggle = () => {
    const newEditingState = !isEditing;
    setIsEditing(newEditingState);
    if (onEditToggle) {
      onEditToggle(newEditingState);
    }
  };

  const handleSubmit = async () => {
    setPending(true)
    if (!formRef.current) return; // Ensure formRef is defined
    const form = formRef.current;

    if (!form) return;
    const formData = new FormData(form);

    if (onSubmit)
    await onSubmit(formData);

    // After successful submission, you might want to switch back to view mode
    // if defaultEditable is false, or keep it editable if it's meant to be
    if (!defaultEditable) {
      setIsEditing(false);
    }
    if (onEditToggle && !defaultEditable) {
      onEditToggle(false);
    }
    setPending(false)
  };

  return (
    <form
      id={title.toLocaleLowerCase()}
      ref={formRef}
      onSubmit={handleSubmit}
      className={profileCardStyles.card}
    >
      <div
        className={profileCardStyles.cardContent}
      >
        <div className="relative flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="font-medium text-lg">{title}</h3>
            {description && <p className="text-sm">{description}</p>}
          </div>
          {showEditButton && !isEditing && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleEditToggle}
                  aria-label="Edit"
                  className="absolute -right-1.5 -top-1.5"
                >
                  <span className="sr-only">Edit</span>
                  <PenSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit {title.toLocaleLowerCase()}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {showEditButton && isEditing && (
            <Button
              type="reset"
              variant="secondary"
              onClick={handleEditToggle}
              aria-label="Cancel editing"
              className="absolute -right-1.5 -top-1.5"
            >
              Cancel<XIcon className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
        {/* Pass isEditing down to children if they need to render conditionally */}
        {typeof children === 'function' ? children(isEditing) : children}
      </div>
      <div className={profileCardStyles.cardFooter}>
        <p className="text-sm text-muted-foreground">{footerNote}</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" type="button" disabled={(buttonDisabled || !isEditing)}>
              {pending && <SpinnerIcon />}
              {buttonText}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Confirm that you want to edit your {title.toLocaleLowerCase()}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button size="sm" type="submit" onClick={handleSubmit}>
                  {buttonText}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
}