
export class ClassColor {
    static MODE = Object.freeze({
        BUTTON_COLOR: 'button_color',
        BUTTON_TEXT_COLOR: 'button_text_color',
        BUTTON_CLOSE_CLOSED: 'button_close_closed',
        BORDER_COLOR: 'border_color',
        BORDER_TOP_COLOR: 'border_top_color',
        BACKGROUND_TOP_COLOR: 'background_top_color',
        TEXT_TOP_COLOR: 'text_top_color',
        BUTTON_CLOSE_OPENED: 'button_close_opened',
        BACKGROUND_MESSAGE_LIST: 'background_message_list',
        BACKGROUND_BUBBLE_COLOR_SYSTEM: 'background_bubble_color_system',
        TEXT_BUBBLE_COLOR_SYSTEM: 'text_bubble_color_system',
        BACKGROUND_BUBBLE_COLOR_USER: 'background_bubble_color_user',
        TEXT_BUBBLE_COLOR_USER: 'text_bubble_color_user',
        BORDER_BOTTOM_COLOR: 'border_bottom_color',
        BACKGROUND_BOTTOM_COLOR: 'background_bottom_color',
        TEXT_BOTTOM_COLOR: 'text_bottom_color',
        BACKGROUND_TEXTFIELD_COLOR: 'background_textfield_color',
        TEXT_TEXTFIELD_COLOR: 'text_textfield_color',
        BORDER_TEXTFIELD_COLOR: 'border_textfield_color',
        FOCUS_TEXTFIELD_COLOR: 'focus_textfield_color',
        BUTTON_SEND_COLOR: 'button_send_color',
        BUTTON_SEND_DISABLED_COLOR: 'button_send_disabled_color',
        TEXT_POLICY_COLOR: 'text_policy_color',
        BACKGROUND_IMAGE_BOT_CLOSED: 'background_image_bot_closed',
        BACKGROUND_IMAGE_BOT_OPENED: 'background_image_bot_opened',
    });

    static TRANSPARENT = "transparent";
    static CORAL = "#F88379";
    static BLUE_ROYAL = "#1670F6";
    static WHITE = "#FFFFFF";
    static BLACK = "#000000";
    static GOLD = "#F5C146";
    static BLUE_HYPER_LIGHT = "#d0e1ff";
    static BLUE_DARK = "#001131";
    static BLUE_LIGHT = "#6bb8f6";
    static ORANGE_DARK = "#F16924";
    static ORANGE_HYPER_LIGHT = "#fddcbd";
    static GREY_HYPER_LIGHT = "#e4e4e4";
    static GREY_LIGHT = "#A6A6A6";
    static GREY_DARK = "#3E3E3E";
    static BEIGE_LIGHT = "#FAF3E6";
    /*
    Début du dégradé (robot / texte)	Bleu profond	#1f6fff (ta couleur de base)
Milieu du dégradé	Bleu clair / cyan	#44bdfd
Fin du dégradé (reflet/text ombré)	Bleu-violet doux	#736bff
Intérieur visage robot (fond)	Blanc pur	#ffffff
Yeux du robot	Bleu foncé / Indigo	#001b4e
Arrière-plan	Blanc	#ffffff
    */

    _button_color = ClassColor.ORANGE_DARK;
    _button_text_color = ClassColor.WHITE;
    _button_close_closed = "green";
    _background_image_bot_closed = "transparent";

    _border_color = "red";
    _background_top_color = ClassColor.BLUE_ROYAL;
    _text_top_color = ClassColor.WHITE;
    _button_close_opened = ClassColor.WHITE;

    _background_message_list = ClassColor.BEIGE_LIGHT;
    _border_bubble_color_system = ClassColor.TRANSPARENT;
    _background_bubble_color_system = ClassColor.GOLD;
    _text_bubble_color_system = ClassColor.WHITE;
    _border_bubble_color_user = ClassColor.TRANSPARENT;
    _background_bubble_color_user = ClassColor.BLUE_ROYAL;
    _text_bubble_color_user = ClassColor.WHITE;

