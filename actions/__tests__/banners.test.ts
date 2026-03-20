/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    mockBatchCommit,
    mockDocGet,
    mockDocSet,
    mockDocDelete,
    mockDocData,
    mockCollectionGet,
    mockCollectionDoc,
    mockBatchSet,
    mockBatchDelete,
    resetFirebaseMocks,
    mockDocUpdate,
} from "../__mocks__/firebaseAdmin.mock";
import { getIsAdmin } from "../../actions/user";

jest.mock("../../lib/firebase/firebaseAdmin", () => {
    const mock = jest.requireActual("../__mocks__/firebaseAdmin.mock");
    return mock;
});
jest.mock("../../actions/user", () => {
    const mock = jest.requireActual("../__mocks__/user.mock");
    return mock;
});

import {
    addBanner,
    addUserBanner,
    checkBanners,
    deleteBanner,
    setUserBanner,
    setUserBanners,
} from "../banners";

const bannerDefault = {
    id: "banner",
} as any;

describe("addBanner", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetFirebaseMocks();
    });
    it("should add banner if admin and banner not exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        mockDocGet.mockResolvedValue({ exists: false });

        await addBanner("token", bannerDefault);

        expect(mockDocSet).toHaveBeenCalled();
    });
    it("should not add banner if admin and banner exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        mockDocGet.mockResolvedValue({ exists: true });

        await addBanner("token", bannerDefault);

        expect(mockDocSet).not.toHaveBeenCalled();
    });
    it("should not add banner if not admin", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: false });
        mockDocGet.mockResolvedValue({ exists: false });

        await addBanner("token", bannerDefault);

        expect(mockDocSet).not.toHaveBeenCalled();
    });
});

describe("addUserBanner", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetFirebaseMocks();
    });
    it("should add banner if admin and banner not exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({
            isAdmin: true,
            uid: "testuid",
        });
        mockDocGet.mockResolvedValue({ exists: false });

        await addUserBanner("token", bannerDefault);

        expect(mockDocSet).toHaveBeenCalled();
    });
    it("should not add banner if admin and banner exists", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({
            isAdmin: true,
            uid: "testuid",
        });
        mockDocGet.mockResolvedValue({ exists: true });

        await addUserBanner("token", bannerDefault);

        expect(mockDocSet).not.toHaveBeenCalled();
    });
    it("should not add banner if not admin", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({
            isAdmin: false,
            uid: "testuid",
        });
        mockDocGet.mockResolvedValue({ exists: false });

        await addUserBanner("token", bannerDefault);

        expect(mockDocSet).not.toHaveBeenCalled();
    });
});

describe("deleteBanner", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetFirebaseMocks();
    });
    it("should delete banner if admin", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });

        await deleteBanner("token", "bannerId");

        expect(mockDocDelete).toHaveBeenCalled();
    });
    it("should not delete banner if not admin", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: false });

        await deleteBanner("token", "bannerId");

        expect(mockDocDelete).not.toHaveBeenCalled();
    });
});

describe("setUserBanners", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetFirebaseMocks();

        mockCollectionGet.mockResolvedValue({
            docs: Array.from({ length: 9 }, (_, i) => ({
                id: i.toString(),
                ref: {},
            })),
        });

        mockCollectionDoc.mockImplementation((id?: string) => ({
            id: id ?? "testBannerId",
        }));
    });
    it("should commit changes", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        await setUserBanners("token", [
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
        const data = await setUserBanners("token", [
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
    it("should set all badges and commit changes", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ isAdmin: true });
        await setUserBanners("token", [
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
        await setUserBanners("token", [
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
        await setUserBanners("token", [
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

describe("checkBanners", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetFirebaseMocks();

        mockDocData.mockReturnValue({
            stats: {
                commentsCount: 10,
                followersCount: 25,
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
    it("should call 2 data calls if user data exists", async () => {
        mockCollectionGet.mockResolvedValue({
            empty: false,
            docs: [
                {
                    data: () => ({ id: "testBanner1", condition: "posts>10" }),
                },
            ],
        });
        await checkBanners("id");
        expect(mockDocData).toHaveBeenCalledTimes(2);
    });
    it("should call 1 data calls if user data not exists", async () => {
        mockDocData.mockReturnValue(undefined);
        mockCollectionGet.mockResolvedValue({
            empty: false,
            docs: [
                {
                    data: () => ({ id: "testBanner1", condition: "posts>10" }),
                },
            ],
        });
        await checkBanners("id");
        expect(mockDocData).toHaveBeenCalledTimes(1);
    });
});

describe("setUserBanner", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetFirebaseMocks();
    });
    it("should update user if exists and have banner", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ uid: "testUser" });
        mockDocGet.mockResolvedValue({
            exists: true,
        });
        await setUserBanner("token", {
            id: "test",
            title: "Test",
        } as any);
        expect(mockDocUpdate).toHaveBeenCalled();
    });
    it("should update user if exists and have not banner", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ uid: "testUser" });
        mockDocGet.mockResolvedValue({
            exists: true,
        });
        await setUserBanner("token", null);
        expect(mockDocUpdate).toHaveBeenCalled();
    });
    it("should not update user if not exists and have not banner", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ uid: "testUser" });
        mockDocGet.mockResolvedValue({
            exists: false,
        });
        await setUserBanner("token", null);
        expect(mockDocUpdate).not.toHaveBeenCalled();
    });
    it("should not update user if not exists and have banner", async () => {
        (getIsAdmin as jest.Mock).mockResolvedValue({ uid: "testUser" });
        mockDocGet.mockResolvedValue({
            exists: false,
        });
        await setUserBanner("token", {
            id: "test",
            title: "Test",
        } as any);
        expect(mockDocUpdate).not.toHaveBeenCalled();
    });
});
