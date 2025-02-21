import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const notesJson = await ctx.db.query("notes").collect();
        return notesJson;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const noteId = await ctx.db.insert("notes", {
            title: args.title,
            content: args.content,
            lastEditTime: Date.now(),
        });

        return noteId;
    },
});

export const deleteNote = mutation({
    args: {
        noteId: v.id("notes"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.noteId);
    },
});

export const updateNote = mutation({
    args: {
        noteId: v.id("notes"),
        title: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.noteId, {
            title: args.title,
            content: args.content,
            lastEditTime: Date.now(),
        });
    },
})