import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const ContactInfoModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <p className="text-sm underline cursor-pointer text-blue-300">
          Contact Info
        </p>
      </DialogTrigger>
      <DialogContent className="bg-neutral-200 dark:bg-dark">
        <DialogHeader>
          <DialogTitle>John Carlo Misa</DialogTitle>
          <DialogDescription className="hidden">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div></div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactInfoModal;
