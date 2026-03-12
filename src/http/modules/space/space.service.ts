import { prisma } from "../../../config/prisma.js";

export const SpaceService = {
  // crete a space

  async createSpace(
    name: string,
    dimensions: string,
    mapId: string,
    creatorId: string,
  ) {
    const map = await prisma.map.findUnique({
      where: {
        id: mapId,
      },
    });
    if (!map) {
      throw "Map Do not exist";
    } else {
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
    }
  },

  //delete a space

  async deleteSpace(spaceId: string) {
    const space = await prisma.space.findUnique({
      where: {
        id: spaceId,
      },
    });

    if (!space) {
      throw "Space do not exist";
    } else {
      await prisma.space.delete({
        where: {
          id: spaceId,
        },
      });
    }
  },

  // get my existing space

  async getMySpaces(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw Error("User do not exist");
    } else {
      return await prisma.space.findMany({
        where: {
          creatorId: userId,
        },
      });
    }
  },
};
