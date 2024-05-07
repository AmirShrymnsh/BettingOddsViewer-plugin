const axios = require('axios'); // Using axios for HTTP requests
const vscode = require('vscode');

function activate(context) {
    let panel = vscode.window.createWebviewPanel(
        'oddsView', 
        'Betting Odds', 
        vscode.ViewColumn.One,
        {}
    );

    async function updateOdds() {
        try {
            const response = await axios.get('https://api.the-odds-api.com/v3/odds', {
                params: {
                    api_key: '15e651e1e408f81a64dafe3bd20abccd', 
                    sport: 'soccer_epl', // Example: English Premier League
                    region: 'uk', // Example: Targets UK bookmakers
                    mkt: 'h2h' // Market type, h2h = head to head
                }
            });
            panel.webview.html = createHtml(response.data.data); // Adjust according to the actual data structure
        } catch (error) {
            console.error('Failed to fetch odds:', error);
            panel.webview.html = `Error fetching data: ${error}`;
        }
    }

    // Refresh odds every minute
    setInterval(updateOdds, 60000);
    updateOdds(); // Initial call

    context.subscriptions.push(panel);
}

function createHtml(data) {
    const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src 'nonce-XYZ';">`;
    let html = `<html><head>${csp}</head><body><h1>Betting Odds</h1>`;
    data.forEach(event => {
        html += `<p>${event.sport}: ${event.teams.join(' vs ')} - Odds: ${event.sites[0].odds.h2h.join(' | ')}</p>`; // Adjust based on actual API response structure
    });
    html += `</body></html>`;
    return html;
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
