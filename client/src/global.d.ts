declare namespace Nodejs{
    interface ProcessEnv{
        NODE_ENV: "development" | "production" | "test";
        REACT_APP_DEV_URL: string;
        REACT_APP_PROD_URL: string;
    }
}