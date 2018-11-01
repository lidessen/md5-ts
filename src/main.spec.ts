import md5 from "./main";

test("md5 '君问归期未有期' should be '649e8d1285cef0eb0982f36b94418a11'", () => {
    expect(md5("君问归期未有期")).toBe("649e8d1285cef0eb0982f36b94418a11");
});
