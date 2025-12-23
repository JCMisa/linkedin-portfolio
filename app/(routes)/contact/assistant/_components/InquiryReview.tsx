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
    } catch (error) {
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="relative w-full shadow-2xl rounded-3xl border border-border bg-card p-6 h-[80vh] min-h-[500px] max-h-[800px] flex flex-col overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="flex flex-col items-center mb-6 shrink-0">
        <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-emerald-500/5">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Review Details</h2>
        <p className="text-muted-foreground text-center text-sm max-w-xs">
          Please review the information I captured. You can edit any fields
          below before sending.
        </p>
      </div>

      {/* Editable Form */}
      <div className="space-y-5 flex-1 overflow-y-auto px-1">
        {/* Row 1: Name & Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
              Name <Pencil className="h-3 w-3 opacity-50" />
            </label>
            <Input
              value={formData.visitorName}
              onChange={(e) => handleChange("visitorName", e.target.value)}
              className="bg-muted/30 focus:bg-background transition-colors"
              placeholder="Your Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
              Purpose <Pencil className="h-3 w-3 opacity-50" />
            </label>
            <Input
              value={formData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              className="bg-muted/30 focus:bg-background transition-colors"
              placeholder="Reason for calling"
            />
          </div>
        </div>

        {/* Row 2: Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
              Email <Pencil className="h-3 w-3 opacity-50" />
            </label>
            <Input
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-muted/30 focus:bg-background transition-colors"
              placeholder="example@gmail.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
              Phone <Pencil className="h-3 w-3 opacity-50" />
            </label>
            <Input
              value={formData.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="bg-muted/30 focus:bg-background transition-colors"
              placeholder="+1 234 567 890"
            />
          </div>
        </div>

        {/* Row 3: Summary */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
            Conversation Summary <Pencil className="h-3 w-3 opacity-50" />
          </label>
          <Textarea
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            className="bg-muted/30 focus:bg-background transition-colors min-h-[120px] resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-end gap-3 shrink-0 pt-4 border-t border-border/50">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          <X className="h-4 w-4 mr-2" /> Discard
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
              <Save className="h-4 w-4 mr-2" /> Confirm & Send
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default InquiryReview;
