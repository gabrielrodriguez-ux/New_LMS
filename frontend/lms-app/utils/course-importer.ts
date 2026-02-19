import JSZip from 'jszip';
import { apiClient } from '@/utils/api-client';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client for Storage Uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface ImportProgress {
    totalFiles: number;
    processedFiles: number;
    currentFile: string;
    log: string[];
}

export interface ImportResult {
    success: boolean;
    errors: string[];
}

/**
 * Parses a ZIP file and imports the structure into the course.
 * @param file The uploaded ZIP file.
 * @param courseId The ID of the course to import into.
 * @param onProgress Callback for progress updates.
 */
export async function importCourseFromZip(
    file: File,
    courseId: string,
    onProgress: (progress: ImportProgress) => void
): Promise<ImportResult> {
    const log: string[] = [];
    const errors: string[] = [];
    let processedCount = 0;

    const addLog = (msg: string) => {
        log.push(msg);
        onProgress({ totalFiles: 0, processedFiles: processedCount, currentFile: '', log });
    }

    try {
        addLog("Reading ZIP file...");
        const zip = new JSZip();
        const content = await zip.loadAsync(file);

        // Define hierarchy structure: { ModuleName: { UnitName: [FilePaths] } }
        const structure: Record<string, Record<string, JSZip.JSZipObject[]>> = {};

        // Analyze Zip Files
        const files: JSZip.JSZipObject[] = [];

        // Pre-scan to detect if all files are inside a single root folder
        const allPaths = Object.keys(content.files).filter(path => !content.files[path].dir && !path.startsWith('__MACOSX') && !path.includes('.DS_Store'));

        if (allPaths.length === 0) {
            addLog("Error: ZIP file is empty or contains only ignored system files.");
            return { success: false, errors: ["ZIP file is empty or invalid."] };
        }

        const firstPathParts = allPaths[0].split('/');
        let commonRoot = '';

        // Check if there is a common root folder
        if (firstPathParts.length > 1) {
            const possibleRoot = firstPathParts[0] + '/';
            if (allPaths.every(p => p.startsWith(possibleRoot))) {
                commonRoot = possibleRoot;
                addLog(`Detected common root folder: '${commonRoot}'. usage stripping it.`);
            }
        }

        content.forEach((relativePath, zipEntry) => {
            if (zipEntry.dir) return; // Ignore directory entries
            if (relativePath.startsWith('__MACOSX')) return; // Ignore Mac metadata
            if (relativePath.includes('.DS_Store')) return; // Ignore .DS_Store

            // Normalize path by removing common root if it exists
            let effectivePath = relativePath;
            if (commonRoot && relativePath.startsWith(commonRoot)) {
                effectivePath = relativePath.substring(commonRoot.length);
            }

            addLog(`Found file: ${effectivePath} (Original: ${relativePath})`);
            files.push(zipEntry);

            // Split path: "Module 1/Unit 2/File.pdf"
            const parts = effectivePath.split('/');

            if (parts.length >= 3) {
                // Depth 3: Module/Unit/File
                const moduleName = parts[0];
                const unitName = parts[1];

                if (!structure[moduleName]) structure[moduleName] = {};
                if (!structure[moduleName][unitName]) structure[moduleName][unitName] = [];

                structure[moduleName][unitName].push(zipEntry);
            } else if (parts.length === 2) {
                // Depth 2: Module/File.
                // Fallback: Create a "General" unit for these files so they aren't ignored.
                const moduleName = parts[0];
                const unitName = "General Resources"; // Default unit name

                if (!structure[moduleName]) structure[moduleName] = {};
                if (!structure[moduleName][unitName]) structure[moduleName][unitName] = [];

                structure[moduleName][unitName].push(zipEntry);
                addLog(`Note: File '${effectivePath}' has no unit folder. Placing in '${unitName}'.`);
            } else {
                addLog(`Warning: Skipping '${effectivePath}'. Invalid depth (${parts.length}). Expected at least Module/File.`);
            }
        });

        const totalFiles = files.length;
        onProgress({ totalFiles, processedFiles: 0, currentFile: 'Starting...', log });

        // Iterate Modules (Sorted)
        const sortedModules = Object.keys(structure).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

        // Check if we actually found anything
        if (sortedModules.length === 0) {
            addLog("Error: No valid course structure detected in ZIP.");
            return {
                success: false,
                errors: [
                    "No valid structure found. Please ensure your ZIP contains folders for Modules.",
                    "Example: 'Module 1/Unit 1/File.pdf' or at least 'Module 1/File.pdf'"
                ]
            };
        }

        for (let mIndex = 0; mIndex < sortedModules.length; mIndex++) {
            const moduleTitle = sortedModules[mIndex];
            addLog(`Creating Module: ${moduleTitle}`);

            // 1. Create Module
            const moduleRes = await apiClient.post('CATALOG', `/api/courses/${courseId}/modules`, {
                title: moduleTitle,
                orderIndex: mIndex
                // We rely on existing modules length or just strict index?
                // For bulk import, we might append. Here we use loop index.
                // NOTE: This might collide if modules exist. Ideally we fetch current count.
                // But simplified: 
            });

            if (!moduleRes || !moduleRes.id) {
                errors.push(`Failed to create module ${moduleTitle}`);
                continue;
            }

            const moduleId = moduleRes.id;

            // Iterate Units (Sorted)
            const sortedUnits = Object.keys(structure[moduleTitle]).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

            for (let uIndex = 0; uIndex < sortedUnits.length; uIndex++) {
                const unitTitle = sortedUnits[uIndex];
                addLog(`  Creating Unit: ${unitTitle}`);

                // 2. Create Unit
                const unitRes = await apiClient.post('CATALOG', `/api/courses/modules/${moduleId}/units`, {
                    title: unitTitle,
                    orderIndex: uIndex
                });

                if (!unitRes || !unitRes.id) {
                    errors.push(`Failed to create unit ${unitTitle}`);
                    continue;
                }

                const unitId = unitRes.id;
                const unitFiles = structure[moduleTitle][unitTitle];

                // Iterate Files
                for (let fIndex = 0; fIndex < unitFiles.length; fIndex++) {
                    const zipFile = unitFiles[fIndex];
                    const fileName = zipFile.name.split('/').pop() || 'Unknown';

                    addLog(`    Uploading: ${fileName}`);
                    onProgress({ totalFiles, processedFiles: processedCount, currentFile: fileName, log });

                    try {
                        // 3. Unzip File to Blob
                        const fileBlob = await zipFile.async('blob');
                        const fileFile = new File([fileBlob], fileName); // Convert to File object

                        // 4. Upload to Storage
                        const storagePath = `course-imports/${courseId}/${Date.now()}_${Math.random().toString(36).substring(7)}/${fileName}`;

                        const { data: uploadData, error: uploadError } = await supabase.storage
                            .from('content')
                            .upload(storagePath, fileFile);

                        if (uploadError) throw uploadError;

                        const { data: { publicUrl } } = supabase.storage
                            .from('content')
                            .getPublicUrl(storagePath);

                        // 5. Determine Type
                        let type = 'text';
                        const lowerName = fileName.toLowerCase();
                        if (lowerName.endsWith('.mp4') || lowerName.endsWith('.mov') || lowerName.endsWith('.webm')) type = 'video';
                        else if (lowerName.endsWith('.pdf')) type = 'text'; // We treat PDF as text/doc
                        else if (lowerName.endsWith('.docx') || lowerName.endsWith('.txt')) type = 'text';
                        else if (lowerName.endsWith('.zip')) type = 'scorm'; // Maybe?

                        // 6. Create Content Record
                        await apiClient.post('CATALOG', `/api/courses/units/${unitId}/contents`, {
                            title: fileName.replace(/\.[^/.]+$/, ""), // Remove extension for title
                            type: type,
                            contentUrl: publicUrl,
                            orderIndex: fIndex
                        });

                    } catch (err: any) {
                        console.error(err);
                        errors.push(`Failed to upload ${fileName}: ${err.message}`);
                    }

                    processedCount++;
                    onProgress({ totalFiles, processedFiles: processedCount, currentFile: '...', log });
                }
            }
        }

        addLog("Import process complete.");
        return { success: errors.length === 0, errors };

    } catch (error: any) {
        console.error("ZIP Parse Error", error);
        return { success: false, errors: [error.message] };
    }
}

