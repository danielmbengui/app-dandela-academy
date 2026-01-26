import React, { useRef } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { ClassFile } from "@/classes/ClassFile";
import { ClassColor } from "@/classes/ClassColor";
import { useTranslation } from "react-i18next";
import { NS_BUTTONS } from "@/contexts/i18n/settings";
import ButtonCancel from "../dashboard/elements/ButtonCancel";

export default function ButtonImportFiles({
    files = [], setFiles = () => { },
    multiple = false,
    supported_files = [],
    disabled = false,
    isAdmin = false,
}) {
    const { t } = useTranslation([NS_BUTTONS]);
    const imageRef = useRef(null);
    //const [files, setFiles] = useState([]);
    const handleClickFile = (index) => {
        imageRef.current.click(); // déclenche le clic sur l’input caché
    };
    const handleChangeFile = (e) => {
        const _selectedFiles = Array.from(e.target.files) || [];
        const _all_files = _selectedFiles.length > 0 ? _selectedFiles : null;
        console.log("ALL files", _all_files)
        if (_all_files) {
            setFiles(_all_files);
        } else {
            setFiles([]);
        }
        console.log("change file index", _all_files)
    };
    const handleRemoveFile = (e, index) => {
        const _selectedFiles = [...files].filter((file, i) => i !== index) || [];
        setFiles(_selectedFiles);
        console.log("REMOVE index", index, _selectedFiles)
    };

    return (<Box>
        <input
            ref={imageRef}
            type="file"
            //name="video"
            //accept="video/*"
            required
            multiple={multiple}
            accept={supported_files}
            onChange={handleChangeFile}
            style={{ display: 'none' }}
        />
        <Stack spacing={1} alignItems={'start'}>
            {
                <Stack direction={{ xs: 'row', sm: 'row' }} justifyContent={'start'} alignItems={'center'} sx={{ width: '100%', }} spacing={1}>

                    {
                        (files?.length > 1 || files.length === 0) && <ButtonCancel
                            isAdmin={isAdmin}
                            label={t('choose-photo')}
                            disabled={disabled}
                            icon={<Icon icon="material-symbols:upload" width="20" height="20" />}
                            //disabled={validFiles.length === MAX_FILES_LENGTH || isLoading}
                            // sx={{ color: ClassColor.BLACK, borderColor: ClassColor.BLACK }}
                            size="small" onClick={handleClickFile}
                        //variant={"outlined"} 
                        //color="primary"
                        />
                    }
                    {
                        files?.map((file, index) => {
                            return (<Stack key={`${file.name}-${index}`}>
                                <IconButton
                                    onClick={(e) => handleRemoveFile(e, index)}
                                    sx={{
                                        background: 'rgba(0,0,0,0.75)',
                                        cursor: 'pointer',
                                        color: 'var(--card-color)',
                                    }}
                                >
                                    <Icon icon="mdi:delete-outline" width={12} height={12} />
                                </IconButton>
                            </Stack>)
                        })
                    }
                    {
                        files.length === 1 && files[0] && <Typography>{`${ClassFile.formatFileName(files[0].name)}`}</Typography>
                    }
                </Stack>
            }
        </Stack>
    </Box>);
}