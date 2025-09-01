import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActivityIcon } from "lucide-react";

const SkillsModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={
            "w-[80px] h-[52px] flex flex-col items-center justify-center border-b text-muted-foreground cursor-pointer -ml-2"
          }
        >
          <ActivityIcon className="size-5" />
          <span className={"text-[12px] leading-none mt-1 "}>Skills</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsModal;
