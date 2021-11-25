import { NextApiRequest, NextApiResponse } from "next";
import { createProxyMiddleware } from "http-proxy-middleware"

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false,
    },
}

const apiProxy = createProxyMiddleware({
    target: process.env.SHOP_API,
    pathRewrite: {
        ['^/api/shop']: '/api'
    },
    secure: false
});

const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //@ts-ignore
        apiProxy(req, res, (result: any) => {
            if (result instanceof Error) {
                throw result;
            }

            throw new Error(`Request '${req.url}' is not proxied! We should never reach here!`);
        });
    } catch (error) {
        res.status(401).send(error);
    }
};
export default proxy