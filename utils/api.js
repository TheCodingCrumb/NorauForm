/**
 * Fonction utilitaire pour appeler le Google Apps Script
 * @param {string} route - La route à appeler (ex: "form-authorization", "submit-form")
 * @param {object} payload - Les données à envoyer
 * @returns {Promise<object>} Le résultat de l'appel API
 */
export async function callGoogleScript(route, payload) {
    const scriptId = window.APP_CONFIG?.GOOGLE_SCRIPT_ID;
    if (!scriptId) {
        const error = new Error("GOOGLE_SCRIPT_ID manquant dans config.js !");
        console.error(`[${new Date().toISOString()}] Configuration error for route ${route}:`, error.message);
        throw error;
    }

    const fullPayload = { route, ...payload };
    const startTime = Date.now();

    try {
        console.log(`[${new Date().toISOString()}] Starting API call to ${route} with payload:`, fullPayload);

        const response = await fetch(
            `https://script.google.com/macros/s/${scriptId}/exec`,
            {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(fullPayload),
            }
        );

        const duration = Date.now() - startTime;

        if (!response.ok) {
            const error = new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
            console.error(`[${new Date().toISOString()}] HTTP error for route ${route} (duration: ${duration}ms):`, {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                headers: Object.fromEntries(response.headers.entries())
            });
            throw error;
        }

        const result = await response.json();
        console.log(`[${new Date().toISOString()}] API call to ${route} successful (duration: ${duration}ms):`, result);
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[${new Date().toISOString()}] Error during API call to ${route} (duration: ${duration}ms):`, {
            error: error.message,
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        throw error;
    }
}