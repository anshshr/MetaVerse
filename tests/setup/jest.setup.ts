import { prismaMock } from "../mocks/prisma.mock";

// Mock prisma to prevent DB connection attempts when loading all app routes
jest.mock("../../src/config/prisma", () => ({
  prisma: prismaMock,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

// Mock AuthService
jest.mock("../../src/http/modules/auth/auth.service", () => ({
  AuthService: {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
  },
}));

// Mock UserService
jest.mock("../../src/http/modules/users/users.service", () => ({
  UserService: {
    updateMetadata: jest.fn(),
    getAllAvatars: jest.fn(),
    getAvatarIds: jest.fn(),
  },
}));

// Mock AdminService
jest.mock("../../src/http/modules/admin/admin.service", () => ({
  AdminService: {
    createElement: jest.fn(),
    updateElement: jest.fn(),
    createAvatar: jest.fn(),
    createMap: jest.fn(),
  },
}));

// Mock ArenaService
jest.mock("../../src/http/modules/arena/arena.service", () => ({
  ArenaService: {
    getSpace: jest.fn(),
    addElement: jest.fn(),
    deleteElement: jest.fn(),
    getAllElements: jest.fn(),
  },
}));

// Mock SpaceService
jest.mock("../../src/http/modules/space/space.service", () => ({
  SpaceService: {
    createSpace: jest.fn(),
    deleteSpace: jest.fn(),
    getMySpaces: jest.fn(),
  },
}));
