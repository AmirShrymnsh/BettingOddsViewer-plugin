const vscode = require('vscode');
const axios = require('axios');

function activate(context) {
    console.log('Extension "betting-odds-viewer" is now active!');

    const panel = vscode.window.createWebviewPanel(
        'oddsView',
        'Betting Odds',
        vscode.ViewColumn.One,
        {}
    );

    const disposable = vscode.commands.registerCommand('extension.showOdds', async () => {
        vscode.window.showInformationMessage('Showing Betting Odds!');
        await updateOdds();
        panel.reveal(vscode.ViewColumn.One);
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(panel);

    async function updateOdds() {
        try {
            const response = await axios.get('https://api.the-odds-api.com/v3/odds', {
                params: {
                    api_key: '15e651e1e408f81a64dafe3bd20abccd', // Replace with your actual API key
                    sport: 'soccer_epl',
                    region: 'uk',
                    mkt: 'h2h'
                }
            });
            panel.webview.html = createHtml(response.data.data);
        } catch (error) {
            console.error('Failed to fetch odds:', error);
            panel.webview.html = `<html><body><h1>Error fetching data</h1><p>${error}</p></body></html>`;
        }
    }

    function createHtml(data) {
        const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; style-src 'unsafe-inline';">`;
        let html = `<html><head>${csp}</head><body><h1>Betting Odds</h1>`;
        data.forEach(event => {
            html += `<p>${event.sport}: ${event.teams.join(' vs ')} - Odds: ${event.sites[0].odds.h2h.join(' | ')}</p>`;
        });
        html += `</body></html>`;
        return html;
    }

    setInterval(updateOdds, 60000); // Refresh odds every minute
    updateOdds(); // Initial call to fetch odds
}

function deactivate() {
    console.log('Extension is now deactivated!');
}

module.exports = {
    activate,
    deactivate
};