    _background_bottom_color = "green";
    _text_bottom_color = "red";
    _background_image_bot_opened = "transparent";

    _background_textfield_color = "cyan";
    _text_textfield_color = "yellow";
    _border_textfield_color = "red";
    _focus_textfield_color = "red";

    _button_send_color = "blue";
    _button_send_disabled_color = "grey";
    _text_policy_color = "cyan";

    _border_top_color = ClassColor.GREY_DARK;
    _border_bottom_color = ClassColor.GREY_DARK;

    constructor(props = {}) {
        Object.keys(props).forEach((key) => {
            const privateKey = `_${key}`;
            if (this.hasOwnProperty(privateKey)) {
                this[privateKey] = props[key];
            }
        });
    }

    // 🧠 GETTERS / SETTERS



    get button_color() { return this._button_color; }
    set button_color(v) { this._validate(v, "_button_color"); }

    get button_text_color() { return this._button_text_color; }
    set button_text_color(v) { this._validate(v, "_button_text_color"); }

    get button_close_closed() { return this._button_close_closed; }
    set button_close_closed(v) { this._validate(v, "_button_close_closed"); }

    get background_image_bot_closed() { return this._background_image_bot_closed; }
    set background_image_bot_closed(v) { this._validate(v, "_background_image_bot_closed"); }

    get border_color() { return this._border_color; }
    set border_color(v) { this._validate(v, "_border_color"); }

    get border_top_color() { return this._border_top_color; }
    set border_top_color(v) { this._validate(v, "_border_top_color"); }
    get background_top_color() { return this._background_top_color; }
    set background_top_color(v) { this._validate(v, "_background_top_color"); }

    get text_top_color() { return this._text_top_color; }
    set text_top_color(v) { this._validate(v, "_text_top_color"); }

    get button_close_opened() { return this._button_close_opened; }
    set button_close_opened(v) { this._validate(v, "_button_close_opened"); }

    get background_message_list() { return this._background_message_list; }
    set background_message_list(v) { this._validate(v, "_background_message_list"); }

    get background_bubble_color_system() { return this._background_bubble_color_system; }
    set background_bubble_color_system(v) { this._validate(v, "_background_bubble_color_system"); }

    get border_bubble_color_system() { return this._border_bubble_color_system; }
    set border_bubble_color_system(v) { this._validate(v, "_border_bubble_color_system"); }

    get text_bubble_color_system() { return this._text_bubble_color_system; }
    set text_bubble_color_system(v) { this._validate(v, "_text_bubble_color_system"); }

    get border_bubble_color_user() { return this._border_bubble_color_user; }
    set border_bubble_color_user(v) { this._validate(v, "_border_bubble_color_user"); }

    get background_bubble_color_user() { return this._background_bubble_color_user; }
    set background_bubble_color_user(v) { this._validate(v, "_background_bubble_color_user"); }

    get text_bubble_color_user() { return this._text_bubble_color_user; }
    set text_bubble_color_user(v) { this._validate(v, "_text_bubble_color_user"); }

    get border_bottom_color() { return this._border_bottom_color; }
    set border_bottom_color(v) { this._validate(v, "_border_bottom_color"); }

    get background_bottom_color() { return this._background_bottom_color; }
    set background_bottom_color(v) { this._validate(v, "_background_bottom_color"); }

    get text_bottom_color() { return this._text_bottom_color; }
    set text_bottom_color(v) { this._validate(v, "_text_bottom_color"); }

    get background_image_bot_opened() { return this._background_image_bot_opened; }
    set background_image_bot_opened(v) { this._validate(v, "_background_image_bot_opened"); }

    get background_textfield_color() { return this._background_textfield_color; }
    set background_textfield_color(v) { this._validate(v, "_background_textfield_color"); }

    get text_textfield_color() { return this._text_textfield_color; }
    set text_textfield_color(v) { this._validate(v, "_text_textfield_color"); }

