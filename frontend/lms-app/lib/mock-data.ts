export interface Program {
    id: string;
    name: string;
    status: 'In Progress' | 'Completed' | 'Assigned';
    progress: number;
    startDate: string;
    endDate?: string;
    imageColor: string;
    iconColor: string;
}

export interface Client {
    id: string;
    name: string;
    industry: string;
    logoUrl?: string;
    programs: Program[];
}

export const MOCK_CLIENTS: Client[] = [
    {
        id: "client-001",
        name: "Acme Corp",
        industry: "Technology",
        programs: [
            {
                id: "p1",
                name: "ThePowerMBA - Global Business",
                status: "In Progress",
                progress: 45,
                startDate: "2024-01-15",
                imageColor: "bg-blue-100",
                iconColor: "text-blue-600"
            },
            {
                id: "p2",
                name: "Digital Marketing Strategy",
                status: "Assigned",
                progress: 0,
                startDate: "2024-02-10",
                imageColor: "bg-purple-100",
                iconColor: "text-purple-600"
            },
            {
                id: "p3",
                name: "Agile Leadership",
                status: "Completed",
                progress: 100,
                startDate: "2023-11-01",
                endDate: "2023-12-15",
                imageColor: "bg-green-100",
                iconColor: "text-green-600"
            }
        ]
    },
    {
        id: "client-002",
        name: "Stellar Bank",
        industry: "Finance",
        programs: [
            {
                id: "p4",
                name: "Financial Analysis 101",
                status: "In Progress",
                progress: 75,
                startDate: "2024-01-20",
                imageColor: "bg-orange-100",
                iconColor: "text-orange-600"
            }
        ]
    }
];
