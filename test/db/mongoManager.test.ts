// LIBRARIES
import { expect } from "@jest/globals";
import { describe, it, beforeEach, afterEach } from "@jest/globals";
import sinon from "sinon";
import mongoose from "mongoose";
// MANAGERS
import MongoManager from "../../src/db/mongoManager";
// CONFIGS
import DB_CONFIG from "../../src/config/db.config";

describe("MongoManager", () => {
    let connectStub: sinon.SinonStub;
    let consoleLogStub: sinon.SinonStub;

    beforeEach(() => {
        connectStub = sinon.stub(mongoose, "connect");
        consoleLogStub = sinon.stub(console, "log");
        // Resetear la instancia de MongoManager entre pruebas
        (MongoManager as any)._instance = null;
    });

    afterEach(() => {
        sinon.restore();
    });

    it("Should create a sigle instance (Singleton)", () => {
        const instance1 = MongoManager.connect();
        const instance2 = MongoManager.connect();
        expect(instance1).toEqual(instance2);
    });

    it("Should throw an error if Mongo URI is not defined", () => {
        const originalUri = DB_CONFIG.mongo.uri;
        DB_CONFIG.mongo.uri = null;

        expect(() => MongoManager.connect()).toThrow(
            "MongoDB URI is not defined."
        );

        DB_CONFIG.mongo.uri = originalUri;
    });

    it("Should try connect to MongoDB", () => {
        MongoManager.connect();
        expect(connectStub.calledOnce).toBe(true);
        expect(connectStub.calledWith(DB_CONFIG.mongo.uri)).toBe(true);
    });

    // it("debería manejar errores de conexión", () => {
    //     const errorEvent = "error";
    //     const fakeError = new Error("Conexión fallida");

    //     connectStub.returns({
    //         on: (event: string, callback: Function) => {
    //             if (event === errorEvent) {
    //                 callback(fakeError);
    //             }
    //         },
    //         once: sinon.stub(),
    //     });

    //     expect(() => {
    //         MongoManager.connect();
    //     }).toThrow();
    //     expect(consoleLogStub.calledWith(`db connection failed: `)).toBe(true);
    // });

    // it("debería registrar una conexión exitosa", (done) => {
    //     const openEvent = "open";

    //     connectStub.returns({
    //         on: sinon.stub(),
    //         once: (event: string, callback: Function) => {
    //             if (event === openEvent) {
    //                 callback();
    //             }
    //         },
    //     });

    //     MongoManager.connect();

    //     setImmediate(() => {
    //         try {
    //             const result = consoleLogStub.calledWith(
    //                 "db connection succeeded"
    //             );
    //             console.log("Resultado de calledWith:", result);
    //             console.log(
    //                 "Todas las llamadas a consoleLogStub:",
    //                 consoleLogStub.args
    //             );
    //             expect(result).toBe(true);
    //             done();
    //         } catch (error: any) {
    //             done(error);
    //         }
    //     });
    // });
});