    get border_textfield_color() { return this._border_textfield_color; }
    set border_textfield_color(v) { this._validate(v, "_border_textfield_color"); }

    get focus_textfield_color() { return this._focus_textfield_color; }
    set focus_textfield_color(v) { this._validate(v, "_focus_textfield_color"); }

    get button_send_color() { return this._button_send_color; }
    set button_send_color(v) { this._validate(v, "_button_send_color"); }

    get button_send_disabled_color() { return this._button_send_disabled_color; }
    set button_send_disabled_color(v) { this._validate(v, "_button_send_disabled_color"); }

    get text_policy_color() { return this._text_policy_color; }
    set text_policy_color(v) { this._validate(v, "_text_policy_color"); }

    // 🔁 Utilitaires
    update_one(key = "", value = "") {
        if (key !== "" && this.hasOwnProperty(`_${key}`) && value !== undefined) {
            this[`_${key}`] = value;
        }
    }

    update(props = {}) {
        for (const key in props) {
            if (this.hasOwnProperty(`_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }

    clone() {
        return new ClassColor(this.toJSON());
    }

    toJSON() {
        const publicObj = {};
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const cleanedKey = key.startsWith("_") ? key.substring(1) : key;
                publicObj[cleanedKey] = this[key];
            }
        }
        return publicObj;
    }

    _validate(value, key) {
        if (value?.length > 0) {
            this[key] = value;
        } else {
            console.log(`❌ Error: ${key} cannot be empty.`);
        }
    }

    static getPudgyStyle() {
        const button_color = ClassColor.ORANGE_DARK;
        const button_text_color = ClassColor.WHITE;
        const button_close_closed = ClassColor.BLACK;
        const background_image_bot_closed = ClassColor.TRANSPARENT;
        const border_color = ClassColor.TRANSPARENT;
        const border_top_color = ClassColor.TRANSPARENT;
        const background_top_color = ClassColor.BLUE_ROYAL;
        const text_top_color = ClassColor.WHITE;
        const button_close_opened = ClassColor.WHITE;
        const background_message_list = ClassColor.BEIGE_LIGHT;
        const border_bubble_color_system = ClassColor.TRANSPARENT;
        const border_bubble_color_user = ClassColor.TRANSPARENT;
        const background_bubble_color_system = ClassColor.ORANGE_DARK;
        const text_bubble_color_system = ClassColor.WHITE;
        const background_bubble_color_user = ClassColor.BLUE_ROYAL;
        const text_bubble_color_user = ClassColor.WHITE;
        const border_bottom_color = ClassColor.GREY_LIGHT;
        const background_bottom_color = ClassColor.BEIGE_LIGHT;
        const text_bottom_color = ClassColor.BLUE_DARK;
        const background_image_bot_opened = "red";
        const background_textfield_color = "transparent";
        const text_textfield_color = ClassColor.BLUE_DARK;
        const border_textfield_color = ClassColor.GREY_LIGHT;
        const focus_textfield_color = ClassColor.BLUE_ROYAL;
        const button_send_color = ClassColor.BLUE_ROYAL;
        const button_send_disabled_color = ClassColor.GREY_LIGHT;
        const text_policy_color = ClassColor.BLUE_ROYAL;
        return new ClassColor({
            border_bubble_color_system,
            border_bubble_color_user,
            button_color,
            button_text_color,
            button_close_closed,
            border_color,
            border_top_color,
            background_top_color,
            text_top_color,
            button_close_opened,
            background_message_list,
            background_bubble_color_system,
            text_bubble_color_system,
            background_bubble_color_user,
            text_bubble_color_user,
            border_bottom_color,
            background_bottom_color,
            text_bottom_color,
            background_textfield_color,
            text_textfield_color,
            border_textfield_color,
            focus_textfield_color,
            button_send_color,
            button_send_disabled_color,
            text_policy_color,
            background_image_bot_closed,
            background_image_bot_opened

        });
    }
    static getPudgyWhiteStyle() {
        const button_color = ClassColor.BLUE_ROYAL;
        const button_text_color = ClassColor.WHITE;
        const button_close_closed = ClassColor.BLACK;
        const background_image_bot_closed = ClassColor.TRANSPARENT;
        const border_color = ClassColor.GREY_LIGHT;
        const border_top_color = ClassColor.TRANSPARENT;
        const background_top_color = ClassColor.BLUE_ROYAL;
        const text_top_color = ClassColor.WHITE;
        const button_close_opened = ClassColor.WHITE;
        const background_message_list = ClassColor.WHITE;
        const border_bubble_color_system = ClassColor.TRANSPARENT;
        const border_bubble_color_user = ClassColor.TRANSPARENT;
        const background_bubble_color_system = ClassColor.ORANGE_DARK;
        const text_bubble_color_system = ClassColor.WHITE;
        const background_bubble_color_user = ClassColor.BLUE_ROYAL;
        const text_bubble_color_user = ClassColor.WHITE;
        const border_bottom_color = ClassColor.GREY_LIGHT;
        const background_bottom_color = ClassColor.WHITE;
        const text_bottom_color = ClassColor.BLUE_DARK;
        const background_image_bot_opened = "red";
        const background_textfield_color = "transparent";
        const text_textfield_color = ClassColor.BLUE_DARK;
        const border_textfield_color = ClassColor.GREY_LIGHT;
        const focus_textfield_color = ClassColor.BLUE_ROYAL;
        const button_send_color = ClassColor.BLUE_ROYAL;
        const button_send_disabled_color = ClassColor.GREY_LIGHT;
        const text_policy_color = ClassColor.BLUE_ROYAL;
        return new ClassColor({
            border_bubble_color_system,
            border_bubble_color_user,
            border_top_color,
            button_color,
            button_text_color,
            button_close_closed,
            border_color,
            background_top_color,
            text_top_color,
            button_close_opened,
            background_message_list,
            background_bubble_color_system,
            text_bubble_color_system,
            background_bubble_color_user,
            text_bubble_color_user,
            border_bottom_color,
            background_bottom_color,
            text_bottom_color,
            background_textfield_color,
            text_textfield_color,
            border_textfield_color,
            focus_textfield_color,
            button_send_color,
            button_send_disabled_color,
            text_policy_color,
            background_image_bot_closed,
            background_image_bot_opened

        });
    }
    static getPudgyBlackStyle() {
        const border_bubble_color_system = ClassColor.TRANSPARENT;
        const border_bubble_color_user = ClassColor.TRANSPARENT;
        const button_color = ClassColor.BLACK;
        const button_text_color = ClassColor.WHITE;
        const button_close_closed = ClassColor.BLACK;
        const border_top_color = ClassColor.TRANSPARENT;
        const background_image_bot_closed = ClassColor.TRANSPARENT;
        const border_color = ClassColor.GREY_LIGHT;
        const background_top_color = ClassColor.BLUE_ROYAL;
        const text_top_color = ClassColor.WHITE;
        const button_close_opened = ClassColor.WHITE;
        const background_message_list = ClassColor.BLACK;
        const background_bubble_color_system = ClassColor.ORANGE_DARK;
        const text_bubble_color_system = ClassColor.WHITE;
        const background_bubble_color_user = ClassColor.BLUE_ROYAL;
        const text_bubble_color_user = ClassColor.WHITE;
        const border_bottom_color = ClassColor.GREY_LIGHT;
        const background_bottom_color = ClassColor.BLACK;
        const text_bottom_color = ClassColor.WHITE;
        const background_image_bot_opened = "red";
        const background_textfield_color = "transparent";
        const text_textfield_color = ClassColor.WHITE;
        const border_textfield_color = ClassColor.GREY_LIGHT;
        const focus_textfield_color = ClassColor.BLUE_ROYAL;
        const button_send_color = ClassColor.BLUE_ROYAL;
        const button_send_disabled_color = ClassColor.GREY_LIGHT;
        const text_policy_color = ClassColor.BLUE_ROYAL;
        return new ClassColor({
            border_bubble_color_system,
            border_bubble_color_user,
            border_top_color,
            button_color,
            button_text_color,
            button_close_closed,
            border_color,
            background_top_color,
            text_top_color,
            button_close_opened,
            background_message_list,
            background_bubble_color_system,
            text_bubble_color_system,
            background_bubble_color_user,
            text_bubble_color_user,
            border_bottom_color,
            background_bottom_color,
            text_bottom_color,
            background_textfield_color,
            text_textfield_color,
            border_textfield_color,
            focus_textfield_color,
            button_send_color,
            button_send_disabled_color,
            text_policy_color,
            background_image_bot_closed,
            background_image_bot_opened

        });
    }
    static getPudgyBlueLightStyle() {
        const border_bubble_color_system = ClassColor.TRANSPARENT;
        const border_bubble_color_user = ClassColor.TRANSPARENT;
        const button_color = ClassColor.BLUE_ROYAL;
        const button_text_color = ClassColor.WHITE;
        const button_close_closed = ClassColor.BLACK;
        const background_image_bot_closed = ClassColor.TRANSPARENT;
        const border_color = ClassColor.TRANSPARENT;
        const border_top_color = ClassColor.TRANSPARENT;
        const background_top_color = ClassColor.BLUE_ROYAL;
        const text_top_color = ClassColor.WHITE;
        const button_close_opened = ClassColor.WHITE;
        const background_message_list = ClassColor.BLUE_HYPER_LIGHT;
        const background_bubble_color_system = ClassColor.ORANGE_DARK;
        const text_bubble_color_system = ClassColor.WHITE;
        const background_bubble_color_user = ClassColor.BLUE_ROYAL;
        const text_bubble_color_user = ClassColor.WHITE;
        const border_bottom_color = ClassColor.GREY_LIGHT;
        const background_bottom_color = ClassColor.BLUE_HYPER_LIGHT;
        const text_bottom_color = ClassColor.BLUE_DARK;
        const background_image_bot_opened = "red";
        const background_textfield_color = "transparent";
        const text_textfield_color = ClassColor.BLUE_DARK;
        const border_textfield_color = ClassColor.GREY_LIGHT;
        const focus_textfield_color = ClassColor.BLUE_ROYAL;
        const button_send_color = ClassColor.BLUE_ROYAL;
        const button_send_disabled_color = ClassColor.GREY_LIGHT;
        const text_policy_color = ClassColor.BLUE_ROYAL;
        return new ClassColor({
            border_bubble_color_system,
            border_bubble_color_user,
            button_color,
            button_text_color,
            button_close_closed,
            border_color,
            border_top_color,
            background_top_color,
            text_top_color,
            button_close_opened,
            background_message_list,
            background_bubble_color_system,
            text_bubble_color_system,
            background_bubble_color_user,
            text_bubble_color_user,
            border_bottom_color,
            background_bottom_color,
            text_bottom_color,
            background_textfield_color,
            text_textfield_color,
            border_textfield_color,
            focus_textfield_color,
            button_send_color,
            button_send_disabled_color,
            text_policy_color,
            background_image_bot_closed,
            background_image_bot_opened

        });
    }
    static getPudgyGreyLightStyle() {
        const border_bubble_color_system = ClassColor.TRANSPARENT;
        const border_bubble_color_user = ClassColor.TRANSPARENT;
        const button_color = ClassColor.BLACK;
        const button_text_color = ClassColor.WHITE;
        const button_close_closed = ClassColor.BLACK;
        const background_image_bot_closed = ClassColor.TRANSPARENT;
        const border_color = ClassColor.TRANSPARENT;
        const border_top_color = ClassColor.TRANSPARENT;
        const background_top_color = ClassColor.BLUE_ROYAL;
        const text_top_color = ClassColor.WHITE;
        const button_close_opened = ClassColor.WHITE;
        const background_message_list = ClassColor.GREY_HYPER_LIGHT;
        const background_bubble_color_system = ClassColor.ORANGE_DARK;
        const text_bubble_color_system = ClassColor.WHITE;
        const background_bubble_color_user = ClassColor.BLUE_ROYAL;
        const text_bubble_color_user = ClassColor.WHITE;
        const border_bottom_color = ClassColor.GREY_LIGHT;
        const background_bottom_color = ClassColor.GREY_HYPER_LIGHT;
        const text_bottom_color = ClassColor.BLUE_DARK;
        const background_image_bot_opened = "red";
        const background_textfield_color = "transparent";
        const text_textfield_color = ClassColor.BLUE_DARK;
        const border_textfield_color = ClassColor.GREY_LIGHT;
        const focus_textfield_color = ClassColor.BLUE_ROYAL;
        const button_send_color = ClassColor.BLUE_ROYAL;
        const button_send_disabled_color = ClassColor.GREY_LIGHT;
        const text_policy_color = ClassColor.BLUE_ROYAL;
        return new ClassColor({
            border_bubble_color_system,
            border_bubble_color_user,
            button_color,
            button_text_color,
            button_close_closed,
            border_color,
            border_top_color,
            background_top_color,
            text_top_color,
            button_close_opened,
            background_message_list,
            background_bubble_color_system,
            text_bubble_color_system,
            background_bubble_color_user,
            text_bubble_color_user,
            border_bottom_color,
            background_bottom_color,
            text_bottom_color,
            background_textfield_color,
            text_textfield_color,
            border_textfield_color,
            focus_textfield_color,
            button_send_color,
            button_send_disabled_color,
            text_policy_color,
            background_image_bot_closed,
            background_image_bot_opened

        });
    }
    static getPudgyBlackClassicStyle() {
        const button_color = ClassColor.BLACK;
        const button_text_color = ClassColor.GOLD;
        const button_close_closed = ClassColor.BLACK;
        const background_image_bot_closed = ClassColor.TRANSPARENT;
        const border_color = ClassColor.GOLD;
        const border_top_color = ClassColor.GOLD;
        const background_top_color = ClassColor.BLACK;
        const text_top_color = ClassColor.WHITE;
        const button_close_opened = ClassColor.WHITE;
        const background_message_list = ClassColor.WHITE;
        const border_bubble_color_system = ClassColor.TRANSPARENT;
        const border_bubble_color_user = ClassColor.TRANSPARENT;
        const background_bubble_color_system = ClassColor.GOLD;
        const text_bubble_color_system = ClassColor.BLACK;
        const background_bubble_color_user = ClassColor.BLACK;
        const text_bubble_color_user = ClassColor.WHITE;
        const border_bottom_color = ClassColor.GOLD;
        const background_bottom_color = ClassColor.BLACK;
        const text_bottom_color = ClassColor.WHITE;
        const background_image_bot_opened = "red";
        const background_textfield_color = ClassColor.TRANSPARENT;
        const text_textfield_color = ClassColor.WHITE;
        const border_textfield_color = ClassColor.GREY_LIGHT;
        const focus_textfield_color = ClassColor.GOLD;
        const button_send_color = ClassColor.GOLD;
        const button_send_disabled_color = ClassColor.GREY_LIGHT;
        const text_policy_color = ClassColor.GOLD;
        return new ClassColor({
            border_bubble_color_system,
            border_bubble_color_user,
            button_color,
            button_text_color,
            button_close_closed,
            border_color,
            border_top_color,
            background_top_color,
            text_top_color,
            button_close_opened,
            background_message_list,
            background_bubble_color_system,
            text_bubble_color_system,
            background_bubble_color_user,
            text_bubble_color_user,
            border_bottom_color,
            background_bottom_color,
            text_bottom_color,
            background_textfield_color,
            text_textfield_color,
            border_textfield_color,
            focus_textfield_color,
            button_send_color,
            button_send_disabled_color,
            text_policy_color,
            background_image_bot_closed,
            background_image_bot_opened

        });
    }
}
