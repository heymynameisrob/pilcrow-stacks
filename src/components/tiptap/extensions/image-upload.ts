import { uploadFile } from "@uploadcare/upload-client";

export async function uploadEditorImage(file: any) {
  try {
    const upload = await uploadFile(file, {
      publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
      store: "auto",
      metadata: {
        subsystem: "js-client",
      },
    });
    return `${upload.cdnUrl}-/quality/smart/-/format/auto/`;
  } catch (e) {
    console.log(e);
    throw Error;
  }
}
