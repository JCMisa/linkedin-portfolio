"use client";

import { format, parse } from "date-fns";
import type { Control, FieldValues } from "react-hook-form";
import { DatePicker } from "@/components/forms/DatePicker";
import { ImageUploadField } from "@/components/forms/ImageUploadField";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const DAY = "yyyy-MM-dd";

/** "yyyy-MM-dd" <-> Date in local time (avoids the UTC off-by-one-day shift). */
const toDate = (day: string) => (day ? parse(day, DAY, new Date()) : null);
const toDay = (date: Date | null) => (date ? format(date, DAY) : "");

interface ExperienceFieldsProps<T extends FieldValues> {
  control: Control<T>;
  /** Path prefix: "" for a single-experience form, "experiences.2." in a list. */
  prefix?: string;
  onUploadingChange?: (uploading: boolean) => void;
}

/** The inputs for one work experience; shared by the single and bulk editors. */
export function ExperienceFields<T extends FieldValues>({
  control,
  prefix = "",
  onUploadingChange,
}: ExperienceFieldsProps<T>) {
  // Field paths are built from the prefix, so they can't be statically typed here
  const c = control as unknown as Control<FieldValues>;
  const name = (field: string) => `${prefix}${field}`;

  return (
    <>
      <FormField
        control={c}
        name={name("title")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Frontend Developer at Acme" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={c}
        name={name("description")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                rows={4}
                placeholder="Your role and responsibilities"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={c}
          name={name("dateFrom")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <DatePicker
                  value={toDate(field.value)}
                  onChange={(d) => field.onChange(toDay(d))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={c}
          name={name("dateTo")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End date</FormLabel>
              <FormControl>
                <DatePicker
                  value={toDate(field.value)}
                  onChange={(d) => field.onChange(toDay(d))}
                  placeholder="Present"
                  clearable
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={c}
        name={name("bannerImg")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Banner image</FormLabel>
            <ImageUploadField
              value={field.value}
              onChange={(url) => field.onChange(url ?? "")}
              folder="jcm/experiences"
              onUploadingChange={onUploadingChange}
              allowClear
              previewClassName="h-32"
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
