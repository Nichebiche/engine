import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { getAccessTokens } from "../../../../db/tokens/getAccessTokens";
import { AddressSchema } from "../../../schemas/address";
import { standardResponseSchema } from "../../../schemas/sharedApiSchemas";

export const AccessTokenSchema = Type.Object({
  id: Type.String(),
  tokenMask: Type.String(),
  walletAddress: AddressSchema,
  createdAt: Type.String(),
  expiresAt: Type.String(),
  label: Type.Union([Type.String(), Type.Null()]),
});

const responseBodySchema = Type.Object({
  result: Type.Array(AccessTokenSchema),
});

export async function getAllAccessTokens(fastify: FastifyInstance) {
  fastify.route<{
    Reply: Static<typeof responseBodySchema>;
  }>({
    method: "GET",
    url: "/auth/access-tokens/get-all",
    schema: {
      summary: "Get all access tokens",
      description: "Get all access tokens",
      tags: ["Access Tokens"],
      operationId: "getAll",
      response: {
        ...standardResponseSchema,
        [StatusCodes.OK]: responseBodySchema,
      },
    },
    handler: async (req, res) => {
      const accessTokens = await getAccessTokens();
      res.status(200).send({
        result: accessTokens.map((token) => ({
          ...token,
          createdAt: token.createdAt.toISOString(),
          expiresAt: token.expiresAt.toISOString(),
        })),
      });
    },
  });
}
