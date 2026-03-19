/* eslint-disable @typescript-eslint/no-explicit-any */
const mockDocSet = jest.fn();
const mockDocGet = jest.fn();
const mockDocDelete = jest.fn();
const mockDocData = jest.fn();

const mockBatchSet = jest.fn();
const mockBatchDelete = jest.fn();
const mockBatchCommit = jest.fn();

const mockCollectionGet = jest.fn();
const mockCollectionDoc = jest.fn();

jest.mock("../../lib/firebase/firebaseAdmin", () => ({
    adminDb: {
        doc: jest.fn(() => ({
            get: mockDocGet,
            set: mockDocSet,
            delete: mockDocDelete,
            data: mockDocData,
        })),
        collection: jest.fn(() => ({
            get: mockCollectionGet,
            doc: mockCollectionDoc,
        })),
        batch: jest.fn(() => ({
            set: mockBatchSet,
            delete: mockBatchDelete,
            commit: mockBatchCommit,
        })),
    },
}));

jest.mock("../user", () => ({
    getIsAdmin: jest.fn(),
}));

import {
    addBadge,
    checkBadges,
    deleteBadge,
    setUserBadges,
} from "@/actions/badges";
import { getIsAdmin } from "@/actions/user";
import { IUserProfile } from "@/interfaces/interfaces";

const baseBadgeMock = {
    id: "test",
    title: "Test",
} as any;

describe("addBadge", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should create badge if admin and doc not exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        mockDocGet.mockResolvedValue({ exists: false });

        await addBadge("token", baseBadgeMock);

        expect(mockDocSet).toHaveBeenCalled();
    });
    it("should not create badge if admin and doc exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        mockDocGet.mockResolvedValue({ exists: true });

        await addBadge("token", baseBadgeMock);

        expect(mockDocSet).not.toHaveBeenCalled();
    });
    it("should not create badge if not admin and doc exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: false });
        mockDocGet.mockResolvedValue({ exists: true });

        await addBadge("token", baseBadgeMock);

        expect(mockDocGet).not.toHaveBeenCalled();
        expect(mockDocSet).not.toHaveBeenCalled();
    });
    it("should not create badge if not admin and doc not exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: false });
        mockDocGet.mockResolvedValue({ exists: false });

        await addBadge("token", baseBadgeMock);

        expect(mockDocGet).not.toHaveBeenCalled();
        expect(mockDocSet).not.toHaveBeenCalled();
    });
    it("should handle errors", async () => {
        (getIsAdmin as jest.Mock).mockRejectedValue(new Error("fail"));

        const spy = jest.spyOn(console, "error").mockImplementation();

        await addBadge("token", baseBadgeMock);

        expect(spy).toHaveBeenCalled();

        spy.mockRestore();
    });
});

describe("deleteBadge", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should delete badge if admin", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });

        await deleteBadge("token", baseBadgeMock);

        expect(mockDocDelete).toHaveBeenCalled();
    });
    it("should not delete badge not admin", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: false });

        await deleteBadge("token", baseBadgeMock);

        expect(mockDocDelete).not.toHaveBeenCalled();
    });
});

describe("setUserBadges", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockCollectionGet.mockResolvedValue({
            docs: Array.from({ length: 9 }, (_, i) => ({
                id: i.toString(),
                ref: {},
            })),
        });

        mockCollectionDoc.mockImplementation((id?: string) => ({
            id: id ?? "testId",
        }));
    });
    it("should commit changes", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        await setUserBadges("token", [
            {
                id: "test",
                title: "Test",
            },
            {
                id: "test2",
                title: "Test2",
            },
            {
                id: "test3",
                title: "Test3",
            },
        ] as any);
        expect(mockBatchCommit).toHaveBeenCalled();
    });
    it("should commit changes and returns all values", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        const data = await setUserBadges("token", [
            {
                id: "test",
                title: "Test",
            },
            {
                id: "test2",
                title: "Test2",
            },
            {
                id: "test3",
                title: "Test3",
            },
        ] as any);
        expect(mockBatchCommit).toHaveBeenCalled();
        expect(data).toHaveLength(3);
    });
    it("should return empty array if not admin and not commit changes", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: false });
        const data = await setUserBadges("token", [
            {
                id: "test",
                title: "Test",
            },
            {
                id: "test2",
                title: "Test2",
            },
            {
                id: "test3",
                title: "Test3",
            },
        ] as any);
        expect(mockBatchCommit).not.toHaveBeenCalled();
        expect(data).toHaveLength(0);
    });
    it("should set all badges and commit changes", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        await setUserBadges("token", [
            {
                id: "test",
                title: "Test",
            },
            {
                id: "test2",
                title: "Test2",
            },
            {
                id: "test3",
                title: "Test3",
            },
        ] as any);
        expect(mockBatchCommit).toHaveBeenCalled();
        expect(mockBatchSet).toHaveBeenCalledTimes(3);
    });
    it("should handle empty ids and commit changes", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        await setUserBadges("token", [
            {
                id: "test",
                title: "Test",
            },
            {
                title: "Test2",
            },
            {
                title: "Test3",
            },
        ] as any);
        expect(mockBatchCommit).toHaveBeenCalled();
        expect(mockBatchSet).toHaveBeenCalledTimes(3);
    });
    it("should handle existing ids", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        await setUserBadges("token", [
            {
                id: "5",
                title: "Test",
            },
            {
                id: "4",
                title: "Test2",
            },
            {
                id: "3",
                title: "Test3",
            },
            {
                title: "Test2",
            },
        ] as any);
        expect(mockBatchDelete).toHaveBeenCalledTimes(6);
    });
});

describe("checkBadges", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockDocData.mockReturnValue({
            stats: {
                commentsCount: 10,
                followersCount: 0,
                followingCount: 0,
                likesGiven: 0,
                likesReceived: 50,
                postsCount: 0,
                projectsCount: 0,
                streakDays: 0,
            },
        });

        mockDocGet.mockResolvedValue({
            exists: true,
            data: mockDocData,
        });
    });
    it("should returns error if stats not exists", async () => {
        mockDocGet.mockResolvedValue({ exists: false, data: () => undefined });
        await expect(checkBadges("unknown_id")).rejects.toThrow("Unauthorized");
    });
    it("should works if stats exists", async () => {
        await expect(checkBadges("valid_id")).resolves.not.toThrow();
    });
    it("should awards count returns correct value", async () => {
        await expect(checkBadges("valid_id")).resolves.toBe(5);
    });
});
