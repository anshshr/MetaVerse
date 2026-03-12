import { prisma } from "../../../config/prisma.js";

export const UserService = {
  // update the metadata

  async updateMetadata(avatarId: string, userId: string) {
    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarId: avatarId,
      },
    });

    return;
  },

  //get all the availabel avatars
  async getAllAvatars() {
    return await prisma.avatar.findMany();
  },

  // get the particular ids
  async getAvatarIds(ids: string[]) {
    return await prisma.avatar.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  },
};
