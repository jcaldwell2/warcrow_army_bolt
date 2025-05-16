import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface HighCommandAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HighCommandAlert = ({ open, onOpenChange }: HighCommandAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-h-[90vh] min-h-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle>High Command Limit Reached</AlertDialogTitle>
          <AlertDialogDescription>
            Your army list can only include one High Command unit.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HighCommandAlert;
