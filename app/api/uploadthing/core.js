import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getToken } from "next-auth/jwt";

const f = createUploadthing();

const auth = async (req) => {
  const token = await getToken({ req });
  if (!token?.sub) return null;
  return { id: token.sub };
};

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
      fileTypes: ["jpg", "png", "jpeg", "webp"],
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload complete for userId:", metadata.userId);
      return { url: file.ufsUrl };
    }),

  audioUploader: f({
    audio: {
      maxFileSize: "16MB",
      maxFileCount: 1,
      fileTypes: ["mp3", "wav", "ogg"],
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Audio upload complete for userId:", metadata.userId);
      return {
        url: file.ufsUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      };
    }),
};
