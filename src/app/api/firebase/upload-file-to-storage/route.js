//import { authAdmin, bucketAdmin } from "../firebase-admin";
//import { getRandomUUID } from "@/functions";
import { authAdmin } from "@/contexts/firebase/configAdmin";
import { uploadFileToStorage } from "../../functions";
import { ClassUser } from "@/classes/users/ClassUser";

export const config = {
  api: {
    bodyParser: false,
  },
};


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  //const lang_source = searchParams.get("lang") || defaultLanguage;
  //const translations = searchParams.get("translations") || "";
  console.log("YAAAAA", request.url)
  return Response.json({ success: true, error: "OKAY", },{ status: 200 });


}
export async function POST(req) {
  const idToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!idToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = await authAdmin.verifyIdToken(idToken);
  const { user_id } = decodedToken;
  

  const formData = await req.formData();
  const path = formData.get("path") || `${ClassUser.COLLECTION}/${user_id}/${file.name}`; // name="file"
  const file = formData.get("file"); // name="file"
  console.log("DECODED file", file);
  if (!file) {
    return Response.json({ error: "No file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

//filePath="", destinationPath="", isBuffer = false, contentType = 'image/jpeg'
  const url = await uploadFileToStorage({
    filePath:buffer,
    destinationPath: path,
    isBuffer: true,
    contentType: file.type,
  });
  return Response.json({
    success: true,
    uri: url,
    name: file.name,
    type: file.type,
    size: file.size,
    path,
  });
}
