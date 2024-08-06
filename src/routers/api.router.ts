import { Router, Request, Response } from "express";

class ApiRouter {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/", this.helloWorld);
    }

    private helloWorld(req: Request, res: Response): void {
        res.send("Hello World");
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default ApiRouter;
