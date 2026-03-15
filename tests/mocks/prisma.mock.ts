export const prismaMock = {
  user: { create: jest.fn(), findFirst: jest.fn() },
  space: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
  element: { create: jest.fn(), findMany: jest.fn() },
  avatar: { create: jest.fn(), findMany: jest.fn() },
  map: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
  spaceElements: { create: jest.fn(), deleteMany: jest.fn() },
  mapElements: { create: jest.fn(), findMany: jest.fn() },
};
