import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Loader2Icon,
  MapPinIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  LinkIcon,
  LinkedinIcon,
  GithubIcon,
  FacebookIcon,
  InstagramIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ContactInfoEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // address
  currentCity: string;
  currentProvince: string;
  currentCountry: string;

  // contact
  currentEmail: string;
  currentContactNumber: string;
  currentLinkedinLink: string;
  currentPortfolioLink: string;
  currentGithubLink: string;
  currentFacebookLink: string;
  currentInstagramLink: string;
  currentXLink: string;

  onSave: (data: any) => Promise<void>;
}

const ContactInfoEditorDialog = ({
  open,
  onOpenChange,
  currentCity,
  currentProvince,
  currentCountry,
  currentEmail,
  currentContactNumber,
  currentLinkedinLink,
  currentPortfolioLink,
  currentGithubLink,
  currentFacebookLink,
  currentInstagramLink,
  currentXLink,
  onSave,
}: ContactInfoEditorDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    city: currentCity,
    province: currentProvince,
    country: currentCountry,
    email: currentEmail,
    contactNumber: currentContactNumber,
    linkedinLink: currentLinkedinLink,
    portfolioLink: currentPortfolioLink,
    githubLink: currentGithubLink,
    facebookLink: currentFacebookLink,
    instagramLink: currentInstagramLink,
    xLink: currentXLink,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        city: currentCity,
        province: currentProvince,
        country: currentCountry,
        email: currentEmail,
        contactNumber: currentContactNumber,
        linkedinLink: currentLinkedinLink,
        portfolioLink: currentPortfolioLink,
        githubLink: currentGithubLink,
        facebookLink: currentFacebookLink,
        instagramLink: currentInstagramLink,
        xLink: currentXLink,
      });
    }
  }, [
    open,
    currentCity,
    currentProvince,
    currentCountry,
    currentEmail,
    currentContactNumber,
    currentLinkedinLink,
    currentPortfolioLink,
    currentGithubLink,
    currentFacebookLink,
    currentInstagramLink,
    currentXLink,
  ]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving contact info:", error);
      toast.error("Failed to save contact info. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Edit Contact & Address Info</DialogTitle>
          <DialogDescription>
            Update your location and contact details. This information will be
            visible to visitors on your profile.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 overflow-auto no-scrollbar">
          <div className="space-y-6 py-4">
            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <MapPinIcon className="size-4" />
                <h3>Address Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="city" className="text-xs">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g. San Pablo City"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="province" className="text-xs">
                    Province / State
                  </Label>
                  <Input
                    id="province"
                    placeholder="e.g. Laguna"
                    value={formData.province}
                    onChange={(e) => handleChange("province", e.target.value)}
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="country" className="text-xs">
                    Country
                  </Label>
                  <Input
                    id="country"
                    placeholder="e.g. Philippines"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <MailIcon className="size-4" />
                <h3>Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs">
                    Email Address
                  </Label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contactNumber" className="text-xs">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="contactNumber"
                      className="pl-9"
                      placeholder="+63 9xx xxx xxxx"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        handleChange("contactNumber", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Social Links Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <GlobeIcon className="size-4" />
                <h3>Social & Professional Links</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="portfolio" className="text-xs">
                    Portfolio Website
                  </Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="portfolio"
                      className="pl-9"
                      placeholder="https://yourportfolio.com"
                      value={formData.portfolioLink}
                      onChange={(e) =>
                        handleChange("portfolioLink", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="linkedin" className="text-xs">
                      LinkedIn Profile
                    </Label>
                    <div className="relative">
                      <LinkedinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        className="pl-9"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedinLink}
                        onChange={(e) =>
                          handleChange("linkedinLink", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="github" className="text-xs">
                      GitHub Profile
                    </Label>
                    <div className="relative">
                      <GithubIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="github"
                        className="pl-9"
                        placeholder="https://github.com/username"
                        value={formData.githubLink}
                        onChange={(e) =>
                          handleChange("githubLink", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="facebook" className="text-xs">
                      Facebook Profile
                    </Label>
                    <div className="relative">
                      <FacebookIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="facebook"
                        className="pl-9"
                        placeholder="https://facebook.com/username"
                        value={formData.facebookLink}
                        onChange={(e) =>
                          handleChange("facebookLink", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="instagram" className="text-xs">
                      Instagram Profile
                    </Label>
                    <div className="relative">
                      <InstagramIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="instagram"
                        className="pl-9"
                        placeholder="https://instagram.com/username"
                        value={formData.instagramLink}
                        onChange={(e) =>
                          handleChange("instagramLink", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="x" className="text-xs">
                    X (Twitter) Profile
                  </Label>
                  <div className="relative">
                    <XIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="x"
                      className="pl-9"
                      placeholder="https://x.com/username"
                      value={formData.xLink}
                      onChange={(e) => handleChange("xLink", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button disabled={isSaving} onClick={handleSave}>
            {isSaving ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactInfoEditorDialog;
