"use client"
import { InputTypes, Routes } from '@/constants/enums';
import { toast } from '@/hooks/use-toast';
import useFormFields from '@/hooks/useFormFields';
import { Translations } from '@/types/translations';
import { ValidationErrors } from '@/validations/auth';
import { UserRole } from '@prisma/client';
import { CameraIcon } from 'lucide-react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { canChangeUserRole, canEditUserData } from '@/lib/permissions';

import React, { useActionState, useEffect, useState } from 'react'
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import Loader from '../ui/loader';
import FormFields from '../form-fields/form-fields';
import { IFormField } from '@/types/app';
import { updateProfile } from './_actions/profile';

const EditUserForm = ({
    translations,
    user,
}: {
    translations: Translations;
    user: Session["user"];
}) => {
    const session = useSession();
    const formData = new FormData();
    if (user) {
        Object.entries(user).forEach(([key, value]) => {
            if (value !== null && value !== undefined && key !== "image") {
                formData.append(key, value.toString())
            }
        })
    }

    const initialState: {
        message?: string;
        error?: ValidationErrors;
        status?: number | null;
        formData?: FormData | null;
    } = {
        message: "",
        error: {},
        status: null,
        formData,
    }

    const [selectedImage, setSelectedImage] = useState(user?.image ?? "")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isAdmin, setIsAdmin] = useState(user?.role === UserRole.ADMIN);
    const [isSuperAdmin, setIsSuperAdmin] = useState(user?.role === UserRole.SUPER_ADMIN);
    
    // التحقق من الصلاحيات
    const currentUserRole = session.data?.user.role as UserRole;
    const targetUserRole = user?.role as UserRole;
    
    // التحقق من وجود حقول فارغة
    const hasEmptyFields = !user?.phone || !user?.streetAddress || !user?.postalCode || !user?.city || !user?.country;
    
    // التحقق من أن المستخدم يعدل بياناته الشخصية
    const isOwnProfile = session.data?.user?.id === user?.id;
    
    const canEdit = canEditUserData(currentUserRole, targetUserRole, hasEmptyFields, isOwnProfile);
    /* const canChangeRole = */ canChangeUserRole(currentUserRole, targetUserRole, UserRole.ADMIN);

    const [state, action, pending] = useActionState(
        async (prevState: unknown, formData: FormData) => {
            // Add the selected file to formData if it exists
            if (selectedFile) {
                formData.set("image", selectedFile);
                console.log("File added to formData in action:", selectedFile.name, selectedFile.size);
            } else {
                console.log("No file selected in action");
            }
            // تحديد الرتبة الجديدة
            let newRole: UserRole = UserRole.USER;
            if (isSuperAdmin) {
                newRole = UserRole.SUPER_ADMIN;
            } else if (isAdmin) {
                newRole = UserRole.ADMIN;
            }
            
            return updateProfile(newRole, prevState, formData);
        },
        initialState
    );
    const { getFormFields } = useFormFields({
        slug: Routes.PROFILE,
        translations: translations || {},
    });

    useEffect(() => {
        if (state?.message && state?.status && !pending) {
            toast({
                title: state.message,
                className: state.status === 200 ? "text-green-400" : "text-destructive",
            })
        }
    }, [pending, state?.message, state?.status])

    useEffect(() => {
        console.log("User image changed:", user?.image);
        if (user?.image && user.image.trim() !== "") {
            setSelectedImage(user.image as string);
            setSelectedFile(null); // Reset selected file when user data changes
        } else {
            setSelectedImage(""); // Clear image if no user image
        }
    }, [user?.image]);

    // Add safety checks after hooks
    if (!user) {
        return <div>User not found</div>;
    }
    
    if (!translations) {
        return <div>Loading translations...</div>;
    }



    return (
        <form action={action} className='flex flex-col md:flex-row gap-10'>
            <div className="group relative w-[200px] h-[200px] overflow-hidden rounded-full mx-auto">
                {selectedImage && selectedImage.trim() !== "" ? (
                    <>
                        {console.log("Rendering image:", selectedImage)}
                        <Image
                            src={selectedImage}
                            alt={user?.name || "Profile"}
                            width={200}
                            height={200}
                            className="rounded-full object-cover w-full h-full"
                            onError={() => {
                                console.log("Image failed to load, clearing selectedImage");
                                setSelectedImage("");
                            }}
                        />
                        {/* Overlay for hover effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gray-50/40 group-hover:opacity-[1] opacity-0 transition-opacity duration-200">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="image-upload"
                                onChange={(event) => {
                                    const file = event.target.files && event.target.files[0];
                                    console.log("File selected:", file);
                                    if (file) {
                                        console.log("File details:", {
                                            name: file.name,
                                            size: file.size,
                                            type: file.type
                                        });
                                        setSelectedFile(file);
                                        const url = URL.createObjectURL(file);
                                        setSelectedImage(url);
                                    }
                                }}
                                name="image"
                            />
                            <label
                                htmlFor="image-upload"
                                className="border rounded-full w-[200px] h-[200px] element-center cursor-pointer"
                            >
                                <CameraIcon className="!w-8 !h-8 text-accent" />
                            </label>
                        </div>
                    </>
                ) : (
                    /* Default state when no image */
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="image-upload"
                            onChange={(event) => {
                                const file = event.target.files && event.target.files[0];
                                console.log("File selected:", file);
                                if (file) {
                                    console.log("File details:", {
                                        name: file.name,
                                        size: file.size,
                                        type: file.type
                                    });
                                    setSelectedFile(file);
                                    const url = URL.createObjectURL(file);
                                    setSelectedImage(url);
                                }
                            }}
                            name="image"
                        />
                        <label
                            htmlFor="image-upload"
                            className="border rounded-full w-[200px] h-[200px] element-center cursor-pointer"
                        >
                            <CameraIcon className="!w-8 !h-8 text-accent" />
                        </label>
                    </div>
                )}

            </div>
                     <div className="flex-1">
                    {getFormFields()?.map((field: IFormField) => {
                        const fieldValue =
                            state?.formData?.get(field.name) ?? formData.get(field.name);
                        return (
                            <div key={field.name} className="mb-3">
                                <FormFields
                                    {...field}
                                    defaultValue={fieldValue as string}
                                    error={state?.error}
                                    readOnly={field.type === InputTypes.EMAIL}
                                />
                            </div>
                        );
                    }) || []}
                    {/* خيارات الرتب - Super Admin فقط يمكنه تغيير الرتب */}
                    {currentUserRole === UserRole.SUPER_ADMIN && !isOwnProfile && (
                        <div className="space-y-3 my-4 p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-sm font-semibold text-gray-900">{translations.profile.role.changeRole}</h3>
                            
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    name="superAdmin"
                                    checked={isSuperAdmin}
                                    onClick={() => {
                                        setIsSuperAdmin(!isSuperAdmin);
                                        if (!isSuperAdmin) {
                                            setIsAdmin(false);
                                        }
                                    }}
                                />
                                <label htmlFor="superAdmin" className="text-sm font-medium">
                                    {translations.profile.role.superAdmin}
                                </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    name="admin"
                                    checked={isAdmin}
                                    onClick={() => {
                                        setIsAdmin(!isAdmin);
                                        if (!isAdmin) {
                                            setIsSuperAdmin(false);
                                        }
                                    }}
                                />
                                <label htmlFor="admin" className="text-sm font-medium">
                                    {translations.profile.role.admin}
                                </label>
                            </div>
                            
                            {!isAdmin && !isSuperAdmin && (
                                <div className="text-sm text-gray-600">
                                    {translations.profile.role.user}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Admin يمكنه رفع المستخدمين العاديين إلى Admin فقط */}
                    {currentUserRole === UserRole.ADMIN && targetUserRole === UserRole.USER && !isOwnProfile && (
                        <div className="flex items-center gap-2 my-4 p-4 border rounded-lg bg-blue-50">
                            <Checkbox
                                name="admin"
                                checked={isAdmin}
                                onClick={() => setIsAdmin(!isAdmin)}
                            />
                            <label htmlFor="admin" className="text-sm font-medium">
                                {translations.profile.role.promoteToAdmin}
                            </label>
                        </div>
                    )}
                    
                    {/* رسالة تحذيرية إذا لم يكن لديه صلاحية التعديل */}
                    {!canEdit && !isOwnProfile && (
                        <div className="my-4 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                            <p className="text-sm text-yellow-800">
                                ⚠️ {translations.profile.permissions.cannotEdit}
                            </p>
                        </div>
                    )}
                    
                    {/* رسالة تأكيدية إذا كان يعدل بياناته الشخصية */}
                    {isOwnProfile && (
                        <div className="my-4 p-4 border border-green-200 rounded-lg bg-green-50">
                            <p className="text-sm text-green-800">
                                ✅ {translations.profile.permissions.canEditOwn}
                            </p>
                        </div>
                    )}
                    <Button type="submit" className="w-full">
                        {pending ? <Loader /> : translations?.save || "Save"}
                    </Button>
                </div>
        </form>
    )
}

export default EditUserForm