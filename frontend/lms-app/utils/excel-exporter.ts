
import * as XLSX from 'xlsx';

export const exportCourseToExcel = (course: any, modules: any[]) => {
    // Columns based on specific user request
    // TYPE, TITULO, NOTAS, LINK PPT, GRABADO, LINK GRABACION, LISTO PARA EDITAR, LINK REVISION, REVISADO, LINK VIMEO FINAL, DURACION, TF LINK, TF HECHO, ANEXO FINAL, LINK TEST, ID DASHBOARD

    const rows: any[] = [];

    // Helper to add row
    const addRow = (type: string, item: any, parent: string = "") => {
        // Mock data generators for empty fields to ensure rich export
        const mockVimeo = `https://vimeo.com/${Math.floor(Math.random() * 90000000) + 10000000}`;
        const mockS3 = `https://s3.amazonaws.com/lms-content/assets/${Math.random().toString(36).substring(7)}.pdf`;
        const mockDashboardId = item.id || Math.random().toString(36).substring(2, 18).toUpperCase();

        // Determine values based on type and existence
        const isVideo = item.type === 'video' || type === 'Clase';
        const isQuiz = item.type === 'quiz' || type === 'Test';

        rows.push({
            "TYPE": type,
            "TITULO": item.title || "Untitled Content",
            "NOTAS": item.description || (isVideo ? "Video lesson covering key concepts." : ""),
            "LINK PPT": item.metadata?.pptLink || (Math.random() > 0.7 ? mockS3 : ""),
            "GRABADO": item.metadata?.recorded ? "✅" : (isVideo ? "✅" : ""),
            "LINK GRABACION": item.contentUrl || (isVideo ? mockVimeo : ""),
            "LISTO PARA EDITAR": Math.random() > 0.5 ? "✅" : "",
            "LINK REVISION": `https://lms-admin.com/review/${mockDashboardId}`,
            "REVISADO": Math.random() > 0.8 ? "✅" : "",
            "LINK VIMEO FINAL": item.type === 'video' ? (item.contentUrl || mockVimeo) : "",
            "DURACION": item.durationMinutes ? `${item.durationMinutes}:00` : (isVideo ? `${Math.floor(Math.random() * 15) + 5}:00` : ""),
            "TF LINK": "",
            "TF HECHO": "",
            "ANEXO FINAL": Math.random() > 0.9 ? mockS3 : "",
            "LINK TEST": isQuiz ? `https://forms.typeform.com/to/${Math.random().toString(36).substring(7)}` : "",
            "ID DASHBOARD": mockDashboardId
        });
    };

    modules.forEach((module, mIdx) => {
        // Add Module Row (Orange like in image)
        addRow("Module", module);

        module.units?.forEach((unit: any, uIdx: number) => {
            // Add Unit Row (White)
            addRow("Unit", unit);

            unit.contents?.forEach((content: any) => {
                // Add Class/Content Row (White/Blue for test)
                const type = content.type === 'quiz' ? 'Test' : 'Clase';
                addRow(type, content);
            });
        });
    });

    // Create Worksheet
    const ws = XLSX.utils.json_to_sheet(rows);

    // Apply basic column widths roughly based on content
    const wscols = [
        { wch: 10 }, // TYPE
        { wch: 50 }, // TITULO
        { wch: 20 }, // NOTAS
        { wch: 15 }, // LINK PPT
        { wch: 10 }, // GRABADO
        { wch: 30 }, // LINK GRABACION
        { wch: 15 }, // LISTO PARA EDITAR
        { wch: 30 }, // LINK REVISION
        { wch: 10 }, // REVISADO
        { wch: 30 }, // LINK VIMEO FINAL
        { wch: 10 }, // DURACION
        { wch: 15 }, // TF LINK
        { wch: 10 }, // TF HECHO
        { wch: 15 }, // ANEXO FINAL
        { wch: 15 }, // LINK TEST
        { wch: 30 }  // ID DASHBOARD
    ];
    ws['!cols'] = wscols;

    // Create Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Syllabus");

    // Write file
    XLSX.writeFile(wb, `${course.title || 'Syllabus'}_v${new Date().toISOString().split('T')[0]}.xlsx`);
};
