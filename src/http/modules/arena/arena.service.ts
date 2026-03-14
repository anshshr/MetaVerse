import { prisma } from "../../../config/prisma.js";

export const ArenaService = {
  // get a particular space
  async getSpace(spaceId: string) {
    const space = await prisma.space.findUnique({
      where: {
        id: spaceId,
      },
      include: {
        spaceElements: {
          include: {
            element: true,
          },
        },
      },
    });

    if (!space) {
      throw Error("space do not exist");
    } else {
      return space;
    }
  },

  //add an element in the space
  async addElement(elementId: string, spaceId: string, x: number, y: number) {
    const element = await prisma.element.findUnique({
      where: {
        id: elementId,
      },
    });

    const space = await prisma.space.findUnique({
      where: {
        id: spaceId,
      },
    });

    if (!element) {
      throw Error("Element do not exist");
    }

    if (!space) {
      throw Error("Space do not exist");
    }

    const spaceElement = await prisma.spaceElements.create({
      data: {
        elementId,
        spaceId,
        x,
        y,
      },
    });

    return spaceElement.id;
  },

  // delete a element
  async deleteElement(elementId: string) {
    await prisma.spaceElements.delete({
      where: {
        id: elementId,
      },
    });
  },

  //see all the elements
  async getAllElements() {
    return await prisma.element.findMany();
  },
};
