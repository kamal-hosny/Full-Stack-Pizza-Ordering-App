import { db } from "@/lib/prisma";
import { UserRole } from "@/constants/enums";
import Link from "@/components/link";

async function CreateTestUserPage() {
    try {
        // التحقق من وجود مستخدمين
        const userCount = await db.user.count();
        
        if (userCount === 0) {
            // إنشاء مستخدم تجريبي
            const testUser = await db.user.create({
                data: {
                    name: "Test Admin",
                    email: "admin@test.com",
                    password: "hashedpassword", // في الواقع يجب تشفير كلمة المرور
                    role: UserRole.ADMIN,
                    phone: "+1234567890",
                    streetAddress: "123 Test Street",
                    city: "Test City",
                    country: "Test Country",
                    postalCode: "12345"
                }
            });
            
            console.log('Created test user:', testUser);
        }
        
        // إنشاء مستخدم عادي تجريبي
        const regularUser = await db.user.create({
            data: {
                name: "Test User",
                email: "user@test.com",
                password: "hashedpassword",
                role: UserRole.USER,
                phone: "+1234567891",
                streetAddress: "456 User Street",
                city: "User City",
                country: "User Country",
                postalCode: "54321"
            }
        });
        
        console.log('Created regular user:', regularUser);
        
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4 text-green-600">Test Users Created Successfully!</h1>
                <p>Created test users in the database.</p>
                <Link href="/en/admin/users" className="text-blue-600 underline">
                    Go to Users Page
                </Link>
            </div>
        );
    } catch (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Error Creating Test Users</h1>
                <p className="text-red-600">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
        );
    }
}

export default CreateTestUserPage;

