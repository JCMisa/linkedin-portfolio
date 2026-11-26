"use client";

import { useState } from "react";
import { CheckCircle2, Pencil, Save, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Define the shape of the data we expect
export interface InquiryData {
  id?: string; // Optional, useful if updating a specific DB record
  visitorName: string;
  email: string | null;
  phoneNumber: string | null;
  purpose: string;
  summary: string;
}

interface InquiryReviewProps {
  data: InquiryData;
  onCancel: () => void;
  onSave: (updatedData: InquiryData) => Promise<void>; // Async save handler
}

const InquiryReview = ({ data, onCancel, onSave }: InquiryReviewProps) => {
  const [formData, setFormData] = useState<InquiryData>(data);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof InquiryData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="relative flex h-[80vh] max-h-[800px] min-h-[500px] w-full animate-in flex-col overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl duration-300 zoom-in-95 fade-in">
      {/* Header */}
      <div className="mb-6 flex shrink-0 flex-col items-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-4 ring-emerald-500/5">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Review Details</h2>
        <p className="max-w-xs text-center text-sm text-muted-foreground">
          Please review the information I captured. You can edit any fields
          below before sending.
        </p>
      </div>

      {/* Editable Form */}
      <div className="flex-1 space-y-5 overflow-y-auto px-1">
        {/* Row 1: Name & Purpose */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
              Name <Pencil className="h-3 w-3 opacity-50" />
            </label>
            <Input
              value={formData.visitorName}
              onChange={(e) => handleChange("visitorName", e.target.value)}
              className="bg-muted/30 transition-colors focus:bg-background"
              placeholder="Your Name"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
              Purpose <Pencil className="h-3 w-3 opacity-50" />
            </label>
            <Input
              value={formData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              className="bg-muted/30 transition-colors focus:bg-background"
              placeholder="Reason for calling"
            />
          </div>
        </div>

        {/* Row 2: Contact Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
              Email <Pencil className="h-3 w-3 opacity-50" />
            </label>
            <Input
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-muted/30 transition-colors focus:bg-background"
              placeholder="example@gmail.com"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
              Phone <Pencil className="h-3 w-3 opacity-50" />
            </label>
            <Input
              value={formData.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="bg-muted/30 transition-colors focus:bg-background"
              placeholder="+1 234 567 890"
            />
          </div>
        </div>

        {/* Row 3: Summary */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
            Conversation Summary <Pencil className="h-3 w-3 opacity-50" />
          </label>
          <Textarea
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            className="min-h-[120px] resize-none bg-muted/30 leading-relaxed transition-colors focus:bg-background"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex shrink-0 justify-end gap-3 border-t border-border/50 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          <X className="mr-2 h-4 w-4" /> Discard
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isSaving}
          className="min-w-[140px]"
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Confirm & Send
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default InquiryReview;
