"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugAuth() {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<any>(null);
    const [cohorts, setCohorts] = useState<any>(null);
    const [assignments, setAssignments] = useState<any>(null);

    useEffect(() => {
        const check = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: roleData } = await supabase.from('users').select('role').eq('id', user.id).single();
                setRole(roleData);

                const { data: cData, error: cError } = await supabase.from('cohorts').select('*');
                setCohorts({ data: cData, error: cError });

                const { data: aData, error: aError } = await supabase.from('inspector_assignments').select('*');
                setAssignments({ data: aData, error: aError });
            }
        };
        check();
    }, []);

    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-black text-white text-xs rounded-lg shadow-xl opacity-80 hover:opacity-100 z-50 max-w-md overflow-auto max-h-96">
            <h3 className="font-bold border-b border-gray-700 mb-2 pb-1">Debug Info</h3>
            <p><strong>User ID:</strong> {user?.id || 'Not Mocked/Logged In'}</p>
            <p><strong>DB Role:</strong> {role?.role || 'N/A'}</p>
            <div className="mt-2">
                <strong>Visible Cohorts:</strong>
                <pre>{JSON.stringify(cohorts, null, 2)}</pre>
            </div>
            <div className="mt-2">
                <strong>Assignments:</strong>
                <pre>{JSON.stringify(assignments, null, 2)}</pre>
            </div>
        </div>
    );
}