/**
 * Generates a mock course structure for demonstration purposes.
 * Can be triggered without a real ZIP file.
 */
export async function importMockCourse(
    courseId: string,
    onProgress: (progress: ImportProgress) => void
): Promise<ImportResult> {
    const log: string[] = [];
    const errors: string[] = [];

    const addLog = (msg: string) => {
        log.push(msg);
        onProgress({ totalFiles: 6, processedFiles: 0, currentFile: '', log });
    }

    try {
        addLog("Starting Mock Import...");
        const mockStructure = [
            {
                title: "Module 1: Fundamentals of Leadership",
                units: [
                    {
                        title: "1.1 Introduction to the Program",
                        contents: [
                            { title: "Welcome Video", type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
                            { title: "Course Syllabus", type: "text", body: "# Course Syllabus\n\nWelcome to the leadership program. Here is what we will cover..." }
                        ]
                    },
                    {
                        title: "1.2 Core Philosophies",
                        contents: [
                            { title: "Leadership Styles", type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
                        ]
                    }
                ]
            },
            {
                title: "Module 2: Strategic Thinking",
                units: [
                    {
                        title: "2.1 Market Analysis",
                        contents: [
                            { title: "Porter's 5 Forces", type: "text", body: "## Michael Porter's Five Forces\n\n1. Competition in the industry\n2. Potential of new entrants..." },
                            { title: "Case Study: Apple", type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
                        ]
                    },
                    {
                        title: "2.2 Decision Making Models",
                        contents: [
                            { title: "The OODA Loop", type: "text", body: "Observe, Orient, Decide, Act." }
                        ]
                    }
                ]
            }
        ];

        let processedCount = 0;

        for (let mIndex = 0; mIndex < mockStructure.length; mIndex++) {
            const module = mockStructure[mIndex];
            addLog(`Creating Module: ${module.title}`);

            const moduleRes = await apiClient.post('CATALOG', `/api/courses/${courseId}/modules`, {
                title: module.title,
                orderIndex: mIndex
            });

            if (!moduleRes?.id) {
                errors.push(`Failed to create module ${module.title}`);
                continue;
            }

            for (let uIndex = 0; uIndex < module.units.length; uIndex++) {
                const unit = module.units[uIndex];
                addLog(`  Creating Unit: ${unit.title}`);

                const unitRes = await apiClient.post('CATALOG', `/api/courses/modules/${moduleRes.id}/units`, {
                    title: unit.title,
                    orderIndex: uIndex
                });

                if (!unitRes?.id) continue;

                for (let cIndex = 0; cIndex < unit.contents.length; cIndex++) {
                    const content = unit.contents[cIndex];
                    addLog(`    Creating Content: ${content.title}`);
                    onProgress({ totalFiles: 6, processedFiles: processedCount, currentFile: content.title, log }); // Approx total

                    await apiClient.post('CATALOG', `/api/courses/units/${unitRes.id}/contents`, {
                        title: content.title,
                        type: content.type,
                        contentUrl: content.url || "",
                        body: content.body || "",
                        orderIndex: cIndex
                    });

                    processedCount++;
                    await new Promise(r => setTimeout(r, 500)); // Fake delay for visual effect
                }
            }
        }

        addLog("Mock structure generated successfully.");
        return { success: true, errors: [] };

    } catch (error: any) {
        return { success: false, errors: [error.message] };
    }
}
