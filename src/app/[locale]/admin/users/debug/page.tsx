import { getUsers } from "@/server/db/users";
import { db } from "@/lib/prisma";

async function DebugUsersPage() {
    try {
        // اختبار الاتصال بقاعدة البيانات
        const userCount = await db.user.count();
        const users = await getUsers();
        
        // اختبار إضافي - جلب المستخدمين مباشرة
        const directUsers = await db.user.findMany();
        
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Debug Users Page</h1>
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">Database Connection Test:</h2>
                        <p>Total users in database: {userCount}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Direct Database Query:</h2>
                        <p>Users from direct query: {directUsers?.length || 0}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">getUsers() Function Test:</h2>
                        <p>Users returned by getUsers(): {users?.length || 0}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Direct Users Data:</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                            {JSON.stringify(directUsers, null, 2)}
                        </pre>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">getUsers() Data:</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                            {JSON.stringify(users, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
                <p className="text-red-600">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
        );
    }
}

export default DebugUsersPage;
