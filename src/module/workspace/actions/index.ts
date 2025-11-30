"use server";

import db from "@/lib/db";
import { currentUser } from "@/module/authentication/actions";
import { MEMBER_ROLE } from "@prisma/client";

export const initializeworkspace = async () => {
  const user = await currentUser();
  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }
  try {
    const workspace = await db.workspace.upsert({
      where: {
        name_ownerId: {
          ownerId: user.id,
          name: "Personal Workspace",
        },
      },
      update: {},
      create: {
        name: "Personal Workspace",
        description: "Default workspace for personal user",
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: MEMBER_ROLE.ADMIN,
          },
        },
      },
      include: {
        members: true,
      },
    });
    return {
      success: true,
      workspace,
    };
  } catch (error) {
    console.error("Error initializing workspace", error);
    return {
      success: false,
      error: "Failed to initialize workspace",
    };
  }
};

export async function getWorkspaces() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const workspaces = await db.workspace.findMany({
    where: {
      OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
    },
    orderBy: { createdAt: "asc" },
  });
  return workspaces;
}

export async function createWorkspaces(name: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const workspace = await db.workspace.create({
    data: {
      name,
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: MEMBER_ROLE.ADMIN,
        },
      },
    },
  });
  return workspace;
}

export const getWorkspaceById = async (id: string) => {
  const workspace = await db.workspace.findUnique({
    where: { id },
    include: {
      members: true,
    },
  });
  return workspace;
};
