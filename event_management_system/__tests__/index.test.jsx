import { eventHandler } from "../src/pages/api/events/index";
import { getAllEvents, createEvent } from "@controllers/eventController";
import { createMocks } from "node-mocks-http";

jest.mock("@controllers/eventController");

describe("API Route: /api/events", () => {
    it("should handle GET requests", async () => {
        const { req, res } = createMocks({
            method: "GET",
        });

        await eventHandler(req, res);

        expect(getAllEvents).toHaveBeenCalledWith(req, res);
    });

    it("should handle POST requests", async () => {
        const { req, res } = createMocks({
            method: "POST",
        });

        await eventHandler(req, res);

        expect(createEvent).toHaveBeenCalledWith(req, res);
    });

    it("should return 405 for unsupported methods", async () => {
        const { req, res } = createMocks({
            method: "DELETE",
        });

        await eventHandler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getHeaders().Allow).toBe("GET, POST");
        expect(res._getData()).toBe("Method DELETE Not Allowed");
    });
});