test("learn", async () => {
    const mockCallback = jest.fn(async x => Promise.resolve(42 + x));
    await mockCallback(10);
    await mockCallback(10);

    // The mock function is called twice
    expect(mockCallback.mock.calls.length).toBe(2);
});
