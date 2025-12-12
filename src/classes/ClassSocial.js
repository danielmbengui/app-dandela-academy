//import { IMAGE_BRITISH_FLAG, IMAGE_FRENCH_FLAG, IMAGE_PORTUGUESE_FLAG } from "@/lib/constants_images";
//import { defaultLanguage, language_en, language_fr, language_pt } from "@/lib/i18n/settings";
//import { IMAGE_BRITISH_FLAG, IMAGE_FRENCH_FLAG, IMAGE_PORTUGUESE_FLAG } from "../src/libs/constants/constants_images";
import { IMAGE_BRITISH_FLAG, IMAGE_FRENCH_FLAG, IMAGE_PORTUGUESE_FLAG } from "@/contexts/constants/constants_images";
import { defaultLanguage, language_en, language_fr, language_pt } from "@/contexts/i18n/settings";
//import { defaultLanguage, language_en, language_fr, language_pt } from "../src/libs/i18n/settings";


export class ClassSocial {
    static SOCIALS = Object.freeze({
        WHATSAPP: 'whatsapp',
        TELEGRAM: 'telegram',
        X: 'x',
        FACEBOOK: 'facebook',
        TIKTOK: 'tiktok',
        YOUTUBE: 'youtube',
        INSTAGRAAM: 'instagram',
        LINKEDIN: 'linkedin',
        GITHUB: 'github',
        PORTFOLIO: 'portfolio',
        UNKNOWN: 'unknown',
    });
    constructor({
        id = "",
        name = "",
        link = "",
    } = {}) {
        this._id = id;
        this._name = name;
        this._link = link;
    }

    get id() { return this._id; }
    set id(val) { this._id = val; }

    get name() { return this._name; }
    set name(val) { this._name = val; }

    get flag() { return this._flag; }
    set flag(val) { this._flag = val; }

    get link() { return this._link; }
    set link(val) { this._link = val; }

    
    // ✅ toJSON
    toJSON() {
        return {
            id: this._id,
            name: this._name,
            link: this._link,
        };
    }
    update(props = {}) {
        for (const key in props) {
            if (this.hasOwnProperty(`_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }
    clone() {
       // console.log('toJson', 'generation class', this.toJSON())
        return new ClassSocial(this.toJSON());
    }
}
