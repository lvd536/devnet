export const mockDocSet = jest.fn();
export const mockDocGet = jest.fn();
export const mockDocDelete = jest.fn();
export const mockDocUpdate = jest.fn();
export const mockDocData = jest.fn();

export const mockBatchSet = jest.fn();
export const mockBatchDelete = jest.fn();
export const mockBatchCommit = jest.fn();

export const mockCollectionGet = jest.fn();
export const mockCollectionDoc = jest.fn();

export const adminDb = {
    doc: jest.fn(() => ({
        get: mockDocGet,
        set: mockDocSet,
        delete: mockDocDelete,
        update: mockDocUpdate,
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
};

export const resetFirebaseMocks = () => {
    mockDocSet.mockReset();
    mockDocGet.mockReset();
    mockDocDelete.mockReset();
    mockDocUpdate.mockReset();
    mockDocData.mockReset();
    mockBatchSet.mockReset();
    mockBatchDelete.mockReset();
    mockBatchCommit.mockReset();
    mockCollectionGet.mockReset();
    mockCollectionDoc.mockReset();

    (adminDb.doc as jest.Mock).mockReturnValue({
        get: mockDocGet,
        set: mockDocSet,
        update: mockDocUpdate,
        delete: mockDocDelete,
    });
    (adminDb.collection as jest.Mock).mockReturnValue({
        get: mockCollectionGet,
        doc: mockCollectionDoc,
    });
    (adminDb.batch as jest.Mock).mockReturnValue({
        set: mockBatchSet,
        delete: mockBatchDelete,
        commit: mockBatchCommit,
    });
};
