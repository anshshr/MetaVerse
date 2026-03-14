import { prisma } from "../../../config/prisma.js";

function parseDimensions(dimensions: string) {
  const [widthPart, heightPart] = dimensions.toLowerCase().split("x");
  const width = Number.parseInt(widthPart ?? "", 10);
  const height = Number.parseInt(heightPart ?? "", 10);

  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw Error("Dimensions should be in WxH format");
  }

  if (width <= 0 || height <= 0) {
    throw Error("Dimensions should be positive numbers");
  }

  return { width, height };
}

export const SpaceService = {
  // crete a space

  async createSpace(
    name: string,
    dimensions: string,
    mapId: string,
    creatorId: string,
  ) {
    const { width, height } = parseDimensions(dimensions);
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
          width,
          height,
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
