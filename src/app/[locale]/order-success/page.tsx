import Link from "@/components/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import getTrans from "@/lib/translation";
import { Locale } from "@/i18n.config";


type OrderSuccessPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    orderId?: string;
  }>;
};

const OrderSuccessPage = async ({ params, searchParams }: OrderSuccessPageProps) => {
  const { locale } = await params;
  const t = await getTrans(locale);
  const { orderId } = await searchParams;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-green-100">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {t.orderSuccess.title}
            </h1>
            <p className="text-gray-600 mb-4">
              {t.orderSuccess.description}
            </p>
            
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">{t.orderSuccess.orderId}</p>
                <p className="font-mono text-lg font-bold text-gray-800">
                  #{orderId.slice(-8)}
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">{t.orderSuccess.whatsNextTitle}</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {t.orderSuccess.steps.startPreparing}</li>
                <li>• {t.orderSuccess.steps.emailSoon}</li>
                <li>• {t.orderSuccess.steps.eta}</li>
                <li>• {t.orderSuccess.steps.contactOnWay}</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                {t.orderSuccess.backToHome}
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full py-3">
              <Link href="/menu">
                <ShoppingBag className="w-4 h-4 mr-2" />
                {t.orderSuccess.orderMore}
              </Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t.orderSuccess.questions}
              <Link href="/contact" className="text-green-600 hover:text-green-700 ml-1">
                {t.orderSuccess.contactUs}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessPage;
