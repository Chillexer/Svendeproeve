import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { createProxyMiddleware } from "http-proxy-middleware"

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false,
    },
}

const apiProxy = createProxyMiddleware({
    target: process.env.ADMIN_API,
    pathRewrite: {
        ['^/api/admin']: '/api'
    },
    secure: false
});

const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { accessToken } = await getAccessToken(req, res)
        // console.log(accessToken)
        req.headers.authorization = `Bearer ${accessToken}`
        //@ts-ignore
        apiProxy(req, res, (result: any) => {
            if (result instanceof Error) {
                throw result;
            }

            throw new Error(`Request '${req.url}' is not proxied! We should never reach here!`);
        });
    } catch (error: any) {
        res.status(401).send(error);
    }
};
export default withApiAuthRequired(proxy)