"use client";

import React, { useEffect, useState } from "react";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Eye,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pencil,
  Quote,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

import { SafeHtmlRenderer } from "@/components/shared/SafeHtmlRenderer";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Describe your property, neighborhood highlights, house rules, and lease terms...",
  disabled = false,
  error = false,
  className,
}: RichTextEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] max-h-[420px] overflow-y-auto px-4 py-3 text-sm text-foreground focus:outline-none [&_h2]:font-heading [&_h2]:mt-3 [&_h2]:mb-1.5 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:font-heading [&_h3]:mt-2.5 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500/60 [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:text-blue-600 [&_a]:underline",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const normalizedCurrent = current === "<p></p>" ? "" : current;
    if (value !== normalizedCurrent) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  const handleSetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter link URL (https://...)", previousUrl || "");
    if (url === null) return;
    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: trimmed })
      .run();
  };

  const toolbarButtons = editor
    ? [
        {
          label: "Heading 2",
          icon: Heading2,
          active: editor.isActive("heading", { level: 2 }),
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          label: "Heading 3",
          icon: Heading3,
          active: editor.isActive("heading", { level: 3 }),
          action: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
          label: "Bold",
          icon: Bold,
          active: editor.isActive("bold"),
          action: () => editor.chain().focus().toggleBold().run(),
        },
        {
          label: "Italic",
          icon: Italic,
          active: editor.isActive("italic"),
          action: () => editor.chain().focus().toggleItalic().run(),
        },
        {
          label: "Underline",
          icon: UnderlineIcon,
          active: editor.isActive("underline"),
          action: () => editor.chain().focus().toggleUnderline().run(),
        },
        {
          label: "Bullet List",
          icon: List,
          active: editor.isActive("bulletList"),
          action: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          label: "Ordered List",
          icon: ListOrdered,
          active: editor.isActive("orderedList"),
          action: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
          label: "Blockquote",
          icon: Quote,
          active: editor.isActive("blockquote"),
          action: () => editor.chain().focus().toggleBlockquote().run(),
        },
        {
          label: "Link",
          icon: Link2,
          active: editor.isActive("link"),
          action: handleSetLink,
        },
        {
          label: "Undo",
          icon: Undo2,
          active: false,
          action: () => editor.chain().focus().undo().run(),
        },
        {
          label: "Redo",
          icon: Redo2,
          active: false,
          action: () => editor.chain().focus().redo().run(),
        },
      ]
    : [];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/70 bg-background transition-colors",
        error && "border-rose-500",
        disabled && "opacity-70",
        className,
      )}
    >
      {/* Toolbar + Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-muted/30 px-3 py-2">
        <div className="flex flex-wrap items-center gap-1">
          {mode === "edit" &&
            toolbarButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.label}
                  type="button"
                  disabled={disabled}
                  onClick={btn.action}
                  title={btn.label}
                  aria-label={btn.label}
                  className={cn(
                    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed",
                    btn.active &&
                      "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              );
            })}
        </div>

        <div className="flex items-center rounded-xl border border-border/60 bg-background p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-colors",
              mode === "edit"
                ? "bg-blue-600 text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Pencil className="h-3 w-3" aria-hidden="true" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-colors",
              mode === "preview"
                ? "bg-blue-600 text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Eye className="h-3 w-3" aria-hidden="true" />
            Preview HTML
          </button>
        </div>
      </div>

      {/* Editor or Preview */}
      {mode === "edit" ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="min-h-[200px] max-h-[420px] overflow-y-auto px-4 py-3">
          <SafeHtmlRenderer html={value} />
        </div>
      )}
    </div>
  );
}
