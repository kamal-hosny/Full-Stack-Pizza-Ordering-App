"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { createDefaultSuperAdmin } from "../_actions/createDefaultSuperAdmin";
import Loader from "@/components/ui/loader";

export default function CreateDefaultSuperAdminForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDefault = async () => {
    setIsLoading(true);

    try {
      const result = await createDefaultSuperAdmin();
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: "تم إنشاء المدير العام الافتراضي بنجاح",
        });
      } else {
        toast({
          title: "خطأ",
          description: result.message || "حدث خطأ أثناء إنشاء المدير العام",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          إنشاء مدير عام افتراضي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">بيانات المدير العام الافتراضي:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• الاسم: مدير عام</li>
              <li>• البريد الإلكتروني: superadmin@example.com</li>
              <li>• كلمة المرور: superadmin123</li>
              <li>• الرتبة: مدير عام (Super Admin)</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">تحذير:</h4>
            <p className="text-sm text-yellow-800">
              هذا المستخدم مخصص للاختبار والتطوير فقط. تأكد من تغيير كلمة المرور في بيئة الإنتاج.
            </p>
          </div>

          <Button 
            onClick={handleCreateDefault}
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "إنشاء مدير عام افتراضي"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}



