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

export const AdminService = {
  async createElement(imageUrl: string, width: number, height: number) {
    const element = await prisma.element.create({
      data: {
        imageUrl,
        width,
        height,
      },
    });

    return element.id;
  },

  async updateElement(elementId: string, imageUrl: string) {
    const element = await prisma.element.findUnique({
      where: {
        id: elementId,
      },
    });

    if (!element) {
      throw Error("Element do not exist");
    }

    const updatedElement = await prisma.element.update({
      where: {
        id: elementId,
      },
      data: {
        imageUrl,
      },
    });

    return updatedElement.id;
  },

  async createAvatar(imageUrl: string, name: string) {
    const avatar = await prisma.avatar.create({
      data: {
        imageUrl,
        name,
      },
    });

    return avatar.id;
  },

  async createMap(
    name: string,
    dimensions: string,
    defaultElements: Array<{ elementId: string; x: number; y: number }>,
  ) {
    const { width, height } = parseDimensions(dimensions);
    const uniqueElementIds = [
      ...new Set(defaultElements.map((item) => item.elementId)),
    ];

    if (uniqueElementIds.length > 0) {
      const existingElements = await prisma.element.findMany({
        where: {
          id: {
            in: uniqueElementIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (existingElements.length !== uniqueElementIds.length) {
        throw Error("One or more default elements do not exist");
      }
    }

    const map = await prisma.map.create({
      data: {
        name,
        width,
        height,
        mapElements: {
          create: defaultElements.map((item) => ({
            elementId: item.elementId,
            x: item.x,
            y: item.y,
          })),
        },
      },
    });

    return map.id;
  },
};
