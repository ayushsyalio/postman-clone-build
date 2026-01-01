"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Plus, Trash, Check, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const keyValueSchema = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "value is required"),
      enabled: z.boolean().default(true).optional(),
    })
  ),
});

type keyValueFormData = z.infer<typeof keyValueSchema>;

export interface KeyValueItem {
  key: string;
  value: string;
  enabled?: boolean;
}

interface KeyValueFormEditorProps {
  initialData?: KeyValueItem[];
  onSubmit: (data: KeyValueItem[]) => void;
  placeHolder?: {
    key?: string;
    value?: string;
    description?: string;
  };
  className?: string;
}

const KeyValueForm: React.FC<KeyValueFormEditorProps> = ({
  onSubmit,
  initialData = [],
  placeHolder = { key: "Key", value: "Value", description: "Description" },
  className,
}) => {
  const form = useForm<keyValueFormData>({
    resolver: zodResolver(keyValueSchema),
    defaultValues: {
      items:
        initialData.length > 0
          ? initialData.map((item) => ({
              ...item,
              enabled: item.enabled ?? true,
            }))
          : [{ key: "", value: "", enabled: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const addNewRow = () => {
    append({ key: "", value: "", enabled: true });
  };

  const toggleEnabled = (index: number) => {
    const currentValue = form.getValues(`items.${index}.enabled`);
    form.setValue(`items.${index}.enabled`, !currentValue);
  };

  const removeRow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  //autosave on changes with debounce
  //we will serialize the filtered items and only call onSubmit when it changes.



  const LastSavedRef = useRef<string | null>(null);

  const getFilteredValueItems = (items: KeyValueItem[]) =>
    items
      .filter(
        (item) => item.enabled && (item.key?.trim() || item.value?.trim())
      )
      .map(({ key, value }) => ({ key, value }));

  //simple debounce implementation

  const debounce = (fn: (...args: any[]) => void, wait = 500) => {
    let t: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  const savedIfChange = useCallback((items:KeyValueItem[])=>{
    const filteredData = getFilteredValueItems(items);
    const serialized = JSON.stringify(filteredData);
    if(serialized !== LastSavedRef.current){
      LastSavedRef.current = serialized;
      onSubmit(filteredData)
    }
  }, [onSubmit])

  const debouncedSavedRef = useRef(savedIfChange)
  //keep ref upto date when savedIfChange changes

  useEffect(()=>{
    debouncedSavedRef.current = savedIfChange
  }, [savedIfChange])


  const debouncedInvokerRef = useRef<((items:KeyValueItem[])=>void) | null>(null);

  useEffect(()=>{
    debouncedInvokerRef.current = debounce((items:KeyValueItem[])=>{
      debouncedSavedRef.current(items);
    }, 500)

  },)

  //watch from values and trigger debounced save
  useEffect(()=>{
    const subscription = form.watch((value)=>{
      const items = (value as keyValueFormData)?.items || [];
      debouncedInvokerRef.current?.(items as KeyValueItem[]);
    })
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className={cn("w-full ", className)}>
      <Form {...form}>
        <div className="space-y-4">
          {/* Header  */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400">
              Query Parameters
            </h3>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addNewRow}
                className="h-8 w-8 p-0 hover:bg-zinc-700"
              >
                <Plus />
              </Button>
            </div>
          </div>

          {/* Form input */}
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={cn(
                  "grid grid-cols-12 gap-3 p-3 rounded-lg border-transition-all",
                  form.watch(`items.${index}.enabled`)
                    ? "bg-zinc-900 border-zinc-700"
                    : "bg-zinc-800/50 border-zinc-800 opacity-60"
                )}
              >
                {/* key input */}
          <div className="col-span-4">
              <FormField
                control={form.control}
                  name={`items.${index}.key`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={placeHolder.key}
                            className="bg-transparent border-0 focus:ring-0 focus:border-0 text-sm placeholder:text-zinc-500 "
                            disabled={!form.watch(`items.${index}.enabled`)}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
          </div>

					{/* value input  */}
					<div className="col-span-4">
						<FormField
						control={form.control}
						name={`items.${index}.value`}
						render={({field})=>(
							<FormItem>
								<FormControl>
									<Input
									{...field}
									placeholder={placeHolder.value}
									className="bg-transparent border-0 focus:ring-0 focus:border-0 text-sm placeholder:text-zinc-500"
									disabled={!form.watch(`items.${index}.enabled`)}
									/>
								</FormControl>
								<FormMessage className="text-xs"/>
							</FormItem>
						)}
						/>

					</div>



          <div className="col-span-1 flex items-center justify-center">
            <FormField
              control={form.control}
                name={`items.${index}.enabled`}
                  render={({ field: checkboxField }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEnabled(index)}
                            className={cn(
                            "h-5 w-5 p-0 rounded-sm border-2 transition-colors",
                              checkboxField.value
                              ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
                                  : "border-red-500 text-red-500 hover:border-red-400"
                   )}
                            >
                              {checkboxField.value ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

								{/* Remove Button */}
				<div className="col-span-1 flex items-center justify-center">
					<Button 
					type="button"
					variant='ghost'
					size='sm'
					onClick={()=>removeRow(index)}
					disabled={fields.length <= 1}
					className={cn("h-5 w-5 p-0 transition-colors", fields.length <= 1 ? "text-zinc-600 cursor-not-allowed":"text-red-400 hover:text-red-300 hover:bg-red-900/20")}
					>
						<Trash2 className="h-3 w-3"/>

					</Button>

				</div>



              </div>
            ))}
          </div>

            {/* Auto saved enabled - changes will save automatically */}
          <div className="flex justify-end pt-4">
            <span className="text-xs text-zinc-500">
              Changes saved automatically.

            </span>


          </div>
        </div>
      </Form>
    </div>
  );
};

export default KeyValueForm;
