// Google Drive API integration
declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let gapi: any;
let tokenClient: any;
let isGapiInited = false;
let isGisInited = false;

/**
 * Initialize Google APIs
 */
export const initializeGoogleDrive = async (): Promise<boolean> => {
    try {
        // Check if all required APIs are loaded
        if (typeof window === 'undefined') {
            console.log('Window is undefined');
            return false;
        }

        if (!window.gapi) {
            console.log('Google API (gapi) not loaded');
            return false;
        }

        if (!window.google?.accounts?.oauth2) {
            console.log('Google Identity Services not loaded');
            return false;
        }

        gapi = window.gapi;

        // Initialize gapi client
        await new Promise<void>((resolve, reject) => {
            gapi.load('client', async () => {
                try {
                    await gapi.client.init({
                        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
                        discoveryDocs: [DISCOVERY_DOC],
                    });
                    isGapiInited = true;
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });

        // Initialize Google Identity Services
        if (window.google?.accounts?.oauth2) {
            tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                scope: SCOPES,
                callback: '', // Will be set later
            });
            isGisInited = true;
        }

        console.log('Google Drive API initialized:', { isGapiInited, isGisInited });
        return isGapiInited && isGisInited;
    } catch (error) {
        console.error('Error initializing Google Drive API:', error);
        return false;
    }
};

// Specific Google Drive folder ID for Mihaszna Matek uploads
const MIHASZNA_DRIVE_FOLDER_ID = '18Mnh9VWWmJsSwMxorL3Awx8_KadcAuOz';

/**
 * Upload file to Google Drive
 */
export const uploadToGoogleDrive = async (
    file: File,
    subFolderName?: string
): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        if (!isGapiInited || !isGisInited) {
            reject(new Error('Google APIs not initialized'));
            return;
        }

        tokenClient.callback = async (response: any) => {
            if (response.error !== undefined) {
                reject(new Error(response.error));
                return;
            }

            try {
                let targetFolderId = MIHASZNA_DRIVE_FOLDER_ID;

                // Create subfolder if specified
                if (subFolderName) {
                    targetFolderId = await createSubFolder(subFolderName, MIHASZNA_DRIVE_FOLDER_ID);
                }

                // Upload file
                const fileId = await uploadFile(file, targetFolderId);

                if (fileId) {
                    // Make file shareable
                    await makeFileShareable(fileId);

                    // Get shareable link
                    const shareableLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
                    resolve(shareableLink);
                } else {
                    reject(new Error('Failed to upload file'));
                }
            } catch (error) {
                reject(error);
            }
        };

        if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            // Skip display of account chooser and consent dialog for an existing session
            tokenClient.requestAccessToken({ prompt: '' });
        }
    });
};

/**
 * Create subfolder in the main Mihaszna Matek folder
 */
const createSubFolder = async (subFolderName: string, parentFolderId: string): Promise<string> => {
    try {
        // Check if subfolder already exists in parent folder
        const response = await gapi.client.drive.files.list({
            q: `name='${subFolderName}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`,
            fields: 'files(id, name)',
        });

        if (response.result.files && response.result.files.length > 0) {
            return response.result.files[0].id;
        }

        // Create subfolder if it doesn't exist
        const folderResponse = await gapi.client.drive.files.create({
            resource: {
                name: subFolderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentFolderId],
            },
            fields: 'id',
        });

        return folderResponse.result.id;
    } catch (error) {
        console.error('Error creating subfolder:', error);
        throw error;
    }
};

/**
 * Create folder in Google Drive if it doesn't exist (legacy function)
 */
const createFolderIfNotExists = async (folderName: string): Promise<string> => {
    try {
        // Check if folder already exists
        const response = await gapi.client.drive.files.list({
            q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)',
        });

        if (response.result.files && response.result.files.length > 0) {
            return response.result.files[0].id;
        }

        // Create folder if it doesn't exist
        const folderResponse = await gapi.client.drive.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
            },
            fields: 'id',
        });

        return folderResponse.result.id;
    } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
    }
};

/**
 * Upload file to specific folder
 */
const uploadFile = async (file: File, folderId: string): Promise<string | null> => {
    const metadata = {
        name: file.name,
        parents: [folderId],
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    try {
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
            method: 'POST',
            headers: new Headers({
                Authorization: `Bearer ${gapi.client.getToken().access_token}`,
            }),
            body: form,
        });

        const result = await response.json();
        return result.id || null;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

/**
 * Make file shareable (anyone with link can view)
 */
const makeFileShareable = async (fileId: string): Promise<void> => {
    try {
        await gapi.client.drive.permissions.create({
            fileId: fileId,
            resource: {
                role: 'reader',
                type: 'anyone',
            },
        });
    } catch (error) {
        console.error('Error making file shareable:', error);
        throw error;
    }
};

/**
 * Get file info from Google Drive
 */
export const getFileInfo = async (fileId: string): Promise<any> => {
    try {
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            fields: 'id,name,size,mimeType,webViewLink,webContentLink',
        });
        return response.result;
    } catch (error) {
        console.error('Error getting file info:', error);
        throw error;
    }
};

/**
 * Revoke Google Drive access token
 */
export const revokeGoogleDriveAccess = (): void => {
    const token = gapi.client.getToken();
    if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
    }
};
