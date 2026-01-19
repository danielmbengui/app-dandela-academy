import { bucketAdmin } from "@/contexts/firebase/configAdmin";

export async function uploadFileToStorage({filePath="", destinationPath="", isBuffer = false, contentType = 'image/jpeg'}) {
    try {
      const metadata = {
        contentType,
        cacheControl: "public, max-age=31536000",
      }
      
      const file = bucketAdmin.file(destinationPath);
      if (isBuffer) {
        await file.save(filePath, {
          metadata: metadata,
        });
      } else {
        await bucketAdmin.upload(filePath, {
          destination: destinationPath,
          metadata: metadata,
        });
      }
      await file.makePublic();
  
      // Récupérer l'URL publique
      const url = `https://storage.googleapis.com/${bucketAdmin.name}/${destinationPath}`;
      //console.log("URL récupérée:", url);
      return url;
    } catch (err) {
      console.error("Erreur upload fichier:", err);
      throw err;
    }
  }