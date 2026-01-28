import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { IconCamera } from "@/assets/icons/IconsComponent";
import FieldComponent from "@/components/elements/FieldComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { getFormattedDateCompleteNumeric } from "@/contexts/functions";
import { languages, NS_COMMON, NS_PROFILE, NS_LANGS, NS_ROLES, NS_BUTTONS } from "@/contexts/i18n/settings";
import { useLanguage } from "@/contexts/LangProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Box, Chip, Stack, Typography } from "@mui/material";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ClassUser, ClassUserTeacher } from "@/classes/users/ClassUser";
import FieldTextComponent from "@/components/elements/FieldTextComponent";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ClassColor } from "@/classes/ClassColor";
import { ClassFile } from "@/classes/ClassFile";

function ProfilePage() {
  const { lang } = useLanguage();
  const { user, update, processing } = useAuth();
  const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_ROLES, NS_PROFILE, NS_BUTTONS]);
  const translateLabels = t('form', { ns: NS_PROFILE, returnObjects: true })
  const { theme } = useThemeMode();

  const [userEdit, setUserEdit] = useState(user);
  const [errors, setErrors] = useState({});
  const [processingTeacher, setProcessingTeacher] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [photoFiles, setPhotoFiles] = useState([]);
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    setUserEdit(user.clone());
  }, [user]);

  // Vérifier si les champs Teacher ont changé
  const hasTeacherChanges = useMemo(() => {
    if (!(user instanceof ClassUserTeacher) || !userEdit) return false;
    return (
      (userEdit.role_title || '') !== (user.role_title || '') ||
      (userEdit.bio || '') !== (user.bio || '') ||
      JSON.stringify(userEdit.langs || []) !== JSON.stringify(user.langs || []) ||
      JSON.stringify(userEdit.tags || []) !== JSON.stringify(user.tags || [])
    );
  }, [user, userEdit]);

  // Fonction pour réinitialiser les données Teacher
  const handleResetTeacher = () => {
    if (!(user instanceof ClassUserTeacher)) return;
    setUserEdit(user.clone());
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.role_title;
      delete newErrors.bio;
      delete newErrors.langs;
      delete newErrors.tags;
      return newErrors;
    });
  };

  // Fonction pour sauvegarder les données Teacher via updateFirestore
  const handleSaveTeacher = async () => {
    if (!(userEdit instanceof ClassUserTeacher) || processingTeacher) return;
    
    setProcessingTeacher(true);
    try {
      const updatedUser = await userEdit.updateFirestore();
      if (updatedUser) {
        // Mettre à jour l'utilisateur dans le contexte Auth
        await update(updatedUser);
        console.log("Profil teacher sauvegardé :", updatedUser);
      } else {
        setErrors(prev => ({
          ...prev,
          main: "Une erreur est survenue lors de la sauvegarde."
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      setErrors(prev => ({
        ...prev,
        main: "Une erreur est survenue lors de la sauvegarde."
      }));
    } finally {
      setProcessingTeacher(false);
    }
  };

  // Fonction pour ajouter un tag
  const handleAddTag = () => {
    const tagValue = newTag.trim();
    if (!tagValue) return;
    
    const currentTags = userEdit?.tags || [];
    if (currentTags.includes(tagValue)) {
      setErrors(prev => ({
        ...prev,
        tag: "Ce tag existe déjà"
      }));
      return;
    }
    
    const newTags = [...currentTags, tagValue];
    setUserEdit(prev => {
      if (!prev || prev === null) return prev;
      prev.update({ tags: newTags });
      return prev.clone();
    });
    setNewTag('');
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.tag;
      return newErrors;
    });
  };

  // Fonction pour supprimer un tag
  const handleRemoveTag = (index) => {
    const currentTags = userEdit?.tags || [];
    const newTags = currentTags.filter((_, i) => i !== index);
    setUserEdit(prev => {
      if (!prev || prev === null) return prev;
      prev.update({ tags: newTags });
      return prev.clone();
    });
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setUserEdit(prev => {
      if (!prev || prev === null) {
        return prev;
      }
      let newValue = value;
      if (type === "checkbox") {
        newValue = checked;
      } else if (type === 'date') {
        newValue = new Date(value) || null;
      } else if (type === 'select-multiple') {
        // Si c'est déjà un tableau (passé depuis le select), on l'utilise directement
        // Sinon, on extrait depuis selectedOptions (cas normal)
        if (Array.isArray(value)) {
          newValue = value;
        } else {
          const selectedOptions = Array.from(e.target.selectedOptions || [], option => option.value);
          newValue = selectedOptions;
        }
      } else {
        // Pour tous les autres types (text, multiline, etc.), on prend directement la value
        newValue = value;
      }
      prev.update({ [name]: newValue });
      return prev.clone();
    });
  };
  const handleClear = (name) => {
    setErrors(prev => ({ ...prev, [name]: '' }));
    setUserEdit(prev => {
      if (!prev || prev === null) {
        return prev;
      }
      prev.update({ [name]: '' });
      return prev.clone();
    });
  };
  const handleSave = async (e) => {
    await update(userEdit);
    console.log("Profil sauvegardé :", userEdit);
  };

  // Fonction pour déclencher le sélecteur de fichier
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Fonction pour gérer le changement de fichier
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setPhotoFiles(selectedFiles);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.photo;
        return newErrors;
      });
    }
    // Réinitialiser l'input pour permettre de sélectionner le même fichier à nouveau
    e.target.value = '';
  };

  // Fonction pour sauvegarder la photo de profil
  const handleSavePhoto = async () => {
    if (!photoFiles.length || processingPhoto) return;
    
    setProcessingPhoto(true);
    try {
      const file = photoFiles[0];
      const _path = `${ClassUser.COLLECTION}/${user.uid}/profile-photo`;
      
      const resultFile = await ClassFile.uploadFileToFirebase({
        file: file,
        path: _path,
      });
      
      const newFile = new ClassFile({
        id: "",
        uri: resultFile?.uri || "",
        path: resultFile?.path,
        name: resultFile?.name,
        type: resultFile?.type,
        size: resultFile?.size,
        tag: `profile`,
      }).toJSON();
      
      const urlPhoto = newFile?.uri || "";
      
      // Mettre à jour userEdit avec la nouvelle photo
      const updatedUserEdit = userEdit.clone();
      updatedUserEdit.update({ photo_url: urlPhoto });
      
      // Sauvegarder dans Firestore via updateFirestore
      const updatedUser = await updatedUserEdit.updateFirestore();
      if (updatedUser) {
        await update(updatedUser);
        setUserEdit(updatedUser.clone());
        setPhotoFiles([]);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.photo;
          return newErrors;
        });
        console.log("Photo de profil sauvegardée :", updatedUser);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo :", error);
      setErrors(prev => ({
        ...prev,
        photo: "Une erreur est survenue lors de l'upload de la photo."
      }));
    } finally {
      setProcessingPhoto(false);
    }
  };
  return (
    <div>
      <main>
        <header className="header">
          <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
            {/* Avatar cliquable avec icône camera */}
            <Box 
              sx={{ 
                position: 'relative',
                cursor: 'pointer',
                '&:hover .camera-overlay': {
                  opacity: 1,
                }
              }}
              onClick={handleAvatarClick}
            >
              {photoFiles.length > 0 ? (
                ClassUser.createAvatarPhoto({ 
                  photo_url: URL.createObjectURL(photoFiles[0]), 
                  first_name: userEdit?.first_name, 
                  last_name: userEdit?.last_name, 
                  size: 60, 
                  fontSize: '18px' 
                })
              ) : (
                user?.showAvatar({ size: 60, fontSize: '18px' })
              )}
              {/* Overlay avec icône camera */}
              <Box
                className="camera-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none',
                }}
              >
                <IconCamera width={24} height={24} color="white" />
              </Box>
            </Box>
            <div style={{ flex: 1 }}>
              <h1>
                {user?.first_name} {user?.last_name.toUpperCase()}
              </h1>
              <p className="muted">
                @{user?.display_name} • {t(user?.role, { ns: NS_ROLES })} • {user?.type}
              </p>
            </div>
          </Stack>
          <div className="header-actions">
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              {/* Boutons pour sauvegarder ou annuler la photo si une photo est sélectionnée */}
              {photoFiles.length > 0 && (
                <>
                  <ButtonCancel
                    label={t('cancel', { ns: NS_BUTTONS, defaultValue: 'Annuler' })}
                    onClick={() => setPhotoFiles([])}
                    disabled={processingPhoto}
                  />
                  <ButtonConfirm
                    label={t('save-photo', { ns: NS_BUTTONS, defaultValue: 'Enregistrer la photo' })}
                    onClick={handleSavePhoto}
                    loading={processingPhoto}
                    disabled={processingPhoto}
                  />
                </>
              )}
              {/* Boutons pour les modifications du profil */}
              {user && userEdit && !user.same(userEdit) && (
                <>
                  <ButtonCancel
                    label="Annuler"
                    onClick={() => setUserEdit(user.clone())}
                    disabled={processing}
                  />
                  <ButtonConfirm
                    label="Modifier mon profil"
                    onClick={handleSave}
                    loading={processing}
                  />
                </>
              )}
            </Stack>
          </div>
        </header>

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value).join(',')}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {/* Message d'erreur pour la photo */}
        {errors.photo && (
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="caption" sx={{ color: 'error.main' }}>
              {errors.photo}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSave} className="grid">
          {/* Infos personnelles */}
          <section className="card">
            <h2>{translateLabels.title_perso}</h2>
            <div className="field">
              <FieldComponent
                label={t('first_name')}
                name={'first_name'}
                type="text"
                value={userEdit?.first_name}
                onChange={handleChange}
                disabled={true}
                onClear={() => handleClear('first_name')}
                error={errors.first_name}
                fullWidth
              />
            </div>
            <div className="field">
              <FieldComponent
                label={t('last_name')}
                name={'last_name'}
                type="text"
                value={userEdit?.last_name}
                onChange={handleChange}
                disabled={true}
                onClear={() => handleClear('last_name')}
                error={errors.last_name}
                fullWidth
              />
            </div>
            <div className="field">
              <FieldComponent
                label={t('display_name')}
                name={'display_name'}
                type="text"
                value={userEdit?.display_name}
                onChange={handleChange}
                disabled={true}
                fullWidth
                //onClear={()=>handleClear('first_name')}
                error={errors.display_name}
              />
            </div>
            <div className="field">
              <FieldComponent
                label={t('email_academy')}
                name={'email_academy'}
                type="email"
                value={userEdit?.email_academy}
                onChange={handleChange}
                disabled={true}
                //onClear={()=>handleClear('first_name')}
                error={errors.email_academy}
                fullWidth
              />
            </div>
            <div className="field">
              <FieldComponent
                label={t('birthday')}
                name={'birthday'}
                type="date"
                value={userEdit?.birthday}
                onChange={handleChange}
                disabled={true}
                //onClear={()=>handleClear('first_name')}
                error={errors.birthday}
                fullWidth
              />
            </div>
          </section>

          {/* Infos système / compte */}
          <section className="card">
            <h2>{translateLabels.title_account}</h2>
            <div className="field">
              <FieldComponent
                label={t('uid')}
                name={'uid'}
                type="text"
                value={userEdit?.uid}
                onChange={handleChange}
                disabled={true}
                //onClear={()=>handleClear('first_name')}
                error={errors.uid}
                fullWidth
              />
            </div>
            <div className="field">
              <SelectComponentDark
                label={t('role')}
                name={'role'}
                value={userEdit?.role}
                values={ClassUser.ALL_ROLES.map(role => ({ id: role, value: t(role, { ns: NS_ROLES }) }))}
                onChange={handleChange}
                disabled={true}
                //onClear={()=>handleClear('first_name')}
                error={errors.role}
              />
            </div>
            <div className="field">
              <FieldTextComponent
                label={t('created_time')}
                name={'created_time'}
                type="date"
                value={getFormattedDateCompleteNumeric(userEdit?.created_time, lang)}
                onChange={handleChange}
                disabled={true}
                //onClear={()=>handleClear('first_name')}
                error={errors.created_time}
              />
            </div>
            <div className="field">
              <FieldTextComponent
                label={t('last_edit_time')}
                name={'last_edit_time'}
                type="date"
                value={getFormattedDateCompleteNumeric(userEdit?.last_edit_time, lang)}
                onChange={handleChange}
                disabled={true}
                //onClear={()=>handleClear('first_name')}
                error={errors.last_edit_time}
              />
            </div>
          </section>
        </form>

        {/* Section Teacher - Affichée uniquement si l'utilisateur est un teacher */}
        {user instanceof ClassUserTeacher && (
          <section className="card card-full-width">
            <div className="teacher-section-header">
              <h2>{translateLabels.title_teacher || "Informations enseignant"}</h2>
              {hasTeacherChanges && (
                <Stack spacing={1} direction={'row'} alignItems={'center'}>
                  <ButtonCancel
                    label={t('reset', { ns: NS_BUTTONS })}
                    onClick={handleResetTeacher}
                    disabled={processingTeacher || processing}
                  />
                  <ButtonConfirm
                    label={t('save', { ns: NS_BUTTONS })}
                    onClick={handleSaveTeacher}
                    loading={processingTeacher}
                    disabled={processing}
                  />
                </Stack>
              )}
            </div>
            <div className="field">
              <FieldComponent
                label={t('role_title')}
                name={'role_title'}
                type="text"
                value={userEdit?.role_title || ''}
                onChange={handleChange}
                disabled={false}
                onClear={() => handleClear('role_title')}
                error={errors.role_title}
                fullWidth
              />
            </div>
            <div className="field">
              <FieldComponent
                label={t('bio')}
                name={'bio'}
                type="multiline"
                value={userEdit?.bio || ''}
                onChange={handleChange}
                disabled={false}
                onClear={() => handleClear('bio')}
                error={errors.bio}
                fullWidth
                minRows={3}
                maxRows={6}
              />
            </div>
            <div className="field">
              <Typography variant="body2" sx={{ mb: 1, color: 'var(--grey-light)' }}>
                {t('langs')}
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  border: '1px solid var(--card-border)',
                  background: 'var(--card-color)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                <FormGroup>
                  {languages.map(lang => {
                    const isSelected = (userEdit?.langs || []).includes(lang);
                    return (
                      <FormControlLabel
                        key={lang}
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => {
                              const currentLangs = userEdit?.langs || [];
                              let newLangs;
                              if (e.target.checked) {
                                // Ajouter la langue si elle n'est pas déjà présente
                                newLangs = [...currentLangs, lang];
                              } else {
                                // Retirer la langue
                                newLangs = currentLangs.filter(l => l !== lang);
                              }
                              handleChange({
                                target: {
                                  name: 'langs',
                                  value: newLangs,
                                  type: 'select-multiple'
                                }
                              });
                            }}
                            sx={{
                              color: 'var(--primary)',
                              '&.Mui-checked': {
                                color: 'var(--primary)',
                              },
                            }}
                          />
                        }
                        label={t(lang, { ns: NS_LANGS })}
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            color: 'var(--font-color)',
                            fontSize: '0.9rem',
                          },
                        }}
                      />
                    );
                  })}
                </FormGroup>
              </Box>
              {errors.langs && <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>{errors.langs}</Typography>}
            </div>
            <div className="field">
              <Typography variant="body2" sx={{ mb: 1, color: 'var(--grey-light)' }}>
                {t('tags')}
              </Typography>
              
              {/* Liste des tags existants */}
              {userEdit?.tags && userEdit.tags.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {userEdit.tags.map((tag, index) => (
                    <Chip
                      key={`tag-${index}`}
                      label={tag}
                      size="small"
                      onDelete={() => handleRemoveTag(index)}
                      sx={{
                        bgcolor: 'var(--primary-shadow)',
                        color: 'var(--primary)',
                        border: '1px solid var(--primary)',
                        '& .MuiChip-deleteIcon': {
                          color: 'var(--primary)',
                          '&:hover': {
                            color: 'var(--error)',
                          },
                        },
                      }}
                    />
                  ))}
                </Stack>
              )}

              {/* Champ pour ajouter un nouveau tag */}
              <Stack direction="row" spacing={1} alignItems="center">
                <FieldComponent
                  label=""
                  name="newTag"
                  type="text"
                  value={newTag}
                  onChange={(e) => {
                    setNewTag(e.target.value);
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.tag;
                      return newErrors;
                    });
                  }}
                  disabled={false}
                  onClear={() => setNewTag('')}
                  error={errors.tag}
                  fullWidth
                  placeholder="Ajouter un tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <ButtonConfirm
                  label={t('add', { ns: NS_BUTTONS })}
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || processingTeacher}
                />
              </Stack>
              {errors.tag && (
                <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                  {errors.tag}
                </Typography>
              )}
            </div>
          </section>
        )}
      </main>

      <style jsx>{`
        .page {          
          padding: 0;
          color: var(--font-color);
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          height:100%;
          padding:0px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          padding: 24px;
          background: var(--card-color);
          border-radius: 20px;
          transition: all 0.3s ease-in-out;
        }

        .header h1 {
          margin: 0;
          font-size: 1.75rem;
          line-height: 1.5rem;
          font-weight: 600;
          background: linear-gradient(135deg, var(--font-color) 0%, var(--font-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-actions {
          margin-left: auto;
          display: flex;
          align-items:center;
          gap: 12px;
        }

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.3rem;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          transition: transform 0.2s ease;
        }

        .avatar:hover {
          transform: scale(1.05);
        }

        .muted {
          margin: 4px 0 0 0;
          font-size: 0.9rem;
          color: var(--grey-light);
          line-height: 1.4;
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 20px;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .header {
            align-items: flex-start;
            flex-direction: column;
            padding: 20px;
          }
          .header-actions {
            margin-left: 0;
            width: 100%;
            justify-content: flex-end;
          }
        }

        .card {
          background: var(--card-color);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid var(--card-border);
          transition: all 0.3s ease-in-out;
        }

        .card-full-width {
          width: 100%;
          margin-top: 20px;
        }

        .teacher-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .teacher-section-header h2 {
          margin: 0;
        }

        @media (max-width: 600px) {
          .teacher-section-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .teacher-section-header h2 {
            width: 100%;
          }
        }

        .card h2 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--font-color);
        }

        .card h3 {
          margin-top: 16px;
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          font-size: 0.9rem;
        }

        .field:last-child {
          margin-bottom: 0;
        }

        .field label {
          margin-bottom: 4px;
          color: var(--grey-light);
        }

        .field.inline {
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        input[type="text"],
        input[type="email"],
        input[type="date"],
        select {
          background: var(--card-color);
          border-radius: 12px;
          border: 1px solid var(--card-border);
          padding: 10px 14px;
          color: var(--font-color);
          outline: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        input:focus,
        select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }

        input:disabled,
        select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: rgba(0,0,0,0.02);
        }

        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .btn {
          border-radius: 12px;
          padding: 10px 18px;
          border: 1px solid var(--card-border);
          background: var(--card-color);
          color: var(--font-color);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .btn.primary {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border-color: transparent;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .divider {
          border: none;
          border-top: 1px solid var(--card-border);
          margin: 16px 0;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
export default function ProfileComponent() {
  const { t } = useTranslation([NS_PROFILE, NS_COMMON, NS_LANGS]);
  const form = t('form', { returnObjects: true });
  const { user, isLoading } = useAuth();
  const [userEdit, setUserEdit] = useState(new ClassUser());
  useEffect(() => {
    setUserEdit(user.clone());
  }, [user]);
  return (<Stack sx={{ background: '', width: '100%', }} spacing={{ xs: 2, sm: 3 }}>
    <ProfilePage />
  </Stack>)
}