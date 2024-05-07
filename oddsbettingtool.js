const vscode = require('vscode');
const axios = require('axios'); // Using axios for HTTP requests

function activate(context) {
    let panel = vscode.window.createWebviewPanel(
        'oddsView', 
        'Betting Odds', 
        vscode.ViewColumn.One,
        {}
    );

    async function updateOdds() {
        try {
            const response = await axios.get('https://api.bettingodds.com/sports');
            panel.webview.html = createHtml(response.data);
        } catch (error) {
            panel.webview.html = `Error fetching data: ${error}`;
        }
    }

    // Refresh odds every minute
    setInterval(updateOdds, 60000);
    updateOdds(); // Initial call

    context.subscriptions.push(panel);
}

function createHtml(data) {
    // Simple HTML creation to show betting odds
    let html = `<h1>Betting Odds</h1>`;
    data.forEach(event => {
        html += `<p>${event.match}: ${event.odds}</p>`;
    });
    return html;
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
