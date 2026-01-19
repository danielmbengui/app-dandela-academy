import { auth } from "@/contexts/firebase/config";
import axios from "axios";

export class ClassFile {
    static TYPE_FILE = Object.freeze({
        IMAGE: 'image',
        VIDEO: 'video',
        GIF: 'gif',
        DOCUMENT: 'document',
        JSON: 'json',
        MUSIC: 'music',
        OTHER: 'other',
    });
    static DEFAULT_TYPE_FILE = ClassFile.TYPE_FILE.OTHER;
    static SUPPORTED_IMAGES_TYPES = [
        { name: "PNG", extension: '.png', value: 'image/png' }, // PDF
        { name: "JPG", extension: '.jpg', value: 'image/jpg' },
        { name: "JPEG", extension: '.jpeg', value: 'image/jpeg' },
        { name: "WEBP", extension: '.webp', value: 'image/webp' },
        //{name:"",extension:'',value:''},
    ];
    static SUPPORTED_VIDEOS_FILES_TYPES = [
        { name: "MP4", extension: '.mp4', value: 'video/mp4' },
        { name: "WebM", extension: '.webm', value: 'video/webm' },
        { name: "MOV", extension: '.mov', value: 'video/quicktime' },
        { name: "AVI", extension: '.avi', value: 'video/x-msvideo' },
        { name: "MPEG", extension: '.mpeg', value: 'video/mpeg' },
        { name: "OGV", extension: '.ogv', value: 'video/ogg' },
        //{ name: "GIF", extension: '.gif', value: 'image/gif' } // image animée
    ];
    static SUPPORTED_DOUMENT_TYPES = [
        { name: "PDF", extension: '.pdf', value: 'application/pdf' }, // PDF
        { name: "TXT", extension: '.txt', value: 'text/plain' },
        { name: "DOC (Word)", extension: '.doc', value: 'application/msword' },
        { name: "DOCX (Word)", extension: '.docx', value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
        { name: "XLS (Excel)", extension: '.xls', value: 'application/vnd.ms-excel' },
        { name: "XLSX (Excel)", extension: '.xlsx', value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { name: "CSV", extension: '.csv', value: 'text/csv' },
        { name: "PPT (PowerPoint)", extension: '.ppt', value: 'application/vnd.ms-powerpoint' },
        { name: "PPTX (PowerPoint)", extension: '.pptx', value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
        { name: "HTML", extension: '.htm', value: 'text/html' },
        { name: "HTML", extension: '.html', value: 'text/html' },
        { name: "JSON", extension: '.json', value: 'application/json' },
        //{name:"",extension:'',value:''},
    ];
    static SUPPORTED_AUDIO_TYPES = [
        { name: "MP3", extension: '.mp3', value: 'audio/mpeg' },
        { name: "WAV", extension: '.wav', value: 'audio/wav' },
        { name: "OGG", extension: '.ogg', value: 'audio/ogg' },
        { name: "AAC", extension: '.aac', value: 'audio/aac' },
        { name: "FLAC", extension: '.flac', value: 'audio/flac' },
        { name: "M4A", extension: '.m4a', value: 'audio/mp4' },
    ];
    constructor({
        id = "",
        uri = "",
        path = "",
        name = "",
        type = "",
        size = 0,
        tag = "",
        source_uri = "",
    } = {}) {
        this._id = id;
        this._uri = uri;
        this._path = path;
        this._name = name;
        this._type = type;
        this._size = size;
        this._tag = tag;
        this._source_uri = source_uri;
    }

    // 🔁 Getters & Setters

    get id() { return this._id; }
    set id(val) { this._id = val; }

    get uri() { return this._uri; }
    set uri(val) { this._uri = val; }

    get path() { return this._path; }
    set path(val) { this._path = val; }

    get name() { return this._name; }
    set name(val) { this._name = val; }

    get type() { return this._type; }
    set type(val) { this._type = val; }

    get size() { return this._size; }
    set size(val) { this._size = val; }

    get tag() { return this._tag; }
    set tag(val) { this._tag = val; }

    get source_uri() { return this._source_uri; }
    set source_uri(val) { this._source_uri = val; }

    // ✅ Conversion en objet brut (pour Firestore / export JSON)
    toJSON() {
        return {
            id: this._id,
            uri: this._uri,
            path: this._path,
            name: this._name,
            type: this._type,
            size: this._size,
            tag: this._tag,
            source_uri: this._source_uri,
        };
    }
    static formatFileName = (fileName, maxLength = 18) => {
        if (fileName?.length > maxLength) {
            return `${fileName.substring(0, parseInt(maxLength / 2))}...${fileName.substring(fileName.length - parseInt(maxLength / 2))}`;
        }
        return (fileName);
    }
    static async uploadFileToFirebase({ path = "", file = null }) {
        if (!(file instanceof File)) throw new Error("file must be File instance !");
        //console.log("RESULT uploadFileToFirebase",file);
        try {
            const formData = new FormData();
            //formData.append('video', file);
            //formData.append("user_uid", user?.uid);
            //formData.append("video", file); // ✅ doit correspondre au champ dans `files.video`
            //formData.append("description", resultFinal);
            formData.append("path", path);
            formData.append("file", file, file.name);
            const token = await auth.currentUser.getIdToken();

            const result = await axios.post('/api/firebase/upload-file-to-storage', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            /*
            const fetchTranslate = await fetch(`/api/firebase/upload-file-to-storage`, formData,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result1 = await fetchTranslate.json();
            */
            console.log("UPLOAD", result.data)
            return (result.data);
        } catch (error) {
            console.log("errrror classFIle", error)
        }
        //{uri:url,name:file.originalFilename,type:file.mimetype,path:path}
        //return await uploadFileToFirebaseClient({id_user,path,file});

    }

    static async uploadFileToOpenAI({ file, originalFilename = "ok.pdf" }) {
        if (file instanceof File) {
            const formData = new FormData();
            formData.append('files', file, originalFilename); // ✅ le nom est ici
            formData.append('user_uid', 'NLWwJbnMXpgp7DldpjYE');
            const token = await auth.currentUser.getIdToken();
            try {
                const resultCreateAssistant = await axios.post(`/api/test-1`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        //"Content-Type": "application/json"
                    },
                    //withCredentials: true, // important si tu n’utilises pas de cookies sécurisés
                });
                console.log("RESPO", resultCreateAssistant.data);
                return resultCreateAssistant.data;
            } catch (error) {
                console.log("ERRRRROR func", error.message);
                return null;
            }
        } else {
            throw new Error("UID is required to save user.");
            return null;
        }
    };
}