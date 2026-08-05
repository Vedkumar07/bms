import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const client = {
  user: {
    findFirst: async () => null,
    create: async ({ data }: { data: { username: string; password: string } }) => ({
      id: 'local-user',
      username: data.username,
      password: data.password,
    }),
  },
};