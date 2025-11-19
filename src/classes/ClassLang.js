//import { IMAGE_BRITISH_FLAG, IMAGE_FRENCH_FLAG, IMAGE_PORTUGUESE_FLAG } from "@/lib/constants_images";
//import { defaultLanguage, language_en, language_fr, language_pt } from "@/lib/i18n/settings";
//import { IMAGE_BRITISH_FLAG, IMAGE_FRENCH_FLAG, IMAGE_PORTUGUESE_FLAG } from "../src/libs/constants/constants_images";
import { IMAGE_BRITISH_FLAG, IMAGE_FRENCH_FLAG, IMAGE_PORTUGUESE_FLAG } from "@/contexts/constants/constants_images";
import { defaultLanguage, language_en, language_fr, language_pt } from "@/contexts/i18n/settings";
//import { defaultLanguage, language_en, language_fr, language_pt } from "../src/libs/i18n/settings";


export class ClassLang {
    constructor({
        id = "",
        name = "",
        flag = "",
    } = {}) {
        this._id = id;
        this._name = name;
        this._flag = flag;
    }

    // ✅ Getters & Setters
    static LOCAL_STORAGE_LANG = 'lang';
    static DEFAULT_LANGUAGE = defaultLanguage;
    static LANGUAGE_FRENCH = language_fr;
    static LANGUAGE_ENGLISH = language_en;
    static LANGUAGE_PORTUGUESE = language_pt;
    //static ALL_LANGUAGES = ARRAY_CLASS_LANGUAGES;
    static ALL_LANGUAGES = [
        new ClassLang({ id: ClassLang.LANGUAGE_FRENCH, name: 'Français', flag: IMAGE_FRENCH_FLAG }),
        new ClassLang({ id: ClassLang.LANGUAGE_ENGLISH, name: 'Anglais', flag: IMAGE_BRITISH_FLAG }),
        new ClassLang({ id: ClassLang.LANGUAGE_PORTUGUESE, name: 'Portugais', flag: IMAGE_PORTUGUESE_FLAG }),
        //new ClassLang({ id: 'de', name: 'Allemand', flag: IMAGE_GERMAN_FLAG }),
    ]

    get id() { return this._id; }
    set id(val) { this._id = val; }

    get name() { return this._name; }
    set name(val) { this._name = val; }

    get flag() { return this._flag; }
    set flag(val) { this._flag = val; }

    // ✅ toJSON
    toJSON() {
        return {
            id: this._id,
            name: this._name,
            flag: this._flag,
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
        return new ClassLang(this.toJSON());
    }
    static getOneLang = (lang = ClassLang.DEFAULT_LANGUAGE) => {
        const LIST = [...ClassLang.ALL_LANGUAGES];
        var i = 0;
        while (i < LIST.length) {
            if (LIST[i].id === lang) {
                return LIST[i];
            }
            i++;
        }
        return null;
    }
}
