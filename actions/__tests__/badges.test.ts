/* eslint-disable @typescript-eslint/no-explicit-any */
const mockSet = jest.fn();
const mockGet = jest.fn();

jest.mock("../../lib/firebase/firebaseAdmin", () => ({
    adminDb: {
        doc: jest.fn(() => ({
            get: mockGet,
            set: mockSet,
        })),
    },
}));

jest.mock("../user", () => ({
    getIsAdmin: jest.fn(),
}));

import { addBadge } from "@/actions/badges";
import { getIsAdmin } from "@/actions/user";

describe("addBadge", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should create badge if admin and doc not exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        mockGet.mockResolvedValue({ exists: false });

        await addBadge("token", {
            id: "test",
            title: "Test",
        } as any);

        expect(mockSet).toHaveBeenCalled();
    });
    it("should not create badge if admin and doc exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        mockGet.mockResolvedValue({ exists: true });

        await addBadge("token", {
            id: "test",
            title: "Test",
        } as any);

        expect(mockSet).not.toHaveBeenCalled();
    });
    it("should not create badge if not admin and doc exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: false });
        mockGet.mockResolvedValue({ exists: true });

        await addBadge("token", {
            id: "test",
            title: "Test",
        } as any);

        expect(mockGet).not.toHaveBeenCalled();
        expect(mockSet).not.toHaveBeenCalled();
    });
    it("should not create badge if not admin and doc not exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: false });
        mockGet.mockResolvedValue({ exists: false });

        await addBadge("token", {
            id: "test",
            title: "Test",
        } as any);

        expect(mockGet).not.toHaveBeenCalled();
        expect(mockSet).not.toHaveBeenCalled();
    });
    it("should handle errors", async () => {
        (getIsAdmin as jest.Mock).mockRejectedValue(new Error("fail"));

        const spy = jest.spyOn(console, "error").mockImplementation();

        await addBadge("token", {
            id: "test",
            title: "Test",
        } as any);

        expect(spy).toHaveBeenCalled();

        spy.mockRestore();
    });
});
