import { prisma } from "../../../config/prisma.js";

export const SpaceService = {
  // crete a space

  async createSpace(
    name: string,
    dimensions: string,
    mapId: string,
    creatorId: string,
  ) {
    const space = await prisma.space.create({
      data: {
        name: name,
        height: parseInt(dimensions.split("x")[0]!),
        width: parseInt(dimensions.split("x")[1]!),
        creatorId: creatorId,
        mapId: mapId,
      },
    });

    return space.id;
  },

  //delete a space

  async deleteSpace(spaceId: string) {
    await prisma.space.delete({
      where: {
        id: spaceId,
      },
    });
  },

  // get my existing space

  async getMySpaces(userId: string) {
    return await prisma.space.findMany({
      where: {
        creatorId: userId,
      },
    });
  },
};
