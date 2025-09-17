/// <reference types="jest" />
import type { Request, Response } from "express";
import * as controller from "../../src/controllers/task_controller";

// Mock the entire Task model
jest.mock("../../src/models/Task", () => {
  return {
    Task: {
      find: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    },
  };
});

import { Task } from "../../src/models/Task";

// helpers: lightweight mock req/res
function mockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response & {
    status: jest.Mock;
    json: jest.Mock;
  };
  return res;
}

function mockReq(init: Partial<Request>): Request {
  return {
    params: {},
    query: {},
    body: {},
    ...init,
  } as unknown as Request;
}

describe("task_controller (unit)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/tasks → getAll: returns list", async () => {
    (Task.find as jest.Mock).mockReturnValue({
      sort: jest
        .fn()
        .mockResolvedValue([{ _id: "1", title: "A", status: "to do" }]),
    });

    const req = mockReq({});
    const res = mockRes();

    await controller.getAll(req, res);

    expect(Task.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([
      { _id: "1", title: "A", status: "to do" },
    ]);
  });

  test("POST /api/tasks → create: success", async () => {
    (Task.create as jest.Mock).mockResolvedValue({
      _id: "1",
      title: "Write README",
      subtitle: "first draft",
      status: "to do",
    });

    const req = mockReq({
      body: { title: "Write README", subtitle: "first draft", status: "to do" },
    });
    const res = mockRes();

    await controller.create(req, res);

    expect(Task.create).toHaveBeenCalledWith({
      title: "Write README",
      subtitle: "first draft",
      status: "to do",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: "1",
      title: "Write README",
      subtitle: "first draft",
      status: "to do",
    });
  });

  test("POST /api/tasks → create: empty title → 400", async () => {
    const req = mockReq({ body: { title: "   " } });
    const res = mockRes();

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "title is required (non-empty string)",
    });
    expect(Task.create).not.toHaveBeenCalled();
  });

  test("POST /api/tasks → create: invalid status → 400", async () => {
    const req = mockReq({ body: { title: "X", status: "invalid" } as any });
    const res = mockRes();

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].error).toMatch(/status must be one of/i);
    expect(Task.create).not.toHaveBeenCalled();
  });

  test("PUT /api/tasks/:id → update: success", async () => {
    (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      _id: "507f191e810c19729de860ea",
      title: "Write README",
      subtitle: "updated",
      status: "in progress",
    });

    const req = mockReq({
      params: { id: "507f191e810c19729de860ea" },
      body: { subtitle: "updated", status: "in progress" },
    });
    const res = mockRes();

    await controller.update(req, res);

    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
      "507f191e810c19729de860ea",
      { subtitle: "updated", status: "in progress" },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith({
      _id: "507f191e810c19729de860ea",
      title: "Write README",
      subtitle: "updated",
      status: "in progress",
    });
  });

  test("PUT /api/tasks/:id → update: invalid id → 400", async () => {
    const req = mockReq({ params: { id: "bad-id" }, body: { status: "done" } });
    const res = mockRes();

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid id" });
    expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  test("PUT /api/tasks/:id → update: not found → 404", async () => {
    (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const req = mockReq({
      params: { id: "507f191e810c19729de860ea" },
      body: { status: "done" },
    });
    const res = mockRes();

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
  });

  test("DELETE /api/tasks/:id → remove: success", async () => {
    (Task.findByIdAndDelete as jest.Mock).mockResolvedValue({
      _id: "507f191e810c19729de860ea",
      title: "Temp",
      status: "to do",
    });

    const req = mockReq({ params: { id: "507f191e810c19729de860ea" } });
    const res = mockRes();

    await controller.remove(req, res);

    expect(Task.findByIdAndDelete).toHaveBeenCalledWith(
      "507f191e810c19729de860ea"
    );
    expect(res.json).toHaveBeenCalledWith({
      _id: "507f191e810c19729de860ea",
      title: "Temp",
      status: "to do",
    });
  });

  test("DELETE /api/tasks/:id → remove: invalid id → 400", async () => {
    const req = mockReq({ params: { id: "bad-id" } });
    const res = mockRes();

    await controller.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid id" });
    expect(Task.findByIdAndDelete).not.toHaveBeenCalled();
  });

  test("DELETE /api/tasks/:id → remove: not found → 404", async () => {
    (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const req = mockReq({ params: { id: "507f191e810c19729de860ea" } });
    const res = mockRes();

    await controller.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
  });
});
